import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

const PaymentSelectionUI = () => {
  return yesNoUI({
    title: 'Tell us where to send the payment for this claim',
    description: (
      <>
        <ul>
          <li>
            Select <strong>Veteran</strong> if you’ve already paid this
            provider. We’ll send a check to your mailing address to pay you back
            (also called reimbursement).
          </li>
          <li>
            Select <strong>Provider</strong> if you haven’t paid the provider.
            We’ll send a check to the provider’s mailing address to pay them
            directly.
          </li>
        </ul>
        <p>
          <strong>Send payment to:</strong>
        </p>
      </>
    ),
    labels: {
      Y: 'Veteran',
      N: 'Provider',
    },
  });
};

export default PaymentSelectionUI;
// 'ui:description': (
//       <ul>
//         <li>
//           Select Veteran if you've already paid this provider. We'll send a
//           check to your mailing address to pay you back (also called
//           reimbursement).
//         </li>
//         <li>
//           Select Provider if you haven't paid the provider. We'll send a check
//           to the provider's mailing address to pay them directly.
//         </li>
//       </ul>
//     ),

// export default PaymentSelectionUI;

// /**
//  * Web component v3 uiSchema for yes or no questions
//  *
//  * ```js
//  * hasHealthInsurance: yesNoUI('Do you have health insurance coverage?')
//  * hasHealthInsurance: yesNoUI({
//  *   title: 'Do you have health insurance coverage?'
//  *   labels: {
//  *     Y: 'Yes, I have health insurance',
//  *     N: 'No, I do not have health insurance',
//  *   },
//  *   required: () => true,
//  *   errorMessages: {
//  *     required: 'Make a selection',
//  *   },
//  * })
//  * ```
//  *
//  * if `yesNoReverse` is set to true, selecting `yes` will result in `false` instead of `true`
// //  *

// export const PaymentSelectionUI = options => {
//   const {
//     title,
//     tile,
//     labels,
//     description,
//     yesNoReverse,
//     errorMessages,
//     required,
//     ...uiOptions
//   } = typeof options === 'object' ? options : { title: options };

//   return {
//     'ui:title': 'Tell us where to send the payment for this claim',
//     'ui:description': (
//       <ul>
//         <li>
//           Select Veteran if you've already paid this provider. We'll send a
//           check to your mailing address to pay you back (also called
//           reimbursement).
//         </li>
//         <li>
//           Select Provider if you haven't paid the provider. We'll send a check
//           to the provider's mailing address to pay them directly.
//         </li>
//       </ul>
//     ),
//     'ui:widget': 'yesNo', // This is required for the review page to render the field properly
//     'ui:webComponentField': YesNoField,
//     'ui:errorMessages': errorMessages,
//     'ui:required': required,
//     'ui:options': {
//       labels: {
//         Y: labels?.Y || 'Yes',
//         N: labels?.N || 'No',
//       },
//       tile,
//       yesNoReverse,
//       ...uiOptions,
//     },
//   };
// };

// /**
//  * @returns `type: 'boolean'`
//  */
// export const PaymentSelectionSchema = {
//   type: 'boolean',
// };
