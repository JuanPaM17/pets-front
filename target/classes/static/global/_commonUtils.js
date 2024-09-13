jQuery(document).ready(function() {
	if (typeof jQuery("#errors") != "undefined" && jQuery("#errors").text().trim() != "") {
		validationsErrors(jQuery("#errors").text());
	}
});

var requestReponse = null;
var optionsMap = optionsMap || {};
var optionsTypeHead = optionsTypeHead || {};
var apiClientPath = "http://localhost:8081";
var token = sessionStorage.getItem('token');

function _validationAndSendAJAX(pageId, url, async, method, closeModal, alert, isTable, object, callback) {
	notifyStart();
	if (method === undefined) {
		method = "POST";
	}
	if (async === undefined) {
		async = true;
	}
	var objectData = object;
	if (objectData == undefined) {
		var objectData = {};
		var formData = jQuery('#' + pageId + '_form').serializeArray();
		jQuery.each(formData, function() {
			objectData[this.name] = this.value;
		});
	}
	jQuery.ajax({
		type: method,
		url: apiClientPath + url,
		data: JSON.stringify(objectData),
		contentType: 'application/json',
		headers: {
			'Authorization': 'Bearer ' + token
		},
		async: async,
		success: function(data) {
			requestReponse = data;
			if (data.errors == undefined || data.errors == "") {
				if (closeModal != undefined) {
					jQuery('[data-dismiss="modal"]').click();
				}
				if (isTable) {
					_renderTableCentralized({ pageId: pageId, forceQuery: true });
				}
				if (alert) {
					validationsSuccess(data.success);
				}
				if (typeof callback === 'function') {
					callback();
				}
				_clearId(pageId)
			} else {
				validationsErrors(data.errors);
			}
		},
		complete: function() {
			notifyComplete();
		},
		error: function(xhr, status, error) {
			notifyComplete();
			validationsErrors(xhr.responseJSON.message);
		}
	});
}

function _deleteRegistry(id, pageId, deleteUrl, alert, callback, isTable) {
	const fullUrl = deleteUrl + "/" + id;
	Swal.fire({
		title: "Estas seguro de eliminar?",
		text: "No se podra revertir esta accion",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: "Cancelar",
		confirmButtonText: "Si"
	}).then((result) => {
		if (result.isConfirmed) {
			notifyStart();
			jQuery.ajax({
				type: 'DELETE',
				url: apiClientPath + fullUrl,
				contentType: 'application/json',
				headers: {
					'Authorization': 'Bearer ' + token
				},
				async: true,
				success: function(data) {
					if (typeof data != "undefined" || data != "") {
						if (!!isTable) {
							_renderTableCentralized({ pageId: pageId, forceQuery: true });
						}
						if (alert) {
							validationsSuccess(data);
						}
						if (typeof callback === 'function') {
							callback();
						}
					} else {
						validationsErrors("Internal error");
					}
				},
				complete: function() {
					notifyComplete();
				},
				error: function(xhr, status, error) {
					notifyComplete();
					validationsErrors(xhr.responseJSON.message);
				}
			});
		}
	});
}

function _loadForm(pageId, id) {
	notifyStart();
	// Buscar la fila que corresponde al ID en la tabla
	const fila = $("#" + pageId + "_tableCentralized tbody tr").filter(function() {
		return $(this).find("td:first").text() == id;
	});
	// Verificar si se encontró la fila
	if (fila.length === 0) {
		console.error("No se encontró la fila con el ID: " + id);
		notifyComplete();
		return;
	}
	// Obtener los valores de todas las columnas, incluyendo el nombre de la columna
	const valores = {};
	fila.find("td:not(:has(.dropdown))").each(function(index) {
		let nombreColumna = $("#" + pageId + "_tableCentralized thead th").eq(index).text();
		for (const key in optionsMap[pageId].labelNames) {
			if (optionsMap[pageId].labelNames[key] === nombreColumna) {
				nombreColumna = key;
			}
		}
		const valor = $(this).text();
		valores[nombreColumna] = valor;
		const selectElement = $("#" + nombreColumna);
		if (selectElement.is("select")) {
			// Si es un select, utiliza Bootstrap Select para asignar el valor
			selectElement.selectpicker('val', valor);
			selectElement.selectpicker('refresh');
		} else {
			// Si no es un select, asigna el valor directamente
			selectElement.val(valor);
		}
	});
	notifyComplete();
}

