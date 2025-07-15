// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import { expect } from 'chai';
// import sinon from 'sinon';

// import { EditEmailPage } from '../../../components/EditEmailPage';

// describe('EditEmailPage full coverage', () => {
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

//   it('renders with initial email value', () => {
//     const email = 'test@example.com';
//     const { container, queryByText } = render(
//       <EditEmailPage
//         formData={{ email }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');

//     expect(input.getAttribute('value')).to.equal(email);
//     expect(input.getAttribute('label')).to.eql('Email address');
//     expect(queryByText(/Edit email/i)).to.not.be.null;
//   });

//   it('validates and shows error on invalid email when user enters bad email', async () => {
//     const { container } = render(
//       <EditEmailPage goToPath={goToPath} setFormData={setFormData} />,
//     );

//     const input = container.querySelector('va-text-input');
//     input.value = '';
//     fireEvent.input(input, { detail: { value: '' } });

//     container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

//     await waitFor(() => {
//       expect(input.getAttribute('error')).to.include(
//         'Enter a valid email address without spaces using this format: email@domain.com',
//       );
//     });
//   });

//   it('validates and calls the onUpdate', async () => {
//     const { container } = render(
//       <EditEmailPage
//         goToPath={goToPath}
//         setFormData={setFormData}
//         formData={{ email: '' }}
//       />,
//     );

//     const input = container.querySelector('va-text-input');
//     input.value = 'bob@example.com';
//     fireEvent.input(input, { detail: { value: 'bob@example.com' } });

//     container.querySelector('va-button-pair').__events.primaryClick(clickEvent);

//     await waitFor(() => {
//       expect(input.getAttribute('value')).to.eql('bob@example.com');
//       expect(setFormData.called).to.be.true;
//     });
//   });

//   it('validates and calls the onCancel', async () => {
//     sessionStorage.setItem('onReviewPage', true);
//     const { container } = render(
//       <EditEmailPage
//         goToPath={goToPath}
//         setFormData={setFormData}
//         formData={{ email: 'bob@example.com' }}
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
