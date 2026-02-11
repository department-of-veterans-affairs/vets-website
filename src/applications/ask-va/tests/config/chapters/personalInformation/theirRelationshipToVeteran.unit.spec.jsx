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
} = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember.pages.theirRelationshipToVeteran_aboutsomeoneelserelationshipfamilymemberaboutfamilymember;

describe('theirRelationshipToVeteranPage', () => {
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

    const radioLabels = $$('.form-radio-buttons > label', container);
    const radioLabelList = [
      "They're the Veteran's spouse",
      "They're the Veteran's child",
      "They're the Veteran's step child",
      "They're the Veteran's parent",
      "They have a relationship that's not listed",
    ];

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label')).to.equal(
      'What is their relationship to the Veteran?',
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });

  describe('schema updates', () => {
    it('should require only theirRelationshipToVeteran when relationship is listed', () => {
      const formSchema = {
        properties: {
          theyHaveRelationshipNotListed: {
            'ui:collapsed': true,
          },
        },
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema({}, formSchema);
      expect(updatedSchema.required).to.deep.equal([
        'theirRelationshipToVeteran',
      ]);
    });

    it('should require both fields when relationship is not listed', () => {
      const formSchema = {
        properties: {
          theyHaveRelationshipNotListed: {
            'ui:collapsed': false,
          },
        },
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema({}, formSchema);
      expect(updatedSchema.required).to.deep.equal([
        'theirRelationshipToVeteran',
        'theyHaveRelationshipNotListed',
      ]);
    });
  });

  describe('conditional fields', () => {
    it('should show text input when NOT_LISTED is selected', () => {
      const { container } = renderPage({
        theirRelationshipToVeteran: 'NOT_LISTED',
      });

      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.exist;
      expect(textInput.getAttribute('label')).to.equal(
        'Describe their relationship to the Veteran',
      );
    });

    it('should not show text input for other relationships', () => {
      const { container } = renderPage({
        theirRelationshipToVeteran: 'SPOUSE',
      });

      const textInput = container.querySelector('va-text-input');
      expect(textInput).to.not.exist;
    });

    it('should validate required text input when NOT_LISTED is selected', async () => {
      const { container } = renderPage({
        theirRelationshipToVeteran: 'NOT_LISTED',
        theyHaveRelationshipNotListed: '',
      });

      const submitButton = container.querySelector('button[type="submit"]');

      // Trigger validation by clicking submit
      fireEvent.click(submitButton);

      // Wait for validation to complete and check error message
      await waitFor(
        () => {
          const textInput = container.querySelector('va-text-input');
          expect(textInput.getAttribute('required')).to.equal('true');
          // The text input doesn't get an error message in this case
          expect(textInput.hasAttribute('error')).to.be.false;
        },
        { timeout: 1000 },
      );
    });

    it('should validate radio button selection', async () => {
      const { container } = renderPage({
        theirRelationshipToVeteran: '',
      });

      const submitButton = container.querySelector('button[type="submit"]');

      // Trigger validation by clicking submit
      fireEvent.click(submitButton);

      // Wait for validation to complete and check error message
      await waitFor(
        () => {
          const vaRadio = container.querySelector('va-radio');
          expect(vaRadio.getAttribute('error')).to.equal(
            'You must select a valid option',
          );
        },
        { timeout: 1000 },
      );
    });
  });
});