function _getRowValues(pageId, id) {
	// Buscar la fila que corresponde al ID en la tabla
	const fila = jQuery("#" + pageId + "_tableCentralized tbody tr").filter(function() {
		return jQuery(this).find("td:first").text() == id;
	});
	// Verificar si se encontró la fila
	if (fila.length === 0) {
		console.error("No se encontró la fila con el ID: " + id);
		return;
	}
	// Obtener los valores de todas las columnas, incluyendo el nombre de la columna
	const valores = {};
	fila.find("td:not(:has(.dropdown))").each(function(index) {
		const nombreColumna = $("#" + pageId + "_tableCentralized thead th").eq(index).text();
		const valor = $(this).html();
		valores[nombreColumna] = valor;
	});
	return valores;
}

function getFilters(pageId) {
	var selector = '[id^="' + pageId + '"][name^="' + pageId + '"][id$="_filters"][name$="_filters"]';
	var elements = document.querySelectorAll(selector);
	var params = "";
	elements.forEach(function(element) {
		if (element.tagName === "SELECT" || (element.tagName === "INPUT" && (element.type === "text" || element.type === "date"))) {
			if (element.value !== "-1" && element.value.trim() !== "") {
				params += "&" + element.id.replace(pageId + "_", "") + "=" + element.value;
			}
		}
	});
	return params;
}

function _buildURL(pageId, page, forceQuery) {
	if (optionsMap[pageId] == undefined) optionsMap[pageId] = {};
	if (forceQuery) {
		page = 1;
		optionsMap[pageId]['page'] = page;

	} else {
		if (page == undefined) page = 1;
	}
	if (optionsMap[pageId]['forcedLimit'] != undefined) {
		forcedOrDefaultLimit = optionsMap[pageId]['forcedLimit'];
	} else {
		forcedOrDefaultLimit = REGISTER_LIMIT_PER_PAGE;
	}
	optionsMap[pageId]['search'] = jQuery('#' + pageId + '_search').val();
	var fullUrl = optionsMap[pageId]['url'] + "?";
	if (optionsMap[pageId]['url'].substring(optionsMap[pageId]['url'].length - 1, optionsMap[pageId]['url'].length) != "?") {
		fullUrl += "&";
	}
	fullUrl += "size=" + forcedOrDefaultLimit + "&search=" + optionsMap[pageId]['search'] + "&page=" + page;
	if (optionsMap[pageId]['params'] != undefined) {
		for (p in optionsMap[pageId]['params']) {
			fullUrl += "&" + p + "=" + optionsMap[pageId]['params'][p];
		}
	}
	if (fullUrl != optionsMap[pageId]['fullUrl']) {
		optionsMap[pageId]['fullUrl'] = fullUrl;
		return true;
	}
	if (forceQuery) {
		return true;
	}
	return false;
}

