window.addEventListener('DOMContentLoaded', () => {
  const feedbackButton = document.getElementById('nebula_div_btn');

  feedbackButton.addEventListener('click', event => {
    event.preventDefault();
    const inputs = document.querySelectorAll('.neb-rating .rating-label input');

    inputs.forEach(input => {
      const attribute = input.getAttribute('aria-label');
      input.setAttribute('aria-label', attribute.split(',')[1]);
    });
  });
});