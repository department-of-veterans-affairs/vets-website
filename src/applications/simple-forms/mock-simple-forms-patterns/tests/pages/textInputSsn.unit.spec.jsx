import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import Sinon from 'sinon';
import formConfig from '../../config/form';

const { schema, uiSchema } = formConfig.chapters.textInput.pages.textInputSsn;

describe('ssn web component', () => {
  it('should have appropriate number of fields', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        click
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('va-text-input').length).to.equal(3);
    expect(form.find('input').length).to.equal(0);

    form.unmount();
  });

  it('should show the correct number of errors on submit', async () => {
    const onSubmit = Sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ssn: '123',
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const button = form.find('form');
    button.simulate('submit');

    // web component errors
    expect(
      form.findWhere(node => {
        return node.is('va-text-input') && node.prop('error');
      }).length,
    ).to.equal(1);

    // regular input errors
    expect(form.find('.usa-input-error').length).to.equal(0);

    expect(onSubmit.called).to.be.false;

    form.unmount();
  });
});
