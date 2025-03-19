import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  emailSchema,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import { Provider } from 'react-redux';

import {
  createBooleanSchemaPropertiesFromOptions,
  createUiTitlePropertiesFromOptions,
} from '../../../../config/chapters/personalInformation/yourContactInformation';
import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.generalQuestion.pages.yourContactInformation_generalquestion;

describe('yourContactInformationPage', () => {
  describe('helper functions', () => {
    it('should create boolean schema properties from options', () => {
      const options = {
        option1: 'Value 1',
        option2: 'Value 2',
      };

      const result = createBooleanSchemaPropertiesFromOptions(options);

      expect(result).to.deep.equal({
        option1: { type: 'boolean' },
        option2: { type: 'boolean' },
      });
    });

    it('should create UI title properties from options', () => {
      const options = {
        option1: 'Value 1',
        option2: 'Value 2',
      };

      const result = createUiTitlePropertiesFromOptions(options);

      expect(result).to.deep.equal({
        option1: { 'ui:title': 'Value 1' },
        option2: { 'ui:title': 'Value 2' },
      });
    });
  });

  const renderPage = (formData = {}) => {
    return render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
          formData={formData}
        />
      </Provider>,
    );
  };

  it('should render empty form', () => {
    const { container } = renderPage();

    const inputs = $$('va-text-input', container);
    const options = $$('va-radio-option', container);

    expect($('h3', container).textContent).to.eq('Your contact information');
    expect(inputs.length).to.eq(3);
    expect(options.length).to.eq(3);
  });

  describe('schema updates', () => {
    it('should update schema for work-related connections with email preference', () => {
      const formData = {
        personalRelationship:
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
        contactPreferences: ['Email'],
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );

      expect(updatedSchema.required).to.deep.equal([
        'businessPhone',
        'businessEmail',
      ]);

      expect(updatedSchema.properties).to.deep.include({
        businessPhone: phoneSchema,
        businessEmail: emailSchema,
        preferredName: {
          type: 'string',
          pattern: '^[A-Za-z]+$',
          minLength: 1,
          maxLength: 25,
        },
      });
    });

    it('should update schema for email-only preference (non-work connection)', () => {
      const formData = {
        personalRelationship: "I'm the Veteran",
        contactPreferences: ['Email'],
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );

      expect(updatedSchema.required).to.deep.equal([
        'phoneNumber',
        'emailAddress',
      ]);

      expect(updatedSchema.properties).to.deep.include({
        phoneNumber: phoneSchema,
        emailAddress: emailSchema,
        preferredName: {
          type: 'string',
          pattern: '^[A-Za-z]+$',
          minLength: 1,
          maxLength: 25,
        },
      });
    });

    it('should use default schema for non-email-only preferences', () => {
      const formData = {
        personalRelationship: "I'm the Veteran",
        contactPreferences: ['Phone', 'Email'],
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );

      expect(updatedSchema.required).to.deep.equal([
        'phoneNumber',
        'emailAddress',
        'contactPreference',
      ]);

      expect(updatedSchema.properties).to.deep.include({
        phoneNumber: phoneSchema,
        emailAddress: emailSchema,
        preferredName: {
          type: 'string',
          pattern: '^[A-Za-z]+$',
          minLength: 1,
          maxLength: 25,
        },
      });
    });
  });

  describe('field validation', () => {
    it('should validate required fields', async () => {
      const { container } = renderPage({});

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const phoneInput = container.querySelector(
          'va-text-input[name="root_phoneNumber"]',
        );
        const emailInput = container.querySelector(
          'va-text-input[name="root_emailAddress"]',
        );
        const contactPrefRadio = container.querySelector(
          'va-radio[name="root_contactPreference"]',
        );

        expect(phoneInput.getAttribute('error')).to.exist;
        expect(emailInput.getAttribute('error')).to.exist;
        expect(contactPrefRadio.getAttribute('error')).to.exist;
      });
    });

    it('should validate preferred name format', async () => {
      const { container } = renderPage({
        preferredName: '123', // Invalid: should only contain letters
      });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const nameInput = container.querySelector(
          'va-text-input[name="root_preferredName"]',
        );
        expect(nameInput.getAttribute('error')).to.exist;
      });
    });
  });

  describe('conditional fields', () => {
    it('should show contact fields for work-related connections', () => {
      const { container } = renderPage({
        personalRelationship:
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
        contactPreferences: { EMAIL: true },
      });

      const phoneInput = container.querySelector(
        'va-text-input[name="root_phoneNumber"]',
      );
      const emailInput = container.querySelector(
        'va-text-input[name="root_emailAddress"]',
      );

      expect(phoneInput).to.exist;
      expect(emailInput).to.exist;
    });
  });
});
