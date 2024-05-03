import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('HLR opt-in page', () => {
  const { schema, uiSchema } = formConfig.chapters.conditions.pages.optIn;

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

    expect(form.find('va-checkbox').length).to.equal(1);
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
    form.find('va-checkbox').simulate('change', {
      target: { checked: true },
    });
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
