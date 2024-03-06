// import React from 'react';
// import { Provider } from 'react-redux';
// import { render } from '@testing-library/react';
// import { expect } from 'chai';
//
// import ConfirmationPage from '../../containers/ConfirmationPage';
//
// describe('<ConfirmationPage>', () => {
//   const testDate = new Date('12-15-2021');
//   const store = ({
//     transportationReceiptsLength = 2,
//     claimedBenefits = true,
//     hasDeathCertificate = true,
//   } = {}) => ({
//     getState: () => ({
//       user: {
//         login: {
//           currentlyLoggedIn: true,
//         },
//         profile: {
//           savedForms: [],
//           prefillsAvailable: [],
//         },
//       },
//       form: {
//         data: {
//           claimantFullName: {
//             first: 'Sally',
//             middle: 'Jane',
//             last: 'Doe',
//           },
//           veteranFullName: {
//             first: 'Josie',
//             middle: 'Henrietta',
//             last: 'Smith',
//           },
//           'view:claimedBenefits': {
//             burialAllowance: claimedBenefits,
//             plotAllowance: claimedBenefits,
//             transportation: claimedBenefits,
//           },
//           ...(hasDeathCertificate && {
//             deathCertificate: {
//               length: 1,
//             },
//           }),
//           transportationReceipts: {
//             length: transportationReceiptsLength,
//           },
//         },
//         submission: {
//           submittedAt: testDate,
//           response: {
//             confirmationNumber: 'V-EBC-177',
//             regionalOffice: [
//               'Western Region',
//               'VA Regional Office',
//               'P.O. Box 8888',
//               'Muskogee, OK 74402-8888',
//             ],
//           },
//         },
//       },
//       featureToggles: {
//         loading: false,
//         [`burials_form_enabled`]: true,
//       },
//     }),
//     subscribe: () => {},
//     dispatch: () => {},
//   });
//
//   it('renders', () => {
//     const mockStore = store();
//     const { container, queryByText } = render(
//       <Provider store={mockStore}>
//         <ConfirmationPage />
//       </Provider>,
//     );
//     expect(queryByText('V-EBC-177')).to.not.be.null;
//     expect(
//       container.querySelector('.benefits-claimed').children.length,
//     ).to.equal(3);
//   });
//
//   it('renders alternate state', () => {
//     const mockStore = store({
//       transportationReceiptsLength: 1,
//       claimedBenefits: false,
//       hasDeathCertificate: false,
//     });
//     const { queryByText } = render(
//       <Provider store={mockStore}>
//         <ConfirmationPage />
//       </Provider>,
//     );
//
//     expect(queryByText('Transportation documentation: 1 file')).to.exist;
//   });
// });
