// import React from 'react';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
// import { mount } from 'enzyme';
// import formConfig from '../../config/form';

// describe('Medical Care History', () => {
//   const {
//     schema,
//     uiSchema,
//   } = formConfig.chapters.disabilities.pages.medicalCareHistory8940;

//   it('should render', () => {
//     const form = mount(
//       <DefinitionTester
//         definitions={formConfig}
//         schema={schema}
//         uiSchema={uiSchema}
//         data={{}}
//         formData={{}}
//       />,
//     );

//     expect(form.find('input').length).to.equal(2);
//   });

//   it('should render medical care options', () => {
//     const form = mount(
//       <DefinitionTester
//         definitions={formConfig}
//         schema={schema}
//         uiSchema={uiSchema}
//         data={{
//           careQuestion: 'yes',
//           medicalTreatment: {
//             'view:doctorCare': true,
//           },
//         }}
//         formData={{}}
//       />,
//     );

//     expect(form.find('input').length).to.equal(2);
//   });

//   it('should not submit if untouched', () => {
//     const onSubmit = sinon.spy();

//     const form = mount(
//       <DefinitionTester
//         definitions={formConfig}
//         schema={schema}
//         uiSchema={uiSchema}
//         data={{}}
//         formData={{}}
//         onSubmit={onSubmit}
//       />,
//     );

//     form.find('form').simulate('submit');
//     expect(form.find('.usa-input-error-message').length).to.equal(1);
//     expect(onSubmit.called).to.be.false;
//   });
// });
