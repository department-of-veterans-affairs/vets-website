import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need preparer Details info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.preparerDetails.pages.preparerDetails;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );
    // Check for va-text-inputs rendered (adjust count if needed)
    expect(form.find('va-text-input').length).to.be.greaterThan(0);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );
    form.find('form').simulate('submit');

    // Instead of .usa-input-error, look for web component error messages
    // Typical error selector in VA forms: .rjsf-error-message inside va-text-input
    const errorMessages = form.find('.rjsf-error-message');
    // For debug: log the HTML output if failing
    if (errorMessages.length !== 2) {
      // eslint-disable-next-line no-console
      console.log(form.html());
    }
    expect(errorMessages.length).to.equal(2);

    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
