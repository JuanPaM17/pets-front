function init() {
	renderTable();
}

const endpoint = "/api/cliente";
const endpointMascota = "/api/mascota";

function renderTable() {
	_renderTableCentralized({
		pageId: pageId,
		labelNames: titles,
		showUrl: endpoint,
		dropdown: []
	});
}

function loadInformation(id) {
	_renderTableCentralized({
		pageId: pageIdDetail,
		labelNames: titlesDetail,
		showUrl: endpointMascota + "/" + id,
		dropdown: []
	});
}


