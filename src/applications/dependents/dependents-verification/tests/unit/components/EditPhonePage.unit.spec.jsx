// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import EditPhonePage from '../../../components/EditPhonePage';

// describe('EditPhonePage full coverage', () => {
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

//   it('renders with initial phone value', () => {
//     const phone = '5551234567';
//     const { container, queryByText } = render(
//       <EditPhonePage
//         data={{ phone }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');

//     expect(input.getAttribute('value')).to.equal(phone);
//     expect(input.getAttribute('label')).to.eql('Phone number');
//     expect(queryByText(/Edit phone number/i)).to.not.be.null;
//   });

//   it('shows error on invalid phone when user enters bad phone', async () => {
//     const { container } = render(
//       <EditPhonePage goToPath={goToPath} setFormData={setFormData} />,
//     );

//     const input = container.querySelector('va-text-input');
//     input.value = '123'; // Invalid phone number
//     fireEvent.input(input, { detail: { value: '123' } });

//     container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

//     await waitFor(() => {
//       expect(input.getAttribute('error')).to.include(
//         'Enter a valid 10-digit U.S. phone number',
//       );
//     });
//   });

//   it('validates and calls the onUpdate with a valid phone number', async () => {
//     const { container } = render(
//       <EditPhonePage
//         goToPath={goToPath}
//         setFormData={setFormData}
//         data={{ phone: '' }}
//       />,
//     );

//     const input = container.querySelector('va-text-input');
//     input.value = '5559876543';
//     fireEvent.input(input, { detail: { value: '5559876543' } });

//     container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

//     await waitFor(() => {
//       expect(input.getAttribute('value')).to.eql('5559876543');
//       expect(setFormData.called).to.be.true;
//     });
//   });

//   it('calls onCancel handler and returns to path', async () => {
//     sessionStorage.setItem('onReviewPage', true);
//     const { container } = render(
//       <EditPhonePage
//         goToPath={goToPath}
//         setFormData={setFormData}
//         data={{ phone: '5559876543' }}
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
