function init() {
	renderTable();
}

const endpoint = "/api/cliente";

function renderTable() {
	_renderTableCentralized({
		pageId: pageId,
		labelNames: titles,
		showUrl: endpoint,
		dropdown: dropdown
	});
}

function validateAndSend() {
	const cedula = jQuery("#cedula").val().trim();
	if (cedula === undefined || cedula == "") {
		validationsFields("Cedula es requerido");
		return;
	}
	const nombre = jQuery("#nombre").val().trim();
	if (nombre === undefined || nombre == "") {
		validationsFields("Nombre es requerido");
		return;
	}
	const apellidos = jQuery("#apellidos").val().trim();
	if (apellidos === undefined || apellidos == "") {
		validationsFields("Apellidos es requerido");
		return;
	}
	const direccion = jQuery("#direccion").val().trim();
	if (direccion === undefined || direccion == "") {
		validationsFields("Direccion es requerido");
		return;
	}
	const telefono = jQuery("#telefono").val().trim();
	if (telefono === undefined || telefono == "") {
		validationsFields("Telefono es requerido");
		return;
	}
	_validationAndSendAJAX(pageId, endpoint, undefined, undefined, true, true, true);
}

function deleteRegistry(pageId, id) {
	_deleteRegistry(id, pageId, endpoint, true, undefined, true);
}


