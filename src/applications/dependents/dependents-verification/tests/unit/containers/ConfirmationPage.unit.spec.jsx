// import React from 'react';
// import { expect } from 'chai';
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import { cleanup, render } from '@testing-library/react';
// import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
// import ConfirmationPage from '../../../containers/ConfirmationPage';

// // Mock form config with minimal required properties
// const mockFormConfig = {
//   title: 'Test Form',
//   formId: 'test-form-id',
//   prefillEnabled: true,
//   chapters: {
//     veteranInformation: {
//       title: "Veteran's information",
//       pages: {
//         veteranInformation: {
//           path: 'veteran-information',
//           title: 'Veteran information',
//         },
//       },
//     },
//   },
// };

// const mockStore = state => createStore(() => state);

// const initConfirmationPage = ({ formData } = {}) => {
//   const store = mockStore({
//     form: {
//       ...createInitialState(mockFormConfig),
//       submission: {
//         response: {
//           confirmationNumber: '1234567890',
//         },
//         timestamp: new Date(),
//       },
//       data: formData,
//     },
//   });

//   return render(
//     <Provider store={store}>
//       <ConfirmationPage route={{ formConfig: mockFormConfig }} />
//     </Provider>,
//   );
// };

// describe('ConfirmationPage', () => {
//   afterEach(() => {
//     cleanup();
//   });

//   it('should show success alert, h2, and confirmation number if present', () => {
//     const { container } = initConfirmationPage();
//     const alert = container.querySelector('va-alert');
//     expect(alert).to.have.attribute('status', 'success');
//     expect(alert.querySelector('h2')).to.contain.text(
//       'Form submission started',
//     );
//     expect(alert).to.contain.text('Your confirmation number is 1234567890');
//   });
// });