function _renderTableCentralized(options) {
	notifyStart();
	if (optionsMap[options.pageId] == undefined) optionsMap[options.pageId] = {};
	if (optionsMap[options.pageId]['page'] == undefined) {
		optionsMap[options.pageId]['page'] = 1;
	}
	if (optionsMap[options.pageId]['page'] != options.page) {
		if (options.params != undefined) {
			optionsMap[options.pageId]['params'] = options.params;
		}
		if (options.labelNames != undefined) {
			optionsMap[options.pageId]['labelNames'] = options.labelNames;
		}
		if (options.showUrl != undefined) {
			optionsMap[options.pageId]['url'] = options.showUrl;
		}
		if (options.dropdown != undefined) {
			optionsMap[options.pageId]['dropdown'] = options.dropdown;
		}
		if (options.dropdownCustomize != undefined) {
			optionsMap[options.pageId]['dropdownCustomize'] = options.dropdownCustomize;
		}
		if (options.async != undefined) {
			optionsMap[options.pageId]['async'] = options.async;
		}
		if (options.pagination != undefined) {
			optionsMap[options.pageId]['pagination'] = options.pagination;
		}
		if (options.forceQuery != undefined) {
			optionsMap[options.forceQuery] = options.forceQuery;
		}
		if (optionsMap[options.pageId]['forcedLimit'] != undefined) {
			forcedOrDefaultLimit = optionsMap[options.pageId]['forcedLimit'];
		} else {
			optionsMap[options.pageId]['forcedLimit'] = REGISTER_LIMIT_PER_PAGE;
			forcedOrDefaultLimit = optionsMap[options.pageId]['forcedLimit'];
		}
		var forceQuery = false;
		if (optionsMap[options.forceQuery] != undefined && optionsMap[options.forceQuery] != null && optionsMap[options.forceQuery] == true) {
			forceQuery = true;
		}
		if (options.page != undefined) {
			var doRequest = _buildURL(options.pageId, options.page, forceQuery);
		} else if (optionsMap[options.pageId]['page'] != undefined) {
			const searchValue = jQuery('#' + pageId + '_search').val();
			if (searchValue != undefined && searchValue != null && searchValue != "") {
				optionsMap[options.pageId]['page'] = 1;
			}
			var doRequest = _buildURL(options.pageId, optionsMap[options.pageId]['page'], forceQuery);
		}
		if (!doRequest) {
			notifyComplete();
			return;
		}
		jQuery.ajax({
			type: 'GET',
			url: apiClientPath + optionsMap[options.pageId]['fullUrl'],
			contentType: 'application/json',
			headers: {
				'Authorization': 'Bearer ' + token
			},
			async: optionsMap[options.pageId]['async'],
			success: function(data) {
				if (data.records != undefined && data.totalRecords > 0) {
					jQuery("#" + options.pageId + "_centralizedTable").empty();
					var html = '';
					html += `<table id="${options.pageId}_tableCentralized" class="table table-responsive-sm table-responsive-md">
					<thead class="thead-light">
						<tr>`;
					let labelNames = optionsMap[options.pageId]['labelNames'];
					let dropdown = optionsMap[options.pageId]['dropdown'];
					let dropdownCustomize = optionsMap[options.pageId]['dropdownCustomize'];
					// Titulos de la tabla
					for (let key in labelNames) {
						if (labelNames.hasOwnProperty(key)) {
							if (labelNames[key] !== "#") {
								html += `<th scope="col">${labelNames[key]}</th>`;
							} else {
								html += `<th scope="col" class="d-none">${key}</th>`;
							}
						}
					}

					// Titulos de la tabla que no se mostraran
					const titles = data.records[0];
					let missingKeysList = [];
					for (let key in titles) {
						if (titles.hasOwnProperty(key) && !labelNames.hasOwnProperty(key)) {
							html += `<th scope="col" class="d-none">${key}</th>`;
							missingKeysList.push(key);
						}
					}
					// Titulo de acciones de la tabla
					if ((dropdown != undefined && dropdown.length > 0) || dropdownCustomize != undefined) {
						html += `<th></th>`;
					}
					html += "</tr></thead>";
					html += '<tbody id="tableBody">';
					const records = data.records;
					for (let i = 0; i < records.length; i++) {
						html += "<tr>";
						const dataRecord = records[i];
						let id;
						// datos de la tabla que se mostraran
						for (let key in labelNames) {
							if (dataRecord.hasOwnProperty(key)) {
								if (key == 'id') {
									id = dataRecord[key];
								}
								if (labelNames[key] !== "#") {
									html += `<td>${dataRecord[key]}</td>`;
								} else {
									html += `<td class="d-none">${dataRecord[key]}</td>`;
								}
							}
						}
						// Datos de la tabla que no se mostraran
						for (let i = 0; i < missingKeysList.length; i++) {
							html += `<td class="d-none">${dataRecord[missingKeysList[i]]}</td>`;
						}
						// Acciones de la tabla
						if (dropdown != undefined && dropdown.length > 0) {
							html += "<td>";
							html += `<div typ class="dropdown dropdown-inline">
								    <button type="button" class="btn btn-icon btn-sm btn-hover-light-primary draggable-handle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								        <i class="ki ki-bold-more-ver"></i>
								    </button>
								<div class="dropdown-menu">`;
							for (let k = 0; k < dropdown.length; k++) {
								let method = "";
								if (dropdown[k].method != undefined) {
									method = `onclick="${dropdown[k].method}('${options.pageId}','${id}')"`;
								}
								let modal = "";
								if (dropdown[k].modal != undefined) {
									modal = `data-toggle="modal" data-target="#${dropdown[k].modal}"`;
								}
								let href = "";
								if (dropdown[k].href != undefined) {
									let target = "";
									if (dropdown[k].target != undefined && dropdown[k].target == true) {
										target = `target="_blank"`;
									}
									href = `href="${dropdown[k].href}" ${target}`;
								}
								html += `<a class="dropdown-item" name="${dropdown[k].name != undefined ? dropdown[k].name : ""}" ${href} ${method} ${modal}>${dropdown[k].label}</a>`
							}
							html += `</div>
								</div>
							</td>`;
						}
						if (dropdownCustomize != undefined) {
							html += "<td>";
							html += `<div typ class="dropdown dropdown-inline">
								    <button type="button" class="btn btn-icon btn-sm btn-hover-light-primary draggable-handle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								        <i class="ki ki-bold-more-ver"></i>
								    </button>
									<div class="dropdown-menu">`;
							html += records[i].dropdownCustomize;
							html += `</div>
							</div>`;
							html += "</td>";
						}
					}
					html += "</tr>";
					html += "</tbody></table>"
				} else {
					html = `<div class="text-center">
							Registros no encontrados
						</div>`;
				}
				jQuery("#" + options.pageId + "_centralizedTable").html(html);
				optionsMap[options.pageId]['totalRecords'] = data.totalRecords;
				optionsMap[options.pageId]['records'] = data.records;
				if (options.page != undefined) {
					optionsMap[options.pageId]['page'] = options.page;
				}
				if (optionsMap[options.pageId]['pagination'] !== false) {
					_renderPagination(options, "_renderTableCentralized", forcedOrDefaultLimit);
				}
			},
			complete: function() {
				notifyComplete();
			},
			error: function(xhr, status, error) {
				notifyComplete();
				if (xhr.status = 403) {
					displayMessage(options.pageId, "Access denied")
				} else {
					if (typeof xhr.responseJSON != "undefined") {
						displayMessage(options.pageId, xhr.responseJSON.message)
					}
				}
			}
		});
	} else {
		notifyComplete();
	}
}

