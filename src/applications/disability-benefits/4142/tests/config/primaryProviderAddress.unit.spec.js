import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester, // selectCheckbox
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Disability benefits 4142 provider primary address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.treatmentHistory.pages.treatmentHistory;

  it('should render 4142 form', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>,
    );

    expect(form.find('input').length).to.equal(9);
  });

  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          providerFacility: [
            {
              providerFacilityName: '',
              treatmentDateRange: {
                from: '',
                to: '',
              },
              providerFacilityAddress: {
                street: '',
                city: '',
                postalCode: null,
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(8);

    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          providerFacility: [
            {
              providerFacilityName: 'Facility Name',
              treatmentDateRange: {
                from: '2017-05-05',
                to: '2018-05-05',
              },
              providerFacilityAddress: {
                street: '100 Main Street',
                city: 'City',
                state: 'WI',
                country: 'USA',
                postalCode: '12345'
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);

    expect(onSubmit.called).to.be.true;
  });
});
