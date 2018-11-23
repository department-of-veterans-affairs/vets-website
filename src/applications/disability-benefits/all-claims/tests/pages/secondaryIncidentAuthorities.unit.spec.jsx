import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils';
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

    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(2);
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

    fillData(form, 'input#root_incident0_authorities_0_name', 'Authority Name');
    fillData(
      form,
      'select#root_incident0_authorities_0_address_country',
      'USA',
    );
    fillData(
      form,
      'input#root_incident0_authorities_0_address_street',
      '123 Street',
    );
    fillData(
      form,
      'input#root_incident0_authorities_0_address_street2',
      'Apt B',
    );
    fillData(form, 'input#root_incident0_authorities_0_address_city', 'Test');
    fillData(form, 'select#root_incident0_authorities_0_address_state', 'AL');
    fillData(
      form,
      'input#root_incident0_authorities_0_address_postalCode',
      '12345',
    );
    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
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
  });
});
