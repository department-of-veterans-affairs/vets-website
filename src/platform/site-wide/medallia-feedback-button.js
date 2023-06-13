/* eslint-disable no-console */
window.addEventListener('DOMContentLoaded', () => {
  function addAriaLabel(element, label) {
    element.setAttribute('aria-label', label);
  }
  // Create a new MutationObserver to watch for the target element's insertion into the DOM
  const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if the target element has been added to the DOM
        const targetElement = document.getElementById('kampyleFormModal');
        if (targetElement) {
          // Once the target element is present, create a new MutationObserver to watch for changes in its attributes
          const attributeObserver = new MutationObserver(
            attributeMutationsList => {
              for (const attributeMutation of attributeMutationsList) {
                if (
                  attributeMutation.type === 'attributes' &&
                  attributeMutation.attributeName === 'aria-label'
                ) {
                  // Check if the aria-label attribute has the value "Feedback Survey"
                  const ariaLabel = targetElement.getAttribute('aria-label');
                  if (ariaLabel === 'Feedback Survey') {
                    console.log('feedback survey is here');
                    setTimeout(() => {
                      const vclNumber = document.querySelector(
                        '#liveForm > div > div.live-form-content > div.modal-live-form.ng-scope > div > div > div:nth-child(1) > div > div > p > ul > li:nth-child(1) > span > strong:nth-child(2) > a',
                      );
                      addAriaLabel(vclNumber, '9 9 8');
                    }, 3000);
                  }
                }
              }
            },
          );

          // Start observing changes to the target element's attributes
          attributeObserver.observe(targetElement, { attributes: true });

          // Disconnect the observer once the target element is found
          observer.disconnect();
        }
      }
    }
  });

  // Start observing changes in the DOM
  observer.observe(document.body, { childList: true, subtree: true });
});