function _renderPagination(options, method, limit) {
	let totalRecords = optionsMap[options.pageId]['totalRecords'];
	var records = optionsMap[options.pageId]["records"];
	var page = optionsMap[options.pageId]['page'];
	if (records.length <= 0) {
		page = 1;
		totalRecords = 0;
	}
	var npages = Math.ceil(totalRecords / limit);
	if (npages == 0) {
		npages = 1;
	}
	if (optionsMap[options.pageId]['forcedLimit'] != undefined) {
		forcedOrDefaultLimit = optionsMap[options.pageId]['forcedLimit'];
	} else {
		forcedOrDefaultLimit = REGISTER_LIMIT_PER_PAGE;
	}
	var startIndex = (page - 1) <= 0 ? 1 : page - 1;
	var endIndex = (page + 5) >= npages ? npages : page + 5;
	var html = '';
	html += `<div class="d-flex flex-wrap py-2 mr-3" id="${pageId}_paginationDiv">`;
	if (page > 1) {
		html += '<a href="javascript:void(' + method + '({pageId:\'' + options.pageId + '\',page:1}));" class="btn btn-icon btn-sm btn-light-primary mr-2 my-1"><i class="ki ki-double-arrow-back icon-xs"></i></a></li>';
		html += '<a href="javascript:void(' + method + '({pageId:\'' + options.pageId + '\',page:' + parseInt(page - 1) + '}));" class="btn btn-icon btn-sm btn-light-primary mr-2 my-1"><i class="ki ki-arrow-back icon-xs"></i></a></li>';
	} else {
		html += '<a class="disabled btn btn-icon btn-sm btn-light-primary mr-2 my-1" disabled="disabled"><i class="ki ki-double-arrow-back icon-xs"></i></a>';
		html += '<a class="disabled btn btn-icon btn-sm btn-light-primary mr-2 my-1" disabled="disabled"><i class="ki ki-arrow-back icon-xs"></i></a>';
	}

	for (var i = startIndex; i <= endIndex; i++) {
		html += i == page ?
			'<a href="javascript:void(' + method + '({pageId:\'' + options.pageId + '\',page:' + i + '}));" class="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 active">' + i + '</a>' :
			'<a href="javascript:void(' + method + '({pageId:\'' + options.pageId + '\',page:' + i + '}));" class="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1">' + i + '</a>';
	}

	if (page < npages) {
		html += '<a href="javascript:void(' + method + '({pageId:\'' + options.pageId + '\',page:' + parseInt(page + 1) + '}));" class="btn btn-icon btn-sm btn-light-primary mr-2 my-1"><i class="ki ki-arrow-next icon-xs"></i></a>';
		html += '<a href="javascript:void(' + method + '({pageId:\'' + options.pageId + '\',page:' + npages + '}));" class="btn btn-icon btn-sm btn-light-primary mr-2 my-1"><i class="ki ki-double-arrow-next icon-xs"></i></a>';
	} else {
		html += '<a class="disabled btn btn-icon btn-sm btn-light-primary mr-2 my-1" disabled="disabled"><i class="ki ki-arrow-next icon-xs"></i></a>';
		html += '<a class="disabled btn btn-icon btn-sm btn-light-primary mr-2 my-1" disabled="disabled"><i class="ki ki-double-arrow-next icon-xs"></i></a>';
	}
	var start = page == 1 ? 1 : Math.max(forcedOrDefaultLimit * (page - 1), 0) + 1;
	var end = Math.min((start - 1) + forcedOrDefaultLimit, totalRecords);
	if (totalRecords == 0) {
		start = 0;
	}
	let selectedLimit = optionsMap[options.pageId]['forcedLimit'];
	html += `</div>`;
	html += `
		    <div class="d-flex align-items-center py-3">
		        <select class="form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary" id="${options.pageId}_pageSizeSelect" style="width: 75px;" onchange="updateAccordionRegistersPerPage(this.value, '${options.pageId}')">
		            <option value="5" ${selectedLimit == 5 ? 'selected' : ''}>5</option>
		            <option value="10" ${selectedLimit == 10 ? 'selected' : ''}>10</option>
		            <option value="20" ${selectedLimit == 20 ? 'selected' : ''}>20</option>
		            <option value="30" ${selectedLimit == 30 ? 'selected' : ''}>30</option>
		            <option value="${totalRecords}" ${selectedLimit == totalRecords ? 'selected' : ''}>Todos</option>
		        </select>
		        <span class="text-muted" id="${pageId}_recordsInfo">
		            <span class="text-muted" id="status_product_recordsInfo">Mostrando ${start} - ${end} de ${totalRecords} registros</span>
		        </span>
		    </div>`;
	jQuery("#" + options.pageId + "_centralizedPagination").html(html);
	notifyComplete();
}

