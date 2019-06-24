"use strict"

let wrapper = document.querySelector('#wrapper');

function pickElement(e) { 
	let dragElement = e.target;

	if(!dragElement.classList.contains('chessman')) return;

	let coords, shiftX, shiftY;

	function startDrag(clientX, clientY) {
		shiftX = clientX - dragElement.getBoundingClientRect().left;
		shiftY = clientY - dragElement.getBoundingClientRect().top;

		dragElement.style.position = 'fixed';

		document.body.appendChild(dragElement);

		moveAt(clientX, clientY);
	}

	function finishDrag() {
		//end of transfer, go from fixed to absolute-coordinates
		dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		dragElement.style.position = 'absolute';

		document.onmousemove = null;
		dragElement.onmouseup = null;
	}

	function moveAt(clientX, clientY) {
		//new coords
		let newX = clientX - shiftX;
		let newY = clientY - shiftY;


		//process the removal of the lower window border
		//new lower bound of the element
		let newBottom = newY + dragElement.offsetHeight;

		//if a new lower bound sticks out of the window - let's scroll it
		if (newBottom > document.documentElement.clientHeight) {
			//coordinate of the lower border of the document relative to the window
			let docBottom = document.documentElement.getBoundingClientRect().bottom;

			//scrollBy, if it is not limited, it can scroll beyond the current document boundary
			//usually scroll by 10px
			//but if the distance from newBottom to docBottom is less, then less
			let scrollY = Math.min(docBottom - newBottom, 10);

			//rounding errors with fully scrolled page
			//can lead to a negative scrollY, which will mean scrolling up
			//correct this error
			if (scrollY < 0) scroll = 0;

			window.scrollBy(0, scrollY);

			//with a sharp movement of the mouse element can be moved strongly down
			//if it has gone beyond the bottom of the document -
			//move to the lowest possible position within the document
			newY = Math.min(newY, documentElement.clientHeight - dragElement.offsetHeight);
		}


		// process the removal of the upper border of the window
		if (newY < 0) {
			//scroll up by 10px or less if we are at the very top
			let scrollY = Math.min(-newY, 10);
			if (scrollY < 0) {
				scrollY = 0; //fix rounding error
			}
			window.scrollBy(0, -scrollY);
			//with a sharp movement of the mouse, the element could "fly out" much up, fix it
			newY = Math.max(newY, 0);
		}

		//pinch the screen horizontally
		//there is no scrolling, everything is simple
		if (newX < 0) {
			newX = 0;
		}
		if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
			newX = document.documentElement.clientWidth - dragElement.offsetWidth;
		}

		dragElement.style.left = newX + 'px';
		dragElement.style.top = newY + 'px';
	}

	startDrag(e.clientX, e.clientY);

	document.onmousemove = function(e) {
		moveAt(e.clientX, e.clientY);
	};

	dragElement.onmouseup = function() {
		finishDrag();
	};

	//cancel the default action on mousedown (text selection, it is superfluous)
	event.preventDefault()
	return false;
}


wrapper.addEventListener('mousedown', pickElement);