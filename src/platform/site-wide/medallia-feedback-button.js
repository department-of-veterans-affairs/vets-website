/* eslint-disable no-console */
// window.addEventListener('DOMContentLoaded', () => {
//   /**
//    * Moves #kampyleButtonContainer (the container for the Feedback button
//    * powered by Medallia) from the end of <body> to the end of <main> so
//    * that users can tab to it more quickly.
//    * Before, users had to tab through all the links in the footer to get
//    * to the button.
//    */
//   const body = document.querySelector('body');
//   const main = document.querySelector('main');
//   const observeConfig = { attributes: false, childList: true };
//   let feedbackButtonContainer;

//   /**
//    * Set an observer to detect when #kampyleButtonContainer is added to
//    * the DOM, then move it.
//    */
//   const bodyObserver = new MutationObserver(bodyMutationsList => {
//     bodyMutationsList.forEach(bodyMutation => {
//       if (bodyMutation.addedNodes.length > 0) {
//         bodyMutation.addedNodes.forEach(bodyNode => {
//           if (bodyNode.id === 'kampyleButtonContainer') {
//             feedbackButtonContainer = document.getElementById(
//               'kampyleButtonContainer',
//             );
//             feedbackButtonContainer.remove();
//             main.append(feedbackButtonContainer);

//             /**
//              * When the Feedback button is clicked on, #nebula_div_btn is removed from the DOM.
//              * When the form is closed, it is added back.
//              * Set an observer to detect when #nebula_div_btn is added back then set the
//              * focus on it again.
//              */
//             const buttonContainerObserver = new MutationObserver(
//               buttonContainerMutationsList => {
//                 buttonContainerMutationsList.forEach(containerMutation => {
//                   if (containerMutation.addedNodes.length > 0) {
//                     containerMutation.addedNodes.forEach(containerNode => {
//                       if (containerNode.id === 'nebula_div_btn') {
//                         document.getElementById('nebula_div_btn').focus();
//                       }
//                     });
//                   }
//                 });
//               },
//             );

//             buttonContainerObserver.observe(
//               feedbackButtonContainer,
//               observeConfig,
//             );
//           }
//         });
//       }
//     });
//   });

//   bodyObserver.observe(body, observeConfig);
// });

// window.addEventListener('DOMContentLoaded', () => {
//   const medalliaModal = document.querySelector('.modal-live-form');

//   function addAriaLabelToTextContent(element) {
//     if (
//       element.childNodes.length === 0 &&
//       element.textContent
//         .trim()
//         .split(' ')
//         .includes('988.')
//     ) {
//       element.setAttribute('aria-label', '9 8 8');
//     } else {
//       Array.from(element.childNodes).forEach(childNode => {
//         if (childNode.nodeType === Node.ELEMENT_NODE) {
//           addAriaLabelToTextContent(childNode);
//         }
//       });
//     }
//   }

//   if (medalliaModal) {
//     addAriaLabelToTextContent(medalliaModal);
//     // eslint-disable-next-line no-console
//     console.log('found vcl number!');
//   } else {
//     // eslint-disable-next-line no-console
//     console.log('vcl number not found');
//   }
// });

// window.addEventListener('load', () => {
//   const medalliaModal = document.querySelector('.modal-live-form');
//   const vclNumber = medalliaModal
//     .querySelector('.pageRepeater')
//     .querySelector('.neb-component')
//     .querySelector('ul')
//     .querySelector('li:nth-child(1)')
//     .querySelector('span');

//   function addAriaLabel(spanElement) {
//     // Get the text of the span element.
//     const text = spanElement.innerHTML;

//     // Find the index of the text "988.".
//     const index = text.indexOf('988.');

//     // If the text "988." is found, add an aria label to the span element.
//     if (index > -1) {
//       const ariaLabel = '9 8 8';
//       const spanText = `${text.slice(
//         0,
//         index,
//       )}<span aria-label="${ariaLabel}">988.</span>${text.slice(index + 5)}`;
//       // eslint-disable-next-line no-param-reassign
//       spanElement.innerHTML = spanText;
//     }
//   }
//   if (medalliaModal) {
//     addAriaLabel(vclNumber);
//     // eslint-disable-next-line no-console
//     console.log('found vcl number!');
//   } else {
//     // eslint-disable-next-line no-console
//     console.log('vcl number not found');
//   }
// });

// window.addEventListener('DOMContentLoaded', () => {
//   const medalliaWrapper = document.querySelector('#MDigitalLightboxWrapper');

//   const observer = new MutationObserver(mutationList => {
//     mutationList.forEach(mutation => {
//       mutation.addedNodes.forEach(addedNode => {
//         if (addedNode.id === 'MDigitalLightboxWrapper') {
//           console.log('medallia has been added');
//           observer.disconnect();
//         }
//       });
//     });
//   });

//   observer.observe(medalliaWrapper, {
//     subtree: false,
//     childList: true,
//   });
// });
// window.addEventListener('DOMContentLoaded', () => {
//   function addAriaLabel(spanElement) {
//     // Get the text of the span element.
//     const text = spanElement.innerHTML;
//     // Find the index of the text "988.".
//     const index = text.indexOf('988.');
//     // If the text "988." is found, add an aria label to the span element.
//     if (index > -1) {
//       const ariaLabel = '9 8 8';
//       const spanText = `${text.slice(
//         0,
//         index,
//       )}<span aria-label="${ariaLabel}">988.</span>${text.slice(index + 5)}`;
//       // eslint-disable-next-line no-param-reassign
//       spanElement.innerHTML = spanText;
//     }
//   }
//   const medalliaWrapper = document.querySelector('#MDigitalLightboxWrapper');

//   const observer = new MutationObserver(() => {
//     const medalliaModal = document.querySelector('.modal-live-form');
//     const vclNumber = medalliaModal
//       .querySelector('.pageRepeater')
//       .querySelector('.neb-component')
//       .querySelector('ul')
//       .querySelector('li:nth-child(1)')
//       .querySelector('span');

//     if (medalliaModal) {
//       addAriaLabel(vclNumber);
//       console.log('medallia modal found!');
//       observer.disconnect();
//     } else {
//       console.log('medallia modal NOT found!');
//     }
//   });

//   observer.observe(medalliaWrapper, {
//     subtree: true,
//     childList: true,
//   });
// });

// window.addEventListener('DOMContentLoaded', () => {

//   const medalliaWrapper = document.querySelector('#MDigitalLightboxWrapper');
//   const body = document.querySelector('body');

//   if (!medalliaWrapper) {

//   }

//   const observer = new MutationObserver(mutationList => {
//     mutationList.forEach(mutation => {
//       mutation.addedNodes.forEach(addedNode => {
//         if (addedNode.id === 'MDigitalLightboxWrapper') {
//           console.log('medallia has been added');
//           observer.disconnect();
//         }
//       });
//     });
//   });

//   observer.observe(body, {
//     subtree: true,
//     childList: true,
//   });
// });
window.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];
        if (addedNode.id === 'MDigitalLightboxWrapper') {
          const medalliaForm = addedNode.querySelector('.modal-live-form');
          if (medalliaForm) {
            console.log('Medallia form found!');
            observer.disconnect();
          }
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
