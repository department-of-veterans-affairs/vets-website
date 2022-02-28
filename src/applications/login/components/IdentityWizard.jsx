// import React, { useState } from 'react';
// import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// //  const showNextQuestion =
// //     choices?.signinoptions?.length && choices?.signinoptions === 'none';
// //   const shouldShowAnswer =
// //     choices?.signinoptions?.length &&
// //     choices?.idoptions?.length;

// // function generateAnswers({ signinoptions = '', idoptions = '' } = {}) {
// //   const tempObj = {};
// //   switch (signinoptions || idoptions) {
// //     case '':
// //   }

// //   return {
// //     showNextQuestion,
// //     shouldShowAnswer,
// //     answer,
// //   };
// // }

// export default function IdentityWizard() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [choices, setChoices] = useState({});

//   /*
//     Wizard information
//     - On click should display first question in dropdown

//     First question
//     - Login.gov or ID.me: Displays suggestion component that shows why the partner would be best for them; Additionally shows them a Create an account link
//     - None: should display the next question

//     Second question
//     - State-issued: Shows suggestion component for Login.gov
//     - Other: Shows suggestion component for ID.me
//     - None of these: Shows suggestion component for ID.me
//   */
//   function toggleWizard() {
//     setIsOpen(!isOpen);
//   }

//   function handleRadioSelected(event) {
//     event.stopPropagation();
//     setChoices(prevState => ({
//       ...prevState,
//       [event.target.name]: event.target.value,
//     }));
//   }

//   return (
//     <div className="wizard-container">
//       <button
//         type="button"
//         aria-expanded={isOpen ? 'true' : 'false'}
//         aria-controls="wizardOptions"
//         onClick={toggleWizard}
//         className={`usa-button-primary wizard-button ${!isOpen &&
//           'va-button-primary'}`}
//       >
//         Find your identity partner
//       </button>
//       <div
//         id="wizardOptions"
//         className={`form-expanding-group-open wizard-content ${!isOpen &&
//           'wizard-content-closed'}`}
//       >
//         <div className="wizard-content-inner">
//           <VaRadio
//             label="1. Do you already use one of these sign-on options to access services on VA.gov?"
//             onRadioOptionSelected={handleRadioSelected}
//           >
//             <va-radio-option
//               label="Login.gov"
//               name="signinoptions"
//               value="logingov"
//             />
//             <va-radio-option label="ID.me" name="signinoptions" value="idme" />
//             <va-radio-option
//               label="No. I don't have either of these"
//               name="signinoptions"
//               value="none"
//             />
//           </VaRadio>
//           {showNextQuestion ? (
//             <VaRadio
//               label="2. Which forms of identification do you have?"
//               onRadioOptionSelected={handleRadioSelected}
//             >
//               <va-radio-option
//                 label="State-issued Identification (drivers license)"
//                 name="idoptions"
//                 value="state"
//               />
//               <va-radio-option
//                 label="Other (US or Foreign passport)"
//                 name="idoptions"
//                 value="other"
//               />
//               <va-radio-option
//                 label="None of these"
//                 name="idoptions"
//                 value="none"
//               />
//             </VaRadio>
//           ) : (
//             <>
//               {choices?.signinoptions?.length > 1 && (
//                 <div className="vads-u-padding-bottom--2">
//                   <p>
//                     <strong>
//                       {choices?.signinoptions?.includes('idme')
//                         ? 'ID.me'
//                         : 'Login.gov'}
//                     </strong>{' '}
//                     is the best identity partner option for you because:
//                     <ul>
//                       <li>
//                         {choices?.signinoptions?.includes('idme')
//                           ? `You have a passport as a form of identification`
//                           : `You have a state-issued form of identification`}
//                       </li>
//                     </ul>
//                   </p>
//                   <a href="/somewhere" className="vads-c-action-link--blue">
//                     Create an account
//                   </a>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
