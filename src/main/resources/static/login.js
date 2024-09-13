const endpoint = "/api/auth";
const apiClientPath = "http://localhost:8081"

jQuery(document).ready(function() {
	jQuery("#loginForm").on("submit", function(e) {
		e.preventDefault();
		var username = jQuery("#username").val();
		var password = jQuery("#password").val();
		jQuery.ajax({
			url: apiClientPath + endpoint,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ username: username, password: password }),
			success: function(response) {
				sessionStorage.setItem('token', response);
				alert("Inicio de sesión exitoso");
				window.location.href = "/mascotas"
			},
			error: function(xhr, status, error) {
				alert("Error al iniciar sesión: " + xhr.responseText);
			}
		});
	});
});



