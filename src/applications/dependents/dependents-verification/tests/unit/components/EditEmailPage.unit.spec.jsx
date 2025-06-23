// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import * as validations from 'platform/forms/validations';
// import { EditEmailPage } from '../../../components/EditEmailPage';

// // ---- REGISTER WEB COMPONENT STUBS ----
// function defineStub(tag) {
//   if (!window.customElements.get(tag)) {
//     window.customElements.define(tag, class extends HTMLElement {});
//   }
// }
// defineStub('va-text-input'); // Only stub VA web components

// describe.only('EditEmailPage full coverage', () => {
//   let goToPath;
//   let setFormData;
//   let emailStub;

//   beforeEach(() => {
//     goToPath = sinon.spy();
//     setFormData = sinon.spy();
//     emailStub = sinon.stub().callsFake(() => true); // Default: always valid
//     // Replace the module function with our stub
//     sinon.replace(isValidEmail, 'call', emailStub);
//     window.sessionStorage.removeItem('onReviewPage');
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   it('renders with initial email value', () => {
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: 'test@example.com' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');
//     expect(input.getAttribute('value')).to.equal('test@example.com');
//     expect(container.textContent).to.include('Edit email');
//     expect(container.textContent).to.include('Email address');
//   });

//   it('validates and shows error on invalid email', () => {
//     emailStub.callsFake(() => false); // Simulate invalid
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: '' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');
//     fireEvent.input(input, { target: { value: 'not-an-email' } });

//     const updateBtn = container.querySelectorAll('progress-button')[1];
//     fireEvent.click(updateBtn);

//     expect(container.textContent).to.include(
//       'Enter a valid email address without spaces using this format: email@domain.com',
//     );
//     expect(setFormData.called).to.be.false;
//     expect(goToPath.called).to.be.false;
//   });

//   it('updates and navigates when given a valid email', () => {
//     emailStub.callsFake(() => true);
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: 'old@example.com' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');
//     fireEvent.input(input, { target: { value: 'valid@va.gov' } });

//     const updateBtn = container.querySelectorAll('progress-button')[1];
//     fireEvent.click(updateBtn);

//     expect(setFormData.called).to.be.true;
//     const [newData] = setFormData.firstCall.args;
//     expect(newData.email).to.equal('valid@va.gov');
//     expect(goToPath.calledWith('/veteran-contact-information')).to.be.true;
//   });

//   it('navigates to review page if sessionStorage flag set', () => {
//     emailStub.callsFake(() => true);
//     window.sessionStorage.setItem('onReviewPage', '1');
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: 'review@va.gov' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const updateBtn = container.querySelectorAll('progress-button')[1];
//     fireEvent.click(updateBtn);

//     expect(goToPath.calledWith('/review-and-submit')).to.be.true;
//   });

//   it('cancels and navigates to contact info page', () => {
//     emailStub.callsFake(() => true);
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: 'something@va.gov' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const cancelBtn = container.querySelectorAll('progress-button')[0];
//     fireEvent.click(cancelBtn);

//     expect(goToPath.calledWith('/veteran-contact-information')).to.be.true;
//     expect(setFormData.called).to.be.false;
//   });

//   it('shows required error if Update clicked with empty input', () => {
//     emailStub.callsFake(() => false);
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: '' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');
//     fireEvent.input(input, { target: { value: '' } });

//     const updateBtn = container.querySelectorAll('progress-button')[1];
//     fireEvent.click(updateBtn);

//     expect(container.textContent).to.include(
//       'Enter a valid email address without spaces using this format: email@domain.com',
//     );
//     expect(setFormData.called).to.be.false;
//     expect(goToPath.called).to.be.false;
//   });

//   it('shows helper hint text for the email input', () => {
//     const { container } = render(
//       <EditEmailPage
//         formData={{ email: '' }}
//         goToPath={goToPath}
//         setFormData={setFormData}
//       />,
//     );
//     const input = container.querySelector('va-text-input');
//     expect(input.getAttribute('hint')).to.include(
//       'We may use your contact information',
//     );
//   });
// });
