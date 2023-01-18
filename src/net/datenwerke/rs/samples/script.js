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

	const createObj = (arr) => {
		const fileObj = {};
		// const p = arr[1].replace(/["]/g, " ");
		fileObj[arr[1]] = arr[0];
		// console.log(fileObj);
		return fileObj;
	};

	// filtered out the files that don't contain any content
	const filterFileArr = (arr) => {
		const filteredFileArr = arr.filter((el) => {
			if (el) {
				return el.content !== "";
			}
		});
		return filteredFileArr;
	};

	// function to add option elements to Dom

	const addOptions = (text) => {
		const opt = document.createElement("option");
		const node = document.createTextNode(text);
		opt.appendChild(node);
		document.getElementById("opts").appendChild(opt);
	};

	///////////////////////////////
	$("#btn").click(() => {
		console.log("click happened");
		const dateInputVal = $("#dateVal").val();
		console.log(dateInputVal);
		const convertedResult = convertDate(dateInputVal);
		try {
			getContent()
				.then((result) => {
					const decoded = JSON.parse(atob(result));
					const fileArr = decoded["data"];
					const filteredArr = filterFileArr(fileArr);
					const newArrOfVal = [];
					filteredArr.forEach((el) => {
						const arrOfVal = Object.values(el);
						const newObj = createObj(arrOfVal);
						newArrOfVal.push(newObj);
						// console.log(newArrOfVal);
						newArrOfVal.forEach((el) => {
							Object.keys(el).forEach((prop) => {
								// console.log(el[prop]);
								const dateInputVal = $("#dateVal").val();
								if (prop.includes(dateInputVal)) {
									console.log(prop);
									addOptions(prop);
								}
							});
						});
					});
				})
				.catch((e) => console.log("catch e", e));
		} catch (e) {
			console.log(e);
		}
	});
})();
