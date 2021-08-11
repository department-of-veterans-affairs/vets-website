import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('HLR conference times page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.informalConference.pages.availability;
  const firstSelect = 'select[name="root_informalConferenceTimes_time1"]';

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should show v1 options', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // v1 = 1 empty option + 4 time slots
    expect(form.find(`${firstSelect} option`).length).to.equal(5);
    form.unmount();
  });
  it('should show v2 options', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ hlrV2: true }}
        formData={{ hlrV2: true }}
      />,
    );

    // v2 = 1 empty option + 2 time slots
    expect(form.find(`${firstSelect} option`).length).to.equal(3);
    form.unmount();
  });

  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fillData(form, firstSelect, 'time1000to1230');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  // board option is required
  it('should prevent continuing', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
