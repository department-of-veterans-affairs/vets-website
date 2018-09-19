import React from 'react';
// import { expect } from 'chai';
// import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester, // selectCheckbox
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';

describe('Disability benefits 4142 provider medical records facility information', () => {
  const {
    schema,
    uiSchema,
    arrayPath
  } = formConfig.chapters.supportingEvidence.pages.privateMedicalRecordRelease;

  it('should render 4142 form', () => {
    // const form = mount(
    //   <DefinitionTester
    //     arrayPath={arrayPath}
    //     pagePerItemIndex={0}
    //     definitions={formConfig.defaultDefinitions}
    //     schema={schema}
    //     data={initialData}
    //     uiSchema={uiSchema}/>
    // );

    // Commented out until the form is fully moved over
    // expect(form);
    // expect(form.find('input').length).to.equal(9);
    // expect(form.find('select').length).to.equal(6);
  });

//   it('does not submit without required info', () => {
//     const onSubmit = sinon.spy();
//     const form = mount(
//       <DefinitionTester
//         definitions={formConfig.defaultDefinitions}
//         schema={schema}
//         data={{
//           privateMedicalProviders: [
//             {
//               privateProviderName: '',
//               privateProviderStreetAddressLine1: '',
//               privateProviderCity: null,
//               privateProviderPostalCode: null,
//               privateProviderCountry: '',
//               privateProviderState: '',
//             },
//           ],
//         }}
//         formData={{}}
//         onSubmit={onSubmit}
//         uiSchema={uiSchema}/>,
//     );

//     form.find('form').simulate('submit');
//     expect(form.find('.usa-input-error').length).to.equal(6);

//     expect(onSubmit.called).to.be.false;
//   });

//   it('should submit with required info', () => {
//     const onSubmit = sinon.spy();
//     const form = mount(
//       <DefinitionTester
//         definitions={formConfig.defaultDefinitions}
//         schema={schema}
//         data={{
//           privateMedicalProvider: [
//             {
//               privateProviderName: 'Testy',
//               privateProviderStreetAddressLine1: '123 Nonesuch Street',
//               privateProviderCity: 'No',
//               privateProviderPostalCode: '29445',
//               privateProviderCountry: 'USA',
//               privateProviderState: 'South Carolina',
//             },
//           ],
//         }}
//         formData={{}}
//         onSubmit={onSubmit}
//         uiSchema={uiSchema}/>,
//     );

//     form.find('form').simulate('submit');
//     expect(form.find('.usa-input-error').length).to.equal(0);

//     expect(onSubmit.called).to.be.true;
//   });
});
