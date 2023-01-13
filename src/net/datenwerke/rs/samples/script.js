(function () {
	const getContent = async () => {
		return $.ajax({
			url: "http://127.0.0.1:8080/reportserver/scriptAccess?path=/bin/exampleLog.groovy",
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			success: function (resp) {
				return resp;
			},
			complete: function (resp) {
				console.log("completed");
			},
			error: function (resp) {
				console.log("error");
			},
		});
	};
	// function that convert date format e.g. 2023-01-12 to the format of 12-Dec-2022
	function convertDate(inputValue) {
		const date = new Date(inputValue);
		const options = { day: "numeric", month: "short", year: "numeric" };
		const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
			date
		);
		const dateArr = formattedDate.split(" ");
		const convertedDate = [dateArr[0], dateArr[1], dateArr[2]].join("-");
		console.log("converting to", convertedDate);
		return convertedDate;
	}
	// function that declare an object {filepath: content}
	const builtObj = (arr) => {
		const fileObj = {};
		fileObj[arr[1]] = arr[0];
		console.log("fileObj", fileObj);
	};

	// function that first gets arrays that contains the values of an object then call builtObj function to make a new obj {filePath: Content}
	const readFileArr = (arr) => {
		arr.forEach((el) => {
			const arrOfVal = Object.values(el);
			builtObj(arrOfVal);
			console.log(arrOfVal);
		});

		// console.log("ArrOfVal", ArrOfVal);
	};

	const filterFileArr = (arr) => {
		const filteredArr = arr.filter((el) => {
			console.log("el", el.content);
		});
		console.log("first,", filteredArr);
	};
	$("#btn").click((e) => {
		console.log("click happened");
		const dateInputVal = $("#dateVal").val();
		const convertedResult = convertDate(dateInputVal);
		try {
			getContent()
				.then((result) => {
					const decoded = JSON.parse(atob(result));
					const fileArr = decoded["data"];
					const filteredFileArr = filterFileArr(fileArr);
					//	console.log("filteredFileArr", filteredFileArr);
					//	readFileArr(fileArr);
				})
				.catch((e) => console.log("catch e", e));
		} catch (e) {
			console.log(e);
		}
	});
})();
