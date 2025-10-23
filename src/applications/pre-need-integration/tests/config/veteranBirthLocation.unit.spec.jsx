import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant veteran birth location', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.veteranBirthLocation;

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
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      // Select all va-text-input fields with an error attribute
      const errorInputs = container.querySelectorAll('va-text-input[error]');
      expect(errorInputs.length).to.equal(2);
      // Optionally check error attribute value
      errorInputs.forEach(input => {
        expect(input.getAttribute('error')).to.equal(
          'You must provide a response',
        );
      });
      expect(onSubmit.called).to.be.false;
    });
  });
});
