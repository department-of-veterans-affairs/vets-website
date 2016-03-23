// JS for expandable cards (.va-card--expands)
$(document).ready(function() {
	$('.va-card-body').on('click', function(e){
    	if(e.target.nodeName == 'DIV') {
    		$(e.currentTarget).parent().toggleClass('va-card--hasdrawer--open');
    	}
    	// If the drawer is open, disable links in the card's body
    	if(e.target.nodeName == 'A' && $(e.currentTarget).parent().hasClass('va-card--hasdrawer--open')) {
    		e.preventDefault();
    	}
	});
});
