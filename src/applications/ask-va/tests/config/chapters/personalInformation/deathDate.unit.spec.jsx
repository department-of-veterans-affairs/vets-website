import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutVeteran.pages.dateOfDeath_aboutsomeoneelserelationshipfamilymemberaboutveteran;

describe('deathDatePage', () => {
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

  describe('form rendering', () => {
    it('should render empty form', () => {
      const { container } = renderPage();

      expect($('h3', container).textContent).to.eq("Date of Veteran's death");

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent).to.exist;
      expect(dateComponent.getAttribute('label')).to.eq(
        "Date of Veteran's death",
      );
      expect(dateComponent.getAttribute('required')).to.eq('true');
      expect(dateComponent.getAttribute('month-select')).to.eq('true');
    });

    it('should render with a valid date', () => {
      const testDate = '2023-12-25';
      const { container } = renderPage({ dateOfDeath: testDate });

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent).to.exist;
      expect(dateComponent.getAttribute('value')).to.eq(testDate);
    });

    it('should render with null date', () => {
      const { container } = renderPage({ dateOfDeath: null });

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent).to.exist;
      expect(dateComponent.getAttribute('value')).to.be.null;
    });

    it('should handle invalid date format', () => {
      const { container } = renderPage({ dateOfDeath: 'invalid--' });

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent).to.exist;
      expect(dateComponent.getAttribute('value')).to.eq('invalid--');
    });
  });

  describe('validation', () => {
    it('should validate required field', async () => {
      const { container } = renderPage();
      const form = $('form', container);

      // Trigger form validation
      form.dispatchEvent(new Event('submit'));

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent.getAttribute('required')).to.eq('true');
    });

    it('should validate date pattern', () => {
      const { container } = renderPage();

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent.getAttribute('pattern')).to.eq(
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
      );
    });

    it('should handle future date validation', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = `${futureDate.getFullYear()}-${futureDate.getMonth() +
        1}-${futureDate.getDate()}`;

      const { container } = renderPage({
        dateOfDeath: futureDateString,
      });

      const dateComponent = $('va-memorable-date', container);
      expect(dateComponent).to.exist;
      const value = dateComponent.getAttribute('value');

      // Create a Date object from the value to compare the actual dates rather than string formats
      const valueDate = new Date(value);
      const expectedDate = new Date(futureDateString);
      expect(valueDate.getTime()).to.equal(expectedDate.getTime());
    });
  });

  describe('review mode', () => {
    /* eslint-disable react/prop-types */
    const MockChild = ({ formData }) => (
      <div data-testid="mock-child">{formData}</div>
    );
    /* eslint-enable react/prop-types */

    it('should render review field with formatted date', () => {
      const testDate = '2023-12-25';
      const ReviewField = uiSchema.dateOfDeath['ui:reviewField'];
      const { container } = render(
        <ReviewField>
          <MockChild formData={testDate} />
        </ReviewField>,
      );

      const reviewRow = $('.review-row', container);
      expect(reviewRow).to.exist;
      expect($('dt', reviewRow).textContent).to.eq("Date of Veteran's death");
      expect($('dd', reviewRow).textContent).to.contain('December 25, 2023');
    });

    it('should not render review field content when date is null', () => {
      const ReviewField = uiSchema.dateOfDeath['ui:reviewField'];
      const { container } = render(
        <ReviewField>
          <MockChild formData={null} />
        </ReviewField>,
      );

      const reviewRow = $('.review-row', container);
      expect(reviewRow).to.exist;
      expect($('dd', reviewRow).textContent.trim()).to.equal('');
    });

    it('should render Invalid Date for invalid date format', () => {
      const ReviewField = uiSchema.dateOfDeath['ui:reviewField'];
      const { container } = render(
        <ReviewField>
          <MockChild formData="invalid-date" />
        </ReviewField>,
      );

      const reviewRow = $('.review-row', container);
      expect(reviewRow).to.exist;
      expect($('dd', reviewRow).textContent.trim()).to.equal('Invalid Date');
    });
  });
});
