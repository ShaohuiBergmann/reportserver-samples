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
	const getFilteredFilesWithContent = (arr) => {
		const decoded = JSON.parse(atob(arr));
		const fileArr = decoded["data"];

		return filterOutEmptyFiles(fileArr);
	};
	///////////create new array of objects that has the filepath as key and content as value
	const createNewArrOfObj = (arr) => {
		const newArrOfVal = [];
		arr.forEach((el) => {
			const arrOfVal = Object.values(el);
			const newObj = createObj(arrOfVal);
			newArrOfVal.push(newObj);
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
	const filterOutEmptyFiles = (arr) => {
		const filteredFileArr = arr.filter((el) => {
			if (el) {
				return el.content !== "";
			}
		});

		return filteredFileArr;
	};
	const getLastItemInArr = (arr) => {
		return arr[arr.length - 1];
	};

	const getDateWithMatcher = (obj) => {
		const regex = /\d{4}.\d{2}.\d{2}/gm;
		return Object.keys(obj)[0].match(regex)[0];
	};

	const filterFilesWithCondition = (arr, filterCondition) => {
		const files = arr.filter((filtered) => {
			return Object.keys(filtered)[0].includes(filterCondition);
		});
		return files;
	};
	///////////functions to manipulate option elements to Dom

	// make the stdout file preselected and the content default value of textarea
	const makeStdoutDefault = (arr) => {
		arr.forEach((el) => {
			const regex = /stdout/gm;
			console.log("match", Object.keys(el)[0]);
			if (Object.keys(el)[0].match(regex)) {
				updateNodes("opts", "option", Object.keys(el)[0]);
				$("option").attr("selected", "selected");
				updateNodes("logContent", "textarea", Object.values(el));
			}
			updateNodes("opts", "option", Object.keys(el)[0]);
		});
	};

	const updateNodes = (selector, element, text) => {
		const ele = document.createElement(element);
		if (element === "textarea") {
			ele.setAttribute("readonly", true);
		}
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
	/////// function to set current Date as default value of date Input
	Date.prototype.toDateInputValue = function (latestDate) {
		var local = new Date(latestDate);
		local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
		return local.toJSON().slice(0, 10);
	};

	//////////////////event listener
	window.addEventListener("load", () => {
		console.log("page is fully loaded");
		getContent()
			.then((result) => {
				const filteredFilesWithContent = getFilteredFilesWithContent(result);
				const newArrOfObj = createNewArrOfObj(filteredFilesWithContent);
				const lastItemInArr = getLastItemInArr(newArrOfObj);
				const latestDateOfLogs = getDateWithMatcher(lastItemInArr);
				// set the date of the latest available log files as default
				$("#dateVal").val(new Date().toDateInputValue(latestDateOfLogs));
				const filesFromLatestDate = filterFilesWithCondition(
					newArrOfObj,
					latestDateOfLogs
				);
				// console.log(filesFromLatestDate);
				makeStdoutDefault(filesFromLatestDate);

				$("#dateVal").change((e) => {
					removeNodes("opts");
					removeNodes("logContent");
					const dateInputVal = e.target.value;
					//filter out all the obj that don't match the date
					const filteredArrWithDateVal = filterFilesWithCondition(
						newArrOfObj,
						dateInputVal
					);
					if (filteredArrWithDateVal.length == 0) {
						handleEmptyResult("opts", "option");
					} else {
						makeStdoutDefault(filteredArrWithDateVal);
					}
					$("#opts").change((e) => {
						removeNodes("logContent");
						const valOfOpts = e.target.value;
						const selectedFile = filteredArrWithDateVal.filter((el) => {
							return el[valOfOpts];
						});
						// console.log("select", valOfOpts);
						// console.log("select", selectedFile);
						if (selectedFile.length == 0) {
							handleEmptyResult("logContent", "p");
						} else {
							updateNodes("logContent", "textarea", selectedFile[0][valOfOpts]);
						}
					});
				});
			})
			.catch((e) => console.log("Error", e));
	});
})();
