// Fully accessible tooltip jQuery plugin with delegation.
// Ideal for view containers that may re-render content.
(function ($) {
  $.fn.tooltip = function () {
    this

    // Delegate to tooltip, Hide if tooltip receives mouse or is clicked (tooltip may stick if parent has focus)
      .on('mouseenter click', '.tooltip', function (e) {
        e.stopPropagation();
        $(this).removeClass('isVisible');
      })
      // Delegate to parent of tooltip, Show tooltip if parent receives mouse or focus
      .on('mouseenter focus', ':has(>.tooltip)', function (e) {
        if (!$(this).prop('disabled')) { // IE 8 fix to prevent tooltip on `disabled` elements
          $(this)
            .find('.tooltip')
            .addClass('isVisible');
        }
      })
      // Delegate to parent of tooltip, Hide tooltip if parent loses mouse or focus
      .on('mouseleave blur keydown', ':has(>.tooltip)', function (e) {
        if (e.type === 'keydown') {
          if(e.which === 27) {
            $(this)
              .find('.tooltip')
              .removeClass('isVisible');
          }
        } else {
          $(this)
            .find('.tooltip')
            .removeClass('isVisible');
        }
      });
    return this;
  };
}(jQuery));

// Bind event listener to container element
$('.namespace').tooltip();