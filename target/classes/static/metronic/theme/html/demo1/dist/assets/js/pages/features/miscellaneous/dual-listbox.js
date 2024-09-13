// Class definition
var KTDualListbox = function() {
	var initDemo3 = function(optionListBox) {
		// Dual Listbox
		var _this = document.getElementById(optionListBox.id);
		// init dual listbox
		var dualListBox = new DualListbox(_this, {
			addEvent: function(value) {
				console.log(value);
			},
			removeEvent: function(value) {
				console.log(value);
			},
			availableTitle: optionListBox.availableTitle,
			selectedTitle: optionListBox.selectedTitle,
			addButtonText: "Añadir",
			removeButtonText: "Remover",
			addAllButtonText: "Añadir todos",
			removeAllButtonText: "Remover todos"
		});
	};
	return {
		// public functions
		initDemo3: initDemo3
	};
}();