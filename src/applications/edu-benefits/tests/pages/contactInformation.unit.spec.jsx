import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig1995 from '../../1995/config/form';
import formConfig10203 from '../../10203/config/form';

const pageTests = (page, formConfig, addressType = 'veteran') => {
  const { schema, uiSchema } = page;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(
      form,
      'input',
    ).concat(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'select'));

    expect(
      inputs.filter(input => input.id.startsWith('root_preferredContactMethod'))
        .length,
    ).to.equal(
      Object.keys(page.uiSchema.preferredContactMethod['ui:options'].labels)
        .length,
    );
    expect(
      inputs.filter(input => input.id.startsWith(`root_${addressType}Address`))
        .length,
    ).to.equal(6);
    expect(
      inputs.filter(input => input.id.startsWith('root_view:otherContactInfo'))
        .length,
    ).to.equal(4);
  });
  it('should render validation errors for required fields', async () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(6);
    });
  });
  it('should conditionally require phone number', async () => {
    const { container } = render(
      <DefinitionTester
        formData={{}}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    // jsdom has issues with colons in attributes
    const errors = Array.from(
      container.querySelectorAll('.usa-input-error > label'),
    );
    const phoneError = errors.find(errorLabel =>
      errorLabel.getAttribute('for').endsWith('homePhone'),
    );
    expect(phoneError).to.be.undefined;

    const phoneMethod = container.querySelector(
      '#root_preferredContactMethod_3',
    );
    if (phoneMethod) {
      ReactTestUtils.Simulate.change(phoneMethod, {
        target: {
          value: 'phone',
        },
      });

      await waitFor(() => {
        const updatedErrors = Array.from(
          container.querySelectorAll('.usa-input-error > label'),
        );
        const updatedPhoneError = updatedErrors.find(errorLabel =>
          errorLabel.getAttribute('for').endsWith('homePhone'),
        );
        expect(updatedPhoneError).not.to.be.undefined;
      });
    }
  });
  it('should show error if emails do not match', async () => {
    const { container } = render(
      <DefinitionTester
        formData={{}}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    const emailInput = container.querySelector(
      '#root_view\\:otherContactInfo_email',
    );
    const confirmEmailInput = container.querySelector(
      '#root_view\\:otherContactInfo_view\\:confirmEmail',
    );

    if (emailInput && confirmEmailInput) {
      ReactTestUtils.Simulate.change(emailInput, {
        target: {
          value: 'test@test.com',
        },
      });
      ReactTestUtils.Simulate.change(confirmEmailInput, {
        target: {
          value: 'TEST@TEST.COM',
        },
      });
      ReactTestUtils.Simulate.blur(emailInput);
      ReactTestUtils.Simulate.blur(confirmEmailInput);

      await waitFor(() => {
        expect(container.querySelectorAll('.usa-input-error')).to.be.empty;
      });

      ReactTestUtils.Simulate.change(confirmEmailInput, {
        target: {
          value: 'test@test.org',
        },
      });

      await waitFor(() => {
        expect(container.querySelectorAll('.usa-input-error')).not.to.be.empty;
      });
    }
  });
  describe('review page', () => {
    it('should not render confirm email', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          data={{
            'view:otherContactInfo': {
              'view:confirmEmail': 'test@test.com',
            },
          }}
          reviewMode
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
        />,
      );

      expect(findDOMNode(form).textContent).not.to.contain('test@test.com');
    });
  });
};

describe('Edu contactInformationPage', () => {
  describe('1995', () =>
    pageTests(
      formConfig1995.chapters.personalInformation.pages.contactInformation,
      formConfig1995,
    ));
  describe('10203', () =>
    pageTests(
      formConfig10203.chapters.personalInformation.pages.contactInformation,
      formConfig10203,
    ));
});
