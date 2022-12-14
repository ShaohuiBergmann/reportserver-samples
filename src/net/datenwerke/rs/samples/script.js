(function () {
	const getContent = () => {
		$.ajax({
			url: "http://127.0.0.1:8080/reportserver/scriptAccess?path=/bin/exampleLog.groovy",
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			success: function (response) {
				console.log("Response from network request");
				console.log("response: ", response);

				// var htmlResponse = "";

				// for (let i = 0; i < response.length; i++) {
				// 	console.log("response[i].title: ", response[i].title);
				// 	htmlResponse += "<p>" + response[i].title + "</p>";
				// }

				// $(".results").html(htmlResponse);
			},
		});

		// $.get("/data.json", function (data) {
		// 	console.log("data: ", data);
		// });
	};

	getContent();
})();
