import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import Sinon from 'sinon';
import formConfig from '../../config/form';

const { schema, uiSchema } = formConfig.chapters.textInput.pages.textInput;

describe('web component vs regular text inputs', () => {
  it('should have appropriate number of fields', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('va-text-input').length).to.equal(10);
    expect(form.find('va-textarea').length).to.equal(1);
    expect(form.find('input').length).to.equal(3);

    form.unmount();
  });

  it('should show the correct number of errors on submit', async () => {
    const onSubmit = Sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const button = form.find('form');
    button.simulate('submit');

    // web component errors
    expect(
      form.findWhere(node => {
        return (
          (node.is('va-text-input') || node.is('va-textarea')) &&
          node.prop('error')
        );
      }).length,
    ).to.equal(3);

    // regular input errors
    expect(form.find('.usa-input-error').length).to.equal(1);

    expect(onSubmit.called).to.be.false;

    form.unmount();
  });
});
