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
        data={{ }}
        uiSchema={uiSchema}/>,
    );

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(6);
  });

  it('does not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          privateMedicalProviders: [
            {
              privateProviderName: '',
              privateProviderStreetAddressLine1: '',
              privateProviderCity: null,
              privateProviderPostalCode: null,
              privateProviderCountry: '',
              privateProviderState: '',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(6);

    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          privateMedicalProvider: [
            {
              privateProviderName: 'Testy',
              privateProviderStreetAddressLine1: '123 Nonesuch Street',
              privateProviderCity: 'No',
              privateProviderPostalCode: '29445',
              privateProviderCountry: 'USA',
              privateProviderState: 'South Carolina',
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
