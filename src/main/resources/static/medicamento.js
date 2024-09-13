function init() {
	renderTable();
}

const endpoint = "/api/medicamento";

function renderTable() {
	_renderTableCentralized({
		pageId: pageId,
		labelNames: titles,
		showUrl: endpoint,
		dropdown: dropdown
	});
}

function validateAndSend() {
	const nombre = jQuery("#nombre").val().trim();
	if (nombre === undefined || nombre == "") {
		validationsFields("Nombre es requerido");
		return;
	}
	const descripcion = jQuery("#descripcion").val().trim();
	if (descripcion === undefined || descripcion == "") {
		validationsFields("Descripcion es requerido");
		return;
	}
	const dosis = jQuery("#dosis").val().trim();
	if (dosis === undefined || dosis == "") {
		validationsFields("Dosis es requerido");
		return;
	}
	_validationAndSendAJAX(pageId, endpoint, undefined, undefined, true, true, true);
}

function deleteRegistry(pageId, id) {
	_deleteRegistry(id, pageId, endpoint, true, undefined, true);
}


