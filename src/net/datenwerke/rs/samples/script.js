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
	//////////function that decode and parse the result from getContent and filterout null and empty files
	const getFilteredFileArr = (arr) => {
		const decoded = JSON.parse(atob(arr));
		const fileArr = decoded["data"];
		return filterFileArr(fileArr);
	};
	///////////create new array of objects that has the filepath as key and content as value
	const createNewArrOfVar = (arr) => {
		const newArrOfVal = [];
		arr.forEach((el) => {
			const arrOfVal = Object.values(el);
			const newObj = createObj(arrOfVal);
			newArrOfVal.push(newObj);
			// console.log(newArrOfVal);
		});

		return newArrOfVal;
	};
	///////////function that convert date format e.g. 2023-01-12 to the format of 12-Dec-2022
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
	///////////function that declare an object {filepath: content}

	const createObj = (arr) => {
		const fileObj = {};
		// const p = arr[1].replace(/["]/g, " ");
		fileObj[arr[1]] = arr[0];
		// console.log(fileObj);
		return fileObj;
	};

	///////////filtered out the files that don't contain any content
	const filterFileArr = (arr) => {
		const filteredFileArr = arr.filter((el) => {
			if (el) {
				return el.content !== "";
			}
		});

		return filteredFileArr;
	};

	///////////functions to manipulate option elements to Dom

	const updateNodes = (selector, element, text) => {
		const ele = document.createElement(element);
		const node = document.createTextNode(text);
		ele.appendChild(node);
		document.getElementById(selector).appendChild(ele);
	};

	const removeNodes = (selector) => {
		const list = document.getElementById(selector);
		while (list.hasChildNodes()) {
			list.removeChild(list.firstChild);
		}
	};
	const handleEmptyResult = (selector, element) => {
		removeNodes(selector);
		const ele = document.createElement(element);
		const node = document.createTextNode("Sorry, No result found");
		ele.appendChild(node);
		document.getElementById(selector).appendChild(ele);
	};

	//////////////////event listener
	$("#dateVal").change((e) => {
		getContent().then((result) => {
			const filteredFileArr = getFilteredFileArr(result);
			const newArrOfVal = createNewArrOfVar(filteredFileArr);
			console.log("arr", newArrOfVal);
			removeNodes("opts");
			removeNodes("logContent");
			const arrOfKeys = [];
			newArrOfVal.forEach((el) => {
				const dateInputVal = e.target.value;
				if (Object.keys(el)[0].includes(dateInputVal)) {
					arrOfKeys.push(Object.keys(el)[0]);
					console.log("arrKy", arrOfKeys);
				}

				$("#opts").change((e) => {
					removeNodes("logContent");
					const valOfOpts = e.target.value;
					if (el[valOfOpts]) {
						updateNodes("logContent", "p", el[valOfOpts]);
					} else {
						removeNodes("logContent");
						handleEmptyResult("logContent", "p");
					}
				});
			});
			arrOfKeys.forEach((prop) => {
				updateNodes("opts", "option", prop);
			});
		});
	});
})();
