var KTAppSettings = {
	"breakpoints": {
		"sm": 576,
		"md": 768,
		"lg": 992,
		"xl": 1200,
		"xxl": 1400
	},
	"colors": {
		"theme": {
			"base": {
				"white": "#ffffff",
				"primary": "#3699FF",
				"secondary": "#E5EAEE",
				"success": "#1BC5BD",
				"info": "#8950FC",
				"warning": "#FFA800",
				"danger": "#F64E60",
				"light": "#E4E6EF",
				"dark": "#181C32"
			},
			"light": {
				"white": "#ffffff",
				"primary": "#E1F0FF",
				"secondary": "#EBEDF3",
				"success": "#C9F7F5",
				"info": "#EEE5FF",
				"warning": "#FFF4DE",
				"danger": "#FFE2E5",
				"light": "#F3F6F9",
				"dark": "#D6D6E0"
			},
			"inverse": {
				"white": "#ffffff",
				"primary": "#ffffff",
				"secondary": "#3F4254",
				"success": "#ffffff",
				"info": "#ffffff",
				"warning": "#ffffff",
				"danger": "#ffffff",
				"light": "#464E5F",
				"dark": "#ffffff"
			}
		},
		"gray": {
			"gray-100": "#F3F6F9",
			"gray-200": "#EBEDF3",
			"gray-300": "#E4E6EF",
			"gray-400": "#D1D3E0",
			"gray-500": "#B5B5C3",
			"gray-600": "#7E8299",
			"gray-700": "#5E6278",
			"gray-800": "#3F4254",
			"gray-900": "#181C32"
		}
	},
	"font-family": "Poppins"
};

// Class Definition
var KTLogin = function() {
	var _login;
	var _showForm = function(form) {
		var cls = 'login-' + form + '-on';
		var form = 'kt_login_' + form + '_form';
		_login.removeClass('login-forgot-on');
		_login.removeClass('login-signin-on');
		_login.removeClass('login-signup-on');
		_login.addClass(cls);
		KTUtil.animateClass(KTUtil.getById(form), 'animate__animated animate__backInUp');
	}
	var _handleSignInForm = function() {
		// Handle forgot button
		$('#kt_login_forgot').on('click', function(e) {
			e.preventDefault();
			_showForm('forgot');
		});
		// Handle signup
		$('#kt_login_signup').on('click', function(e) {
			e.preventDefault();
			_showForm('signup');
		});
	}
	var _handleSignUpForm = function(e) {
		var form = KTUtil.getById('kt_login_signup_form');
		// Handle cancel button
		$('#kt_login_signup_cancel').on('click', function(e) {
			e.preventDefault();
			_showForm('signin');
		});
	}
	var _handleForgotForm = function(e) {
		// Handle cancel button
		$('#kt_login_forgot_cancel').on('click', function(e) {
			e.preventDefault();
			_showForm('signin');
		});
	}
	// Public Functions
	return {
		// public functions
		init: function() {
			_login = $('#kt_login');
			_handleSignInForm();
			_handleSignUpForm();
			_handleForgotForm();
		}
	};
}();
// Class Initialization
jQuery(document).ready(function() {
	KTLogin.init();
});