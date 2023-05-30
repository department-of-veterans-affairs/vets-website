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
//   const observer = new MutationObserver(mutations => {
//     mutations.forEach(mutation => {
//       if (mutation.addedNodes.length > 0) {
//         const addedNode = mutation.addedNodes[0];
//         if (addedNode.id === 'MDigitalLightboxWrapper') {
//           // eslint-disable-next-line no-console
//           console.log('MDigitalLightboxWrapper found!');
//           const medalliaForm = addedNode.querySelector('.modal-live-form');
//           if (medalliaForm) {
//             const vclNumber = document
//               .querySelector('.modal-live-form')
//               .querySelector('.pageRepeater')
//               .querySelector('.neb-component')
//               .querySelector('ul')
//               .querySelector('li:nth-child(1)')
//               .querySelector('span');
//             // eslint-disable-next-line no-console
//             console.log('Medallia form found!');
//             addAriaLabel(vclNumber);
//             observer.disconnect();
//           } else {
//             // eslint-disable-next-line no-console
//             console.log('Medallia form found!');
//           }
//         }
//       }
//     });
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });
// });

window.addEventListener('DOMContentLoaded', () => {
  const mutationObserver = new MutationObserver(mutations => {
    // Find the first div with classname .modal-live-form
    const medalliaForm = mutations[0].addedNodes.find(node =>
      node.classList.contains('modal-live-form'),
    );
    if (medalliaForm) {
      // eslint-disable-next-line no-console
      console.log('modal-live-form found!');
    }
  });

  // Set the observer to watch for changes to the body
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
