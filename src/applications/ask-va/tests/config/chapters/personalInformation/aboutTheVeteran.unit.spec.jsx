import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';
import { removeReqFromLabel } from '../../../fixtures/test-helpers/helpers';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutVeteran.pages.aboutTheVeteran_aboutsomeoneelserelationshipfamilymemberaboutveteran;

describe('aboutTheVeteranPage', () => {
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

    const labels = $$('label', container);
    const labelList = [
      'First name',
      'Middle name',
      'Last name',
      'Suffix',
      'Preferred name',
      'Social Security number',
      'Service number',
      'Month',
      'Day',
      'Year',
      'He/him/his',
      'She/her/hers',
      'They/them/theirs',
      'Ze/zir/zirs',
      'Use my preferred name',
      'If not listed, provide your preferred pronouns',
      'Man',
      'Non-binary',
      'Transgender man',
      'Transgender woman',
      'Woman',
      'Prefer not to answer',
      'A gender not listed here',
    ];

    expect($('h3', container).textContent).to.eq('Tell us about the Veteran');

    labels.forEach(
      label =>
        expect(labelList.includes(removeReqFromLabel(label.textContent).trim()))
          .to.be.true,
    );
  });

  describe('field validation', () => {
    it('should validate when neither SSN nor service number is provided', async () => {
      const { container } = renderPage({
        aboutTheVeteran: {
          socialOrServiceNum: {
            ssn: '',
            serviceNumber: '',
          },
        },
      });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = container.querySelector(
          '.usa-input-error-message',
        );
        expect(errorMessage.textContent).to.contain(
          "Enter either the Veteran's Social Security number or Service number",
        );
      });
    });

    it('should not show validation error when SSN is provided', async () => {
      const { container } = renderPage({
        aboutTheVeteran: {
          socialOrServiceNum: {
            ssn: '123-45-6789',
            serviceNumber: '',
          },
        },
      });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = container.querySelector(
          '.usa-input-error-message',
        );
        expect(errorMessage).to.be.null;
      });
    });
  });
});
