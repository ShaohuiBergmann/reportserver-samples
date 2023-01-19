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
		getContent()
			.then((result) => {
				// clear the content of options and log content at everytime choose another day
				removeNodes("opts");
				removeNodes("logContent");
				const filteredFileArr = getFilteredFileArr(result);
				const newArrOfVal = createNewArrOfVar(filteredFileArr);
				const dateInputVal = e.target.value;

				//filter out all the obj that don't match the date

				const filteredArr = newArrOfVal.filter((filtered) => {
					return Object.keys(filtered)[0].includes(dateInputVal);
				});

				if (filteredArr.length == 0) {
					handleEmptyResult("opts", "option");
				} else {
					removeNodes("opts");
					filteredArr.forEach((el) => {
						updateNodes("opts", "option", Object.keys(el));
					});
				}
				$("#opts").change((e) => {
					removeNodes("logContent");
					const valOfOpts = e.target.value;
					const selectedFile = filteredArr.filter((el) => {
						return el[valOfOpts];
					});
					// console.log("select", valOfOpts);
					// console.log("select", selectedFile);
					if (selectedFile.length == 0) {
						handleEmptyResult("logContent", "p");
					} else {
						updateNodes("logContent", "p", selectedFile[0][valOfOpts]);
					}
				});
			})
			.catch((e) => console.log("Error", e));
	});
})();
