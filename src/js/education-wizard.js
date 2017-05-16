(function (){
  function reInitWidget() {
    function toggleClass(element, className) {
      element.classList.toggle(className);
    }

  // Toggle the expandable apply fields
  const containers = Array.prototype.slice.call(document.querySelectorAll('.expander-container'));
  containers.forEach(function(container) {
    var button = container.querySelector('.expander-button');
    var openButton = container.querySelector('.apply-go-button');
    var content = container.querySelector('.expander-content');
    button.addEventListener('click', function () {
      toggleClass(content, 'expander-content-closed');
      toggleClass(button, 'va-button-primary');
    });
    openButton.addEventListener('click', function () {
      var selectedForm = content.querySelector('input[name="form-selection"]:checked');

      if (selectedForm) {
        location.assign('/education/apply-for-education-benefits/application/' + selectedForm.value + '/introduction');
      }
    });
  })
}

document.addEventListener('DOMContentLoaded', reInitWidget);
})();
