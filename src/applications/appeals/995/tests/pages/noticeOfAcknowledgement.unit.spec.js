import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('Supplemental Claims notice-of-acknowledgement page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.acknowledgement.pages.notice5103;

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

    expect(form.find('input').length).to.equal(1);
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

    selectCheckbox(form, 'root_form5103Acknowledged', true);
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
