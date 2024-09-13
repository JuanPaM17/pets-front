function init() {
	renderTable();
}

const endpoint = "/api/mascota";
const endpointCliente = "/api/cliente";
const endpointMedicamento = "/api/medicamento";

let documentoCliente = undefined;
let nombreMedicamento = undefined;

function renderTable() {
	_renderTableCentralized({
		pageId: pageId,
		labelNames: titles,
		showUrl: endpoint,
		dropdown: dropdown
	});
}

function validateAndSend() {
	const identificacion = jQuery("#identificacion").val().trim();
	if (identificacion === undefined || identificacion == "") {
		validationsFields("Identificacion es requerido");
		return;
	}
	const nombre = jQuery("#nombre").val().trim();
	if (nombre === undefined || nombre == "") {
		validationsFields("Nombre es requerido");
		return;
	}
	const raza = jQuery("#raza").val().trim();
	if (raza === undefined || raza == "") {
		validationsFields("Raza es requerido");
		return;
	}
	const edad = jQuery("#edad").val().trim();
	if (edad === undefined || edad == "") {
		validationsFields("Edad es requerido");
		return;
	}
	const peso = jQuery("#peso").val().trim();
	if (peso === undefined || peso == "") {
		validationsFields("Peso es requerido");
		return;
	}
	const inputCliente = jQuery("#cliente_th").val().trim();
	if ((inputCliente === undefined || inputCliente == "") && (documentoCliente === undefined || documentoCliente == "")) {
		validationsFields("Cliente es requerido");
		return;
	}
	const inputMedicamento = jQuery("#medicamento_th").val().trim();
	if ((inputMedicamento === undefined || inputMedicamento == "") && (nombreMedicamento === undefined || nombreMedicamento == "")) {
		validationsFields("Cliente es requerido");
		return;
	}
	_validationAndSendAJAX(pageId, endpoint + "/" + nombreMedicamento + "/" + documentoCliente, undefined, undefined, true, true, true);
}

function deleteRegistry(pageId, id) {
	_deleteRegistry(id, pageId, endpoint, true, undefined, true);
}

jQuery("#cliente_th").keypress(function(e) {
	if (e.which === 13) {
		buscarCliente();
	}
});

jQuery("#medicamento_th").keypress(function(e) {
	if (e.which === 13) {
		buscarMedicamento();
	}
});

function buscarCliente() {
	if (jQuery("#cliente_th").val().length >= 3) {
		KTTypeahead.initDemo2({
			id: "cliente_th",
			name: "cliente_th",
			ajax: true,
			url: endpointCliente + "/autocomplete?search=" + jQuery("#cliente_th").val(),
			onSelect: seleccionCliente,
			showAuto: true
		});
	}
}

function buscarMedicamento() {
	if (jQuery("#medicamento_th").val().length >= 3) {
		KTTypeahead.initDemo2({
			id: "medicamento_th",
			name: "medicamento_th",
			ajax: true,
			url: endpointMedicamento + "/autocomplete?search=" + jQuery("#medicamento_th").val(),
			onSelect: seleccionMedicamento,
			showAuto: true
		});
	}
}

function seleccionCliente(suggestion) {
	const hiddenDataArray = optionsTypeHead.cliente_th.hidden;
	documentoCliente = hiddenDataArray[0];
}

function seleccionMedicamento(suggestion) {
	const hiddenDataArray = optionsTypeHead.medicamento_th.hidden;
	nombreMedicamento = hiddenDataArray[0];
}


