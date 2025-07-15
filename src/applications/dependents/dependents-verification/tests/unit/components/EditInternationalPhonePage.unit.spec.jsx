// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import { expect } from 'chai';
// import sinon from 'sinon';

// import { EditInternationalPhonePage } from '../../../components/EditInternationalPhonePage';

// describe('EditInternationalPhonePage', () => {
//   let goToPath;
//   let setFormData;

//   const clickEvent = new MouseEvent('click', {
//     bubbles: true,
//     cancelable: true,
//   });

//   beforeEach(() => {
//     goToPath = sinon.spy();
//     setFormData = sinon.spy();
//   });

//   afterEach(() => {
//     sessionStorage?.clear();
//   });

//   it('renders with initial international phone value', () => {
//     const internationalPhone = '+44 20 1234 5678';
//     const { container, queryByText } = render(
//       <EditInternationalPhonePage
//         data={{ internationalPhone }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');

//     expect(input.getAttribute('label')).to.eql('International phone number');
//     expect(queryByText(/Edit international phone number/i)).to.not.be.null;
//   });

//   it('shows error on invalid international phone when user enters bad phone', async () => {
//     const { container } = render(
//       <EditInternationalPhonePage
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );

//     const input = container.querySelector('va-text-input');
//     fireEvent.input(input, { detail: { value: '' } });

//     container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

//     await waitFor(() => {
//       expect(input.getAttribute('error')).to.include(
//         'Enter a valid international phone number',
//       );
//     });
//   });

//   //   it('validates and calls the onUpdate with a valid international phone number', async () => {
//   //     const { container } = render(
//   //       <EditInternationalPhonePage
//   //         goToPath={goToPath}
//   //         setFormData={setFormData}
//   //         data={{ internationalPhone: '' }}
//   //       />,
//   //     );

//   //     const input = container.querySelector('va-text-input');
//   //     fireEvent.input(input, { detail: { value: '+49 1512 345678' } });

//   //     const updateBtn = container.querySelector(
//   //       'button[aria-label="Update international phone number"]',
//   //     );
//   //     fireEvent.click(updateBtn);

//   //     await waitFor(() => {
//   //       expect(setFormData.called).to.be.true;
//   //       expect(setFormData.firstCall.args[0].internationalPhone).to.eql(
//   //         '+49 1512 345678',
//   //       );
//   //     });
//   //   });

//   it('calls onCancel handler and returns to path', async () => {
//     sessionStorage.setItem('onReviewPage', true);
//     const { container } = render(
//       <EditInternationalPhonePage
//         goToPath={goToPath}
//         setFormData={setFormData}
//         data={{ internationalPhone: '+81 3-1234-5678' }}
//       />,
//     );

//     container
//       .querySelector('va-button-pair')
//       .__events.secondaryClick(clickEvent);

//     await waitFor(() => {
//       expect(goToPath.called).to.be.true;
//     });

//     sessionStorage.removeItem('onReviewPage');
//   });
// });