function updateAccordionRegistersPerPage(value, pageId) {
	if (optionsMap[pageId]['forcedLimit'] != undefined) {
		optionsMap[pageId]['forcedLimit'] = parseInt(value);
	}
	registersPerPage = parseInt(value);
	_renderTableCentralized({ pageId: pageId, forceQuery: true });
}

function _renderSelect(select) {
	notifyStart();
	const $container = jQuery("#" + select.container);
	if ($container.length === 0) {
		console.error("Container not found:", select.container);
		return;
	}
	const fullUrl = select.dataSource + "id=" + select.id;
	jQuery.ajax({
		type: 'GET',
		url: fullUrl,
		contentType: 'application/json',
		async: true,
		success: function(data) {
			if (data.result != undefined) {
				$container.html(data.result);
				if (select.methods != undefined) {
					if (select.methods.onclick != undefined) {
						jQuery("#" + select.id + " option").on("click", select.methods.onclick);
					}
					if (select.methods.onchange != undefined) {
						jQuery("#" + select.id).on("change", function() {
							const selectedValue = $(this).val();
							const selectElement = this;
							select.methods.onchange(selectedValue, selectElement);
						});
					}
				}
				$container.find('.selectpicker').selectpicker('refresh');
			} else {
				validationsErrors(data.errors);
			}
		},
		complete: function() {
			notifyComplete();
		}
	});
}

