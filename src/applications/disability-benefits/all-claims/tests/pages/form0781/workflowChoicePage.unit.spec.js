// // SEE src/applications/vaos/new-appointment/components/TypeOfFacilityPage.unit.spec.js FOR example

// // import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
// // import React from 'react';
// // import { getByText, render } from '@testing-library/react';
// // import { expect } from 'chai';
// // // TODO: what do these do?
// // import {
// //   $,
// //   $$,
// // } from '@department-of-veterans-affairs/platform-forms-system/ui';
// import * as workflowChoicePage from '../../../pages/form0781/workflowChoicePage';
// // import userEvent from '@testing-library/user-event';
// // import formConfig from '../../../config/form';

// describe('Form 0781 workflow choice page', () => {
//   const { schema, uiSchema } = workflowChoicePage;

//   it('should define a uiSchema object', () => {
//     expect(uiSchema).to.be.an('object');
//   });

//   it('should define a schema object', () => {
//     expect(schema).to.be.an('object');
//   });

//   it('renders a radio selection of Form 0781 options', () => {
//     // ..
//   });

//   it('Does not select an initial option by default', () => {
//     // ..
//   });

//   it('Shows the currently selected option', () => {
//     // ...
//   });

//   // Example error test
//   // it('should error when user makes no selection', () => {
//   //   const onSubmit = sinon.spy();
//   //   const { getByText } = render(
//   //     <DefinitionTester
//   //       definitions={formConfig.defaultDefinitions}
//   //       schema={schema}
//   //       uiSchema={uiSchema}
//   //       data={{}}
//   //       formData={{}}
//   //       onSubmit={onSubmit}
//   //     />,
//   //   );

//   //   const submitButton = getByText('Submit');
//   //   userEvent.click(submitButton);
//   //   expect(onSubmit.calledOnce).to.be.false;
//   //   expect($('va-radio').error).to.eq('You must provide a response');
//   // });

//   // Test selection is required
//   it('Should not submit when no selection is made', () => {
//   // ...

//     // Better way to do this?
//     const continueButton = getByText('Continue');
//     userEvent.click(continueButton);
//     expect(continueButton.calledOnce).to.be.false;
//     expect($$('va-radio').error).to.eq('*Required');
//   })
// });

// // WHAT DO THESE DO??!??

// // describe('Form 0781 workflow choice page', () => {
// //   const { schema, uiSchema } = workflowChoicePage;

// //   it('should define a uiSchema object', () => {
// //     expect(uiSchema).to.be.an('object');
// //   });

// //   it('should define a schema object', () => {
// //     expect(schema).to.be.an('object');
// //   });

// //   it('renders a radio selection of Form 0781 options', () => {
// //     const { container } = render(
// //       <DefinitionTester
// //         definitions={formConfig.defaultDefinitions}
// //         schema={schema}
// //         // data={{
// //         //   'view:selectablePtsdTypes': {
// //         //     'view:combatPtsdType': true,
// //         //   },
// //         // }}
// //         uiSchema={uiSchema}
// //       />,
// //     );

// //     // TODO: TEST RENDERS FIRST OPTION BY DEFAULT
// //     // Dunno if we should use $ or $$
// //     const radioButtons = $$('va-radio');
// //     expect(radioButtons.length).to.equal(1);
// //     expect(radioButtons).to.have.attribute(
// //       'label',
// //       'Do you want to provide more information about your mental health conditions?',
// //     );

// //     const firstOptionCopy =
// //       'Yes, I want to complete VA Form 21-0781 online right now';

// //     expect(
// //       radioButtons.querySelector(
// //         `va-radio-option[label=${firstOptionCopy}`,
// //         container,
// //       ),
// //     ).to.exist;

// //     const secondOptionCopy =
// //       'Yes, but I’ve already completed the PDF version of VA Form 21-0781 and I want to submit it with my claim';

// //     expect(
// //       radioButtons.querySelector(
// //         `va-radio-option[label=${secondOptionCopy}`,
// //         container,
// //       ),
// //     ).to.exist;

// //     const thirdOptionCopy =
// //       'No, I don’t want to complete VA Form 21-0781 (opt out)';

// //     expect(
// //       radioButtons.querySelector(
// //         `va-radio-option[label=${thirdOptionCopy}`,
// //         container,
// //       ),
// //     ).to.exist;
// //   });

// //   it('Does not select an initial option', () => {
// //     // ..
// //   });

// //   it('Shows the currently selected option', () => {
// //     // ...
// //   });

// //   // Example error test
// //   // it('should error when user makes no selection', () => {
// //   //   const onSubmit = sinon.spy();
// //   //   const { getByText } = render(
// //   //     <DefinitionTester
// //   //       definitions={formConfig.defaultDefinitions}
// //   //       schema={schema}
// //   //       uiSchema={uiSchema}
// //   //       data={{}}
// //   //       formData={{}}
// //   //       onSubmit={onSubmit}
// //   //     />,
// //   //   );

// //   //   const submitButton = getByText('Submit');
// //   //   userEvent.click(submitButton);
// //   //   expect(onSubmit.calledOnce).to.be.false;
// //   //   expect($('va-radio').error).to.eq('You must provide a response');
// //   // });

// //   // Test selection is required
// //   it('Should not submit when no selection is made', () => {
// //   // ...

// //     // Better way to do this?
// //     const continueButton = getByText('Continue');
// //     userEvent.click(continueButton);
// //     expect(continueButton.calledOnce).to.be.false;
// //     expect($$('va-radio').error).to.eq('*Required');
// //   })
// // });
