var KTFormRepeater = function() {
	// Private functions
	var initDemo1 = function(optionForm) {
		$('#' + optionForm.id).repeater({
			initEmpty: false,
			show: function() {
				$(this).slideDown();
			},
			hide: function(deleteElement) {
				$(this).slideUp(deleteElement);
			}
		});
	}
	var initDemo1Initial = function(optionForm) {
		$('#' + optionForm.id).repeater({
			initEmpty: false,
			defaultValues: {
				'text-input': 'foo'
			},
			show: function() {
				$(this).slideDown();
			},
			hide: function(deleteElement) {
				$(this).slideUp(deleteElement);
			},
			defaultCount: optionForm.initialCount
		});
	}

	var demo2 = function() {
		$('#ddsdsds').repeater({
			initEmpty: false,

			defaultValues: {
				'text-input': 'foo'
			},

			show: function() {
				$(this).slideDown();
			},

			hide: function(deleteElement) {
				if (confirm('Are you sure you want to delete this element?')) {
					$(this).slideUp(deleteElement);
				}
			}
		});
	}


	var demo3 = function() {
		$('#sadsds').repeater({
			initEmpty: false,

			defaultValues: {
				'text-input': 'foo'
			},

			show: function() {
				$(this).slideDown();
			},

			hide: function(deleteElement) {
				if (confirm('Are you sure you want to delete this element?')) {
					$(this).slideUp(deleteElement);
				}
			}
		});
	}

	var demo4 = function() {
		$('#kt_repeadsater_4').repeater({
			initEmpty: false,

			defaultValues: {
				'text-input': 'foo'
			},

			show: function() {
				$(this).slideDown();
			},

			hide: function(deleteElement) {
				$(this).slideUp(deleteElement);
			}
		});
	}

	var demo5 = function() {
		$('#kt_rdsepeater_5').repeater({
			initEmpty: false,

			defaultValues: {
				'text-input': 'foo'
			},

			show: function() {
				$(this).slideDown();
			},

			hide: function(deleteElement) {
				$(this).slideUp(deleteElement);
			}
		});
	}

	var demo6 = function() {
		$('#kt_repeatfaer_6').repeater({
			initEmpty: false,

			defaultValues: {
				'text-input': 'foo'
			},

			show: function() {
				$(this).slideDown();
			},

			hide: function(deleteElement) {
				$(this).slideUp(deleteElement);
			}
		});
	}
	return {
		// public functions
		initDemo1: initDemo1,
		initDemo1Initial: initDemo1Initial
	};
}();