function validationsErrors(mensaje) {
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		html: mensaje
	})
}

function validationsSuccess(mensaje) {
	Swal.fire({
		icon: 'success',
		title: 'Successfully',
		text: mensaje
	})
}

function validationsFields(mensaje) {
	Swal.fire({
		icon: 'warning',
		title: "Faltan campos",
		text: mensaje
	})
}

function validateEmail(correo) {
	const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!expresionRegular.test(correo)) {
		validationsFields("Email invalido");
		return false;
	}
	return true;
}

function _clearId(pageId) {
	jQuery('#' + pageId + '_form').trigger('reset');
	jQuery('#' + pageId + '_form select').selectpicker('val', '-1');
}

function notifyStart() {
	KTApp.blockPage();
}

function notifyComplete() {
	KTApp.unblockPage();
}

var KTTypeahead = function() {
	// Private functions
	var initDemo2 = function(options) {
		if (options.ajax) {
			jQuery.ajax({
				url: apiClientPath + options.url,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + token
				},
				dataType: 'json',
				success: function(data) {
					options.data = data.data;
					optionsTypeHead[options.id] = optionsTypeHead[options.id] || {};
					optionsTypeHead[options.id]["visible"] = data.data;
					optionsTypeHead[options.id]["hidden"] = data.hidden;
					// Inicializar Bloodhound y typeahead después de obtener los datos
					initializeTypeahead(options);
				},
				error: function(xhr, status, error) {
					console.error('Error al obtener los datos:', error);
				}
			});
		} else {
			initializeTypeahead(options);
		}
	};
	var initializeTypeahead = function(options) {
		var bloodhound = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.whitespace,
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			local: options.data
		});
		var $input = $('#' + options.id);
		if ($input.data('tt-typeahead')) {
			$input.typeahead('destroy');
		}
		$input.typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		}, {
			name: options.name,
			source: bloodhound
		});
		// Añadir manejador de eventos para selección
		$input.bind('typeahead:select', function(ev, suggestion) {
			// Llama a la función proporcionada en las opciones, si existe
			if (typeof options.onSelect === 'function') {
				options.onSelect(suggestion);
			}
		});
		if (options.showAuto) {
			$input.trigger('focus');
		}
	};
	return {
		initDemo2: initDemo2
	};
}();

function displayMessage(pageId, mDanger, mWarning, mSuccess, goUp) {
	jQuery('#' + pageId + '_alert_success').addClass("d-none").html("");
	jQuery('#' + pageId + '_alert_danger').addClass("d-none").html("");
	jQuery('#' + pageId + '_alert_warning').addClass("d-none").html("");
	if (mDanger != undefined && mDanger != "") {
		jQuery('#' + pageId + '_alert_danger').removeClass("d-none").html(mDanger);
	}
	if (mWarning != undefined && mWarning != "") {
		jQuery('#' + pageId + '_alert_warning').removeClass("d-none").html(mWarning);
	}
	if (mSuccess != undefined && mSuccess != "") {
		jQuery('#' + pageId + '_alert_success').removeClass("d-none").html(mSuccess);
	}
	if (goUp != undefined && goUp == true) {
		jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
	}
	setTimeout(function() {
		jQuery('#' + pageId + '_alert_success').addClass("d-none").html("");
		jQuery('#' + pageId + '_alert_danger').addClass("d-none").html("");
		jQuery('#' + pageId + '_alert_warning').addClass("d-none").html("");
	}, 5000);
}
