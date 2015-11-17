$(document).ready(function(){

   /*
    * jQuery accessible simple (non-modal) tooltip window, using ARIA
    * Website: http://a11y.nicolas-hoffmann.net/simple-tooltip/
    * License MIT: https://github.com/nico3333fr/jquery-accessible-simple-tooltip-aria/blob/master/LICENSE
    */

   // loading tooltip ------------------------------------------------------------------------------------------------------------
   // init
   $js_simple_tooltips = $('.js-simple-tooltip');
   if ( $js_simple_tooltips.length ) { // if there are at least one :)
   
      $js_simple_tooltips.each( function(index_to_expand) {
          var $this = $(this) ,
              index_lisible = index_to_expand+1,
			        options = $this.data(),
              $tooltip_text = options.simpletooltipText || '',
              $tooltip_prefix_class = typeof options.simpletooltipPrefixClass !== 'undefined' ? options.simpletooltipPrefixClass + '-' : '',
              $tooltip_content_id = typeof options.simpletooltipContentId !== 'undefined' ? '#' + options.simpletooltipContentId : '',
              $tooltip_code;
          
          $this.attr({
              'aria-describedby' : 'label_simpletooltip_' + index_lisible
              });
				
          $this.wrap( '<span class="' + $tooltip_prefix_class + 'simpletooltip_container"></span>' );
				
          $tooltip_code = '<span class="js-simpletooltip ' + $tooltip_prefix_class + 'simpletooltip" id="label_simpletooltip_' + index_lisible + '" role="tooltip" aria-hidden="true">';		 
          if ( $tooltip_text !== '' ) {
             $tooltip_code += '' + $tooltip_text + '';
             }
             else {
                  if ( $tooltip_content_id !== '' && $($tooltip_content_id).length ) {
                      $tooltip_code += $($tooltip_content_id).html();
                      }
                  }
          $tooltip_code += '</span>';
		 
	        $( $tooltip_code ).insertAfter($this);

      });
   
      
      // events ------------------
      $( 'body' ).on( 'mouseenter focusin', '.js-simple-tooltip', function( event ) {
         var $this = $(this),
             $tooltip_to_show = $('#' + $this.attr( 'aria-describedby' ));
		     
         $tooltip_to_show.attr( 'aria-hidden', 'false');
     
      })
	    .on( "mouseleave focusout", ".js-simple-tooltip", function( event ) {
         var $this = $(this),
             $tooltip_to_show = $('#' + $this.attr( 'aria-describedby' ));
		     
         $tooltip_to_show.attr( 'aria-hidden', 'true');  
	    });
      
      // close esc key
      $( 'body' ).on( "keydown", ".js-simple-tooltip", function( event ) {
         var $this = $(this),
             $tooltip_to_show = $('#' + $this.attr( 'aria-describedby' ));
      
         if ( event.keyCode == 27 ) { // esc
             $tooltip_to_show.attr( 'aria-hidden', 'true');
            }
         
      });
   
   
   }

   
});   
