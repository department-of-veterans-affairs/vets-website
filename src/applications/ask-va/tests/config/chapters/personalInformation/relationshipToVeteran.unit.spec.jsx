import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import {
  relationshipOptionsMyself,
  relationshipOptionsSomeoneElse,
} from '../../../../constants';
import { getData } from '../../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.yourQuestionPart1.pages.relationshipToVeteran;

describe('relationshipToVeteranPage', () => {
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
      "I'm the Veteran",
      "I'm a family member of a Veteran",
      "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
    ];

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label')).to.equal(
      'What is your relationship to the Veteran?',
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });

  describe('schema updates', () => {
    it('should use relationshipOptionsMyself when whoIsYourQuestionAbout is Myself', () => {
      const formData = {
        whoIsYourQuestionAbout: 'Myself',
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );

      expect(updatedSchema.properties.relationshipToVeteran.enum).to.deep.equal(
        Object.values(relationshipOptionsMyself),
      );
    });

    it('should use relationshipOptionsSomeoneElse when whoIsYourQuestionAbout is not Myself', () => {
      const formData = {
        whoIsYourQuestionAbout: 'Someone else',
      };

      const updatedSchema = uiSchema['ui:options'].updateSchema(
        formData,
        schema,
      );

      expect(updatedSchema.properties.relationshipToVeteran.enum).to.deep.equal(
        Object.values(relationshipOptionsSomeoneElse),
      );
    });
  });

  describe('field validation', () => {
    it('should show error when no relationship is selected', async () => {
      const { container } = renderPage({});

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const vaRadio = container.querySelector('va-radio');
        expect(vaRadio.getAttribute('error')).to.equal(
          'Select your relationship to the Veteran.',
        );
      });
    });

    it('should not show error when a relationship is selected', async () => {
      const { container } = renderPage({
        relationshipToVeteran: "I'm the Veteran",
      });

      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const vaRadio = container.querySelector('va-radio');
        expect(vaRadio.getAttribute('error')).to.be.null;
      });
    });
  });
});
