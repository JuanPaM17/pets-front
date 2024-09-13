var KTTagifyDemos = function() {
	var initEmptyTagify = function(inputId) {
		var input = document.getElementById(inputId);
		var tagify = new Tagify(input, {
			whitelist: [],
			blacklist: [],
			caseSensitive: false,
			keepInvalidTags: true,
			autoComplete: false
		});
		return tagify;
	}
	var initWithDataTagify = function(inputId, data) {
		var input = document.getElementById(inputId);
		var tagify = new Tagify(input, {
			whitelist: data,
			blacklist: [],
			caseSensitive: false,
			keepInvalidTags: true,
			autoComplete: false
		});
		tagify.addTags(data);
		return tagify;
	}
	var addTagsToTagify = function(tagifyInstance, additionalData) {
		tagifyInstance.addTags(additionalData);
	}
	var resetTagify = function(tagifyInstance) {
		tagifyInstance.removeAllTags();
	}
	var destroyTagify = function(tagifyInstance) {
		tagifyInstance.destroy();
	}
	return {
		// Exponer las funciones públicas aquí si es necesario
		initEmptyTagify: initEmptyTagify,
		initWithDataTagify: initWithDataTagify,
		addTagsToTagify: addTagsToTagify,
		resetTagify: resetTagify,
		destroyTagify: destroyTagify
	};
}();


