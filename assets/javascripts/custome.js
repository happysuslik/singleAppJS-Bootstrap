(function () {
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	}

	var tasksArray = [];
	var name = "";
    var data = "";
    var remove, timer1, hide;

	function init() {
		var submit = document.getElementById("submitForm");
		var form = getForm();
		var info_second = document.getElementById("info_second");

		outputTasks();
		document.getElementById("add_task").addEventListener("click", function(e) {
			e.preventDefault();
			activateSubmit(submit, form);
		});
		document.getElementById("undo").addEventListener("click", function(e) {
			e.preventDefault();
			var lists = document.getElementsByClassName("list-group-item");
			var li = "";
			for ( var i = 0; i < lists.length; i++) {
				if (lists[i].style.display == "none") {
					li = lists[i];
				}
			}
			cancelRemove();
			showTask(li);
		});
		submit.addEventListener("click", function(e) {
			e.preventDefault();
			addTaskToLocalStorage(form.name_task.value);
			displayAddedTask();
		});
		
	};

	function outputTasks() {
		if (store.get("tasksRecord")) {
			tasksArray = JSON.parse(store.get("tasksRecord"));
			for (var i = 0; i < tasksArray.length; i++) {
				name = tasksArray[i].value;
				data = tasksArray[i].dataCreateTask;
				listData(name, data, i);
				eventDestroyButton(i);
			}
		}
	};

	function displayAddedTask() {
		tasksArray = JSON.parse(store.get("tasksRecord"));
		var lastObj = tasksArray[tasksArray.length - 1];
		var index = tasksArray.length - 1;
		listData(lastObj.value, lastObj.dataCreateTask, index);
		eventDestroyButton(index);
	};

	function eventDestroyButton(index) {
		var btn = document.getElementById("name" + index);
		var li = document.getElementById("list-group-item" + index);
		var dialog = document.getElementById("delete");

		document.getElementById("close").addEventListener("click", function(e) {
   			e.preventDefault;
   			cancelRemove();
   			removeTask(index);
		});
	
		btn.addEventListener("click", function(e) {
			e.preventDefault;
			hideTask(li);
			var time = 5;
			
			timer1 = setInterval(function() {
				time -= 1;
				info_second.innerHTML = time;
			}, 1000);

			remove = setTimeout(function() {
				removeTask(index);
				clearTimeout(timer1);
			 }, 5000);

			hide = setTimeout(function() { $('#delete').modal('hide'); info_second.innerHTML = 5; }, 5500);

		});
	};

	function cancelRemove() {
		clearTimeout(timer1);
		clearTimeout(remove);
		clearTimeout(hide);
		info_second.innerHTML = 5;
	};

	function removeTask(index) {
		tasksArray.splice(index, 1);
		setDataToStore();
	};

	function hideTask(li) {
		li.style.display = "none";
	};

	function showTask(li) {
		li.style.display = "block";
	};

	function activateSubmit(submit, f) {
		submit.classList.add("disabled");
		f.name_task.value = "";
		f.name_task.addEventListener("input", function(e) {
			e.preventDefault();
			if (f.name_task.value != 0) {
				submit.classList.remove("disabled");
			}
		});
	};

	function addTaskToLocalStorage(value) {
		var data = dataCreateTask();
		var obj = {value: value, dataCreateTask: data};
		tasksArray.push(obj);
		setDataToStore();
	};

	function setDataToStore() {
		store.set('tasksRecord', JSON.stringify(tasksArray));
	};

	function dataCreateTask() {
		var date = new Date();
		var options = {
		  year: 'numeric',
		  month: 'long',
		  day: 'numeric',
		  hour: 'numeric',
		  minute: 'numeric'
		};
		var infoCreate = date.toLocaleString("ru", options);
		return infoCreate;
	};

	function getForm() {
		return document.form_add_task;
	};

	function listData(name, data, index) {
		var ul = document.getElementById("listTasks");
	
		var li = document.createElement('li');
		var div = document.createElement('div');
		var h4 = document.createElement('h4');
		var div2 = document.createElement('div');

		li.classList.add("list-group-item");
		div.classList.add("row");
		h4.classList.add("col-xs-10", "col-lg-11", "col-md-11", "col-sm-11");
		div2.classList.add("fa", "fa-trash", "fa-2x", "btn", "col-xs-2", "col-lg-1", "col-md-1", "col-sm-1");

		li.setAttribute("id", "list-group-item" + index);
		div2.setAttribute("href", "#delete");
		div2.setAttribute("aria-hidden", "true");
		div2.setAttribute("data-toggle", "modal");
		div2.setAttribute("id", "name" + index);
		
		h4.innerHTML = " <i>Name:</i> " + name + " <i>Create:</i> " + data;

		li.appendChild(div);
		div.appendChild(h4);
		div.appendChild(div2);

		ul.insertBefore(li, ul.firstChild);

	};
	
}) ();