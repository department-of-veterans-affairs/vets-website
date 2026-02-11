import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipVeteran.pages.aboutYourRelationshipToFamilyMember_aboutsomeoneelserelationshipveteran;

describe('relationshipToFamilyMemberPage', () => {
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

  it('should render', () => {
    const { container } = renderPage();

    const radioLabels = $$('.form-radio-buttons > label', container);
    const radioLabelList = [
      "They're my spouse",
      "They're my child",
      "They're my step child",
      "They're my parent",
      "We have a relationship that's not listed",
    ];

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label')).to.equal(
      'What is your relationship to the family member?',
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });

  describe('schema updates', () => {
    it('should only require aboutYourRelationshipToFamilyMember when relationshipNotListed is collapsed', () => {
      const formSchema = {
        properties: {
          relationshipNotListed: {
            'ui:collapsed': true,
          },
        },
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema({}, formSchema);

      expect(updatedSchema.required).to.deep.equal([
        'aboutYourRelationshipToFamilyMember',
      ]);
    });

    it('should require both fields when relationshipNotListed is expanded', () => {
      const formSchema = {
        properties: {
          relationshipNotListed: {
            'ui:collapsed': false,
          },
        },
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema({}, formSchema);

      expect(updatedSchema.required).to.deep.equal([
        'aboutYourRelationshipToFamilyMember',
        'relationshipNotListed',
      ]);
    });
  });

  describe('field validation', () => {
    it('should show error when relationship not listed is selected but description is empty', async () => {
      const { container } = renderPage({
        aboutYourRelationshipToFamilyMember: 'NOT_LISTED',
      });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const textInput = container.querySelector(
          'va-text-input[name="root_relationshipNotListed"]',
        );
        expect(textInput.getAttribute('error')).to.equal(
          'Enter your relationship to the family member',
        );
      });
    });

    it('should not show relationship description error when another option is selected', async () => {
      const { container } = renderPage({
        aboutYourRelationshipToFamilyMember: 'SPOUSE',
      });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const textInput = container.querySelector(
          'va-text-input[name="root_relationshipNotListed"]',
        );
        expect(textInput).to.be.null;
      });
    });
  });
});
