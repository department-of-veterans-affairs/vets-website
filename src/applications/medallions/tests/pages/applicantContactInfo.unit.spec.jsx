import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions applicantContactInfo', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantContactInfo;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('va-text-input').length).to.equal(2);
    form.unmount();
  });

  it('should not submit empty form', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update(); // Force enzyme to update
      const emailInput = form.find('va-text-input').at(0);
      const phoneInput = form.find('va-text-input').at(1);

      expect(emailInput.prop('error')).to.equal('Enter an email address');
      expect(phoneInput.prop('error')).to.equal('Enter a phone number');
    });

    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
