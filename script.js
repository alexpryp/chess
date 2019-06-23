"use strict"

document.onmousedown = function(e) {
	var dragElement = e.target;

	if(!dragElement.classList.contains('chessman')) return;

	var coords, shiftX, shiftY;

	startDrag(e.clientX, e.clientY);

	document.onmousemove = function(e) {
		moveAt(e.clientX, e.clientY);
	};

	dragElement.onmouseup = function() {
		finishDrag();
	};

	function startDrag(clientX, clientY) {
		shiftX = clientX - dragElement.getBoundingClientRect().left;
		shiftY = clientY - dragElement.getBoundingClientRect().top;

		dragElement.style.position = 'fixed';

		document.body.appendChild(dragElement);

		moveAt(clientX, clientY);
	}

	function finishDrag() {
		dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		dragElement.style.position = 'absolute';

		document.onmousemove = null;
		dragElement.onmouseup = null;
	}

	function moveAt(clientX, clientY) {
		var newX = clientX - shiftX;
		var newY = clientY - shiftY;

		var newBottom = newY + dragElement.offsetHeight;

		if (newBottom > document.documentElement.clientHeight) {
			var docBottom = document.documentElement.getBoundingClientRect().bottom;
			var scrollY = Math.min(docBottom - newBottom, 10);

			if (scrollY < 0) scroll = 0;

			window.scrollBy(0, scrollY);

			newY = Math.min(newY, documentElement.clientHeight - dragElement.offsetHeight);
		}

		if (newY < 0) {
			var scrollY = Math.min(-newY, 10);
			if (scrollY < 0) {
				scrollY = 0;
			}
			window.scrollBy(0, -scrollY);
			newY = Math.max(newY, 0);
		}

		if (newX < 0) {
			newX = 0;
		}
		if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
			newX = document.documentElement.clientWidth - dragElement.offsetWidth;
		}

		dragElement.style.left = newX + 'px';
		dragElement.style.top = newY + 'px';
	}

	return false;
}