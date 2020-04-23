import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { ERR_MSG_CSS_CLASS } from '../../constants';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('PTSD Secondary Incident location', () => {
  const page =
    formConfig.chapters.disabilities.pages.secondaryIncidentLocation0;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should fill in incident location', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    fillData(
      form,
      'select#root_secondaryIncident0_incidentLocation_country',
      'USA',
    );
    fillData(
      form,
      'select#root_secondaryIncident0_incidentLocation_state',
      'SC',
    );
    fillData(
      form,
      'input#root_secondaryIncident0_incidentLocation_city',
      'Test',
    );
    fillData(
      form,
      'textarea#root_secondaryIncident0_incidentLocation_additionalDetails',
      'Detail text',
    );
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit without validation errors', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
