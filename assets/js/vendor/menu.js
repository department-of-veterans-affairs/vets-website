$(document).ready(function() {
	var triggerBttn = document.getElementById( 'trigger-overlay' );
	var overlay = document.querySelector( 'div.overlay' );
     if (overlay === null) {
       // More intentionally handle pages with the wrong page structure.
       console.error('No overlay. This function should not be loaded.');
       return;
     }
	var closeBttn = overlay.querySelector( 'button.overlay-close' );
	var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	function toggleOverlay() {
		if( overlay.classList.contains( 'open' ) ) {
			overlay.classList.remove( 'open' );
			overlay.classList.add( 'close' );
			var onEndTransitionFn = function( ev ) {
				if( support.transitions ) {
					if( ev.propertyName !== 'visibility' ) return;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				overlay.classList.remove( 'close' );
			};
			if( support.transitions ) {
				overlay.addEventListener( transEndEventName, onEndTransitionFn );
			}
			else {
				onEndTransitionFn();
			}
		}
		else if( !overlay.classList.contains( 'close' ) ) {
			overlay.classList.add( 'open' );
		}
	}

	triggerBttn.addEventListener( 'click', toggleOverlay );
	closeBttn.addEventListener( 'click', toggleOverlay );
});
