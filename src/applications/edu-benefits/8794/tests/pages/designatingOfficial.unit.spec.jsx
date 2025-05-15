import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$, $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('Designating official page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.designatingOfficialChapter.pages.designatingOfficial;

  it('Renders the page with the correct number of inputs', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(7);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-text-input[error]', container).length).to.equal(4);
  });
  it('Renders the page with the correct number of required inputs after selecting a phone type', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    expect($$('va-text-input[error]', container).length).to.equal(4);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'us' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'intl' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);
  });
  it('should validate first name with character limit', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateFirstName =
      uiSchema.designatingOfficial.first['ui:validations'][0];
    validateFirstName(
      errors,
      'Janejanejanejanejanejanejanejanejanejanejanejanejanejane',
    );
    expect(errors.messages).to.include(
      'Enter your first name with up to 50 characters',
    );

    errors.messages = [];
    validateFirstName(errors, 'Jane');
    expect(errors.messages).to.be.empty;
  });
  it('should validate middle name with character limit', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateMiddleName =
      uiSchema.designatingOfficial.middle['ui:validations'][0];
    validateMiddleName(
      errors,
      'Doedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoe',
    );
    expect(errors.messages).to.include(
      'Enter your middle name with up to 50 characters',
    );

    errors.messages = [];
    validateMiddleName(errors, 'Doe');
    expect(errors.messages).to.be.empty;
  });
  it('should validate last name with character limit', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateLastName =
      uiSchema.designatingOfficial.last['ui:validations'][0];
    validateLastName(
      errors,
      'Doedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoe',
    );
    expect(errors.messages).to.include(
      'Enter your last name with up to 50 characters',
    );

    errors.messages = [];
    validateLastName(errors, 'Doe');
    expect(errors.messages).to.be.empty;
  });
  it('should validate title with character limit', () => {
    const errors = {
      addError: message => {
        errors.messages.push(message);
      },
      messages: [],
    };

    const validateTitle =
      uiSchema.designatingOfficial.title['ui:validations'][0];
    validateTitle(
      errors,
      'Test title test title test title test title test title test title',
    );
    expect(errors.messages).to.include(
      'Enter your title with up to 50 characters',
    );

    errors.messages = [];
    validateTitle(errors, 'Test title');
    expect(errors.messages).to.be.empty;
  });
});
