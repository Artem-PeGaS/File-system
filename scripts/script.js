$(document).ready(function() {
	$('.ajax').click(function() {
		$.ajax({
			// url: 'http://www.omdbapi.com/?i=tt3896198&apikey=ebd44eee&s=batman',
			url: 'https://api.tinify.com/output/dhgtyc4f108u1z8dv5at21gz2ukynxm2',
			method: 'GET',
			// contentType: "application/jsonp",
			// data: '{"source": {"url": "https://tinypng.com/images/panda-happy.png"} }',
			// username: 'api: JnqeqUjIAiEGM668mx4oWKkB1L9UoVwh',
			// beforeSend: function(xhr){
			//     xhr.setRequestHeader("Content-type", "application/jsonp");
			//     xhr.setRequestHeader("user", "api: JnqeqUjIAiEGM668mx4oWKkB1L9UoVwh");
			//     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
			// },
			success(result) {
				alert();
				console.log(result);
			}
		});
	});

	$('.XMLHttpRequest').click(function() {
		var xhr = new XMLHttpRequest();

		xhr.withCredentials = true;
		xhr.open('POST', 'https://api.tinify.com/shrink', true);

		xhr.setRequestHeader('Authorization', 'Basic JnqeqUjIAiEGM668mx4oWKkB1L9UoVwh');

		xhr.onload = function() {
			console.log(this.responseText);
		};
		xhr.onerror = function() {
			console.log(this);
			console.log('Ошибка ' + this.status);
		};
		xhr.send({ source: { url: 'https://tinypng.com/images/panda-happy.png' } });

		// var xhr = new XMLHttpRequest();

		// xhr.withCredentials = true;
		// xhr.open("GET", "http://api.bob.com", true);
		// xhr.setRequestHeader('Accept-Language', 'en-US');

		// xhr.onload = function() {
		//     console.log( this.responseText );
		// }
		// xhr.onerror = function() {
		//     console.log(this);
		//     console.log( 'Ошибка ' + this.status );
		// }
		// xhr.send();
	});
});
