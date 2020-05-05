import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('PTSD Assault permission notice', () => {
  const page =
    formConfig.chapters.disabilities.pages.secondaryIncidentAuthorities0;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    // name, addressLine1, addressLine2, city, zipCode
    expect(form.find('input').length).to.equal(5);
    // country (USA), state
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should add an authority', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillData(
      form,
      'input#root_secondaryIncident0_sources_0_name',
      'Authority Name',
    );
    fillData(
      form,
      'select#root_secondaryIncident0_sources_0_address_country',
      'USA',
    );
    fillData(
      form,
      'input#root_secondaryIncident0_sources_0_address_addressLine1',
      '123 Street',
    );
    fillData(
      form,
      'input#root_secondaryIncident0_sources_0_address_addressLine2',
      'Apt B',
    );
    fillData(
      form,
      'input#root_secondaryIncident0_sources_0_address_city',
      'Test',
    );
    fillData(
      form,
      'select#root_secondaryIncident0_sources_0_address_state',
      'AL',
    );
    fillData(
      form,
      'input#root_secondaryIncident0_sources_0_address_zipCode',
      '12345-1234',
    );
    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission with no authorities', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
