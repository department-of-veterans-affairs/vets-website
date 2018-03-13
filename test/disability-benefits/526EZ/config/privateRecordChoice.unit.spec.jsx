// import React from 'react';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import { mount } from 'enzyme';

// import { DefinitionTester, selectRadio } from '../../../util/schemaform-utils.jsx';
// import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';

// const initialData = {
//   // For testing purposes only
//   disabilities: [
//     {
//       disability: { // Is this extra nesting necessary?
//         diagnosticText: 'PTSD',
//         decisionCode: 'Filler text', // Should this be a string?
//         // Is this supposed to be an array?
//         specialIssues: {
//           specialIssueCode: 'Filler text',
//           specialIssueName: 'Filler text'
//         },
//         ratedDisabilityId: '12345',
//         disabilityActionType: 'Filler text',
//         ratingDecisionId: '67890',
//         diagnosticCode: 'Filler text',
//         // Presumably, this should be an array...
//         secondaryDisabilities: [
//           {
//             diagnosticText: 'First secondary disability',
//             disabilityActionType: 'Filler text'
//           },
//           {
//             diagnosticText: 'Second secondary disability',
//             disabilityActionType: 'Filler text'
//           }
//         ]
//       }
//     },
//     {
//       disability: { // Is this extra nesting necessary?
//         diagnosticText: 'Second Disability',
//         decisionCode: 'Filler text', // Should this be a string?
//         // Is this supposed to be an array?
//         specialIssues: {
//           specialIssueCode: 'Filler text',
//           specialIssueName: 'Filler text'
//         },
//         ratedDisabilityId: '54321',
//         disabilityActionType: 'Filler text',
//         ratingDecisionId: '09876',
//         diagnosticCode: 'Filler text',
//         // Presumably, this should be an array...
//         secondaryDisabilities: [
//           {
//             diagnosticText: 'First secondary disability',
//             disabilityActionType: 'Filler text'
//           },
//           {
//             diagnosticText: 'Second secondary disability',
//             disabilityActionType: 'Filler text'
//           }
//         ]
//       }
//     }
//   ]
// };

// describe('Disability benefits 526EZ private record choice', () => {
//   const { schema, uiSchema, arrayPath } = formConfig.chapters.supportingEvidence.pages.privateRecordChoice;
//   it('renders private record choice form', () => {
//     const form = mount(<DefinitionTester
//       arrayPath={arrayPath}
//       pagePerItemIndex={0}
//       definitions={formConfig.defaultDefinitions}
//       schema={schema}
//       data={initialData}
//       formData={initialData}
//       uiSchema={uiSchema}/>
//     );

//     expect(form.find('input').length).to.equal(2);
//   });

//   it('should fill in private record choice', () => {
//     const onSubmit = sinon.spy();
//     const form = mount(
//       <DefinitionTester
//         arrayPath={arrayPath}
//         pagePerItemIndex={0}
//         onSubmit={onSubmit}
//         definitions={formConfig.defaultDefinitions}
//         schema={schema}
//         data={initialData}
//         formData={initialData}
//         uiSchema={uiSchema}/>
//     );

//     selectRadio(form, 'root_view:vaMedicalRecords', 'yes');

//     form.find('form').simulate('submit');
//     expect(form.find('.usa-input-error').length).to.equal(0);
//     expect(onSubmit.called).to.be.true;
//   });
// });
