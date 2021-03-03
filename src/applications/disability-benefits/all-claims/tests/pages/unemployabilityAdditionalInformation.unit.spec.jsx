import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Unemployability Additional Information form', () => {
  const opts = { showSubforms: true };
  const { schema, uiSchema } = formConfig(
    opts,
  ).chapters.disabilities.pages.unemployabilityAdditionalInformation;
  const defaultDefinitions = formConfig(opts).defaultDefinitions;

  it('should render textarea', () => {
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('textarea').length).to.equal(1);
    form.unmount();
  });

  it('should submit without user input', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
