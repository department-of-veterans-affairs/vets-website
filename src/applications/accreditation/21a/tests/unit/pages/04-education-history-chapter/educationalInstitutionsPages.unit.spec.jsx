import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import educationalInstitutionsPages from '../../../../pages/04-education-history-chapter/educationalInstitutionsPages';
import EducationHistoryIntro from '../../../../components/04-education-history-chapter/EducationHistoryIntro';
import {
  institutionTypeOptions,
  degreeOptions,
} from '../../../../constants/options';
import { createDateRangeText } from '../../../../pages/helpers/createDateRangeText';

describe('educationalInstitutionsPages', () => {
  const formData = {
    name: 'School Name',
    major: 'Major',
    institution: institutionTypeOptions[0],
    degreeReceived: true,
    degree: degreeOptions[0],
    dateRange: { from: '2022-01', to: '2024-06' },
    currentlyEnrolled: false,
  };
  context('Show Intro page', () => {
    it('it renders the page pragraph and list items', () => {
      const { getByText, getAllByRole } = render(<EducationHistoryIntro />);
      expect(
        getByText(
          /We will ask you to provide information about your education. You will need to list all the institutions you have attended starting with your high school. For each institution, you will need to provide the following information:/,
        ),
      ).to.exist;
      const items = [
        'Name of institution',
        'Institution type',
        'Start and end date (month/year)',
        'Type of degree (if applicable)',
        'Major (if applicable)',
        'Explanation for not completing degree (if applicable)',
      ];
      const listItems = getAllByRole('listitem');
      expect(listItems.length).to.equal(items.length);
      items.forEach((text, idx) => {
        expect(listItems[idx].textContent).to.equal(text);
      });
    });
  });
  context('Show Summary Page', () => {
    const { educationalInstitutionsSummary } = educationalInstitutionsPages;
    it('renders the summary page with a yes/no question', () => {
      const { container, findByText } = render(
        <SchemaForm
          name="educationalInstitutionsSummary"
          title={educationalInstitutionsSummary.title}
          schema={educationalInstitutionsSummary.schema}
          uiSchema={educationalInstitutionsSummary.uiSchema}
          data={{ formData }}
          onChange={() => {}}
          onSubmit={() => {}}
        />,
      );
      findByText('Review your educational institutions');
      findByText(formData.name);
      findByText(createDateRangeText(formData, 'currentlyEnrolled'));
      findByText('Do you have another educational institution to add?');
      findByText('Include all education history since high school.');
      expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
      expect(
        $('va-radio-option:nth-child(2)', container).getAttribute('value'),
      ).to.eq('N');
    });
  });
  context('Show Institution and Degree Information Page', () => {
    const {
      educationalInstitutionInstitutionAndDegreePage,
    } = educationalInstitutionsPages;
    it('renders the institution and degree information page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={educationalInstitutionInstitutionAndDegreePage.schema}
          uiSchema={educationalInstitutionInstitutionAndDegreePage.uiSchema}
          data={{ educationalInstitutions: [formData] }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      getByText('Institution and degree information');
      expect($('va-text-input[label="Name of school"]'), container).to.exist;
      expect($('va-select', container).getAttribute('label')).to.eq(
        'Institution type',
      );
      expect($('va-date[label="Start date"]', container)).to.exist;
      expect($('va-date[label="End date"]', container)).to.exist;
      expect($('va-checkbox', container).getAttribute('label')).to.eq(
        'I still go to school here.',
      );
      expect($('va-radio', container).getAttribute('label')).to.eq(
        'Degree received?',
      );
      expect($('va-text-input[label="Major"]'), container).to.exist;
    });
    it('hides end date when currentlyEnrolled is true', () => {
      const { container } = render(
        <DefinitionTester
          schema={educationalInstitutionInstitutionAndDegreePage.schema}
          uiSchema={educationalInstitutionInstitutionAndDegreePage.uiSchema}
          data={{
            educationalInstitutions: [formData],
          }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      expect($('va-date[label="End date"]', container)).to.exist;
      const currentlyEnrolled = $('va-checkbox', container);
      expect(currentlyEnrolled).to.exist;
      expect(currentlyEnrolled.getAttribute('checked')).to.equal('false');
      $('va-checkbox', container).__events.vaChange({
        target: { checked: true },
      });
      expect($('va-checkbox', container).getAttribute('checked')).to.equal(
        'true',
      );
      expect($('va-date[label="End date"]', container)).to.not.exist;
    });
  });
  context('Institution Degree Information Page', () => {
    const {
      educationalInstitutionDegreeInformationPage,
    } = educationalInstitutionsPages;
    it('renders the institution degree information page and question about not completing degree', () => {
      const { container } = render(
        <DefinitionTester
          schema={educationalInstitutionDegreeInformationPage.schema}
          uiSchema={educationalInstitutionDegreeInformationPage.uiSchema}
          data={{
            educationalInstitutions: [
              {
                name: 'School Name',
                major: 'Major',
                institution: institutionTypeOptions[0],
                degreeReceived: false,
                degree: degreeOptions[0],
                dateRange: { from: '2022-01', to: '2024-06' },
                currentlyEnrolled: false,
              },
            ],
          }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      expect($('va-textarea'), container).to.exist;
      expect($('va-textarea', container).getAttribute('label')).to.eq(
        'Explain why you did not complete this degree.',
      );
      expect($('va-select'), container).to.not.exist;
    });
    it('renders the institution degree information page and asks for type of degree', () => {
      const { container } = render(
        <DefinitionTester
          schema={educationalInstitutionDegreeInformationPage.schema}
          uiSchema={educationalInstitutionDegreeInformationPage.uiSchema}
          data={{
            educationalInstitutions: [formData],
          }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      expect($('va-textarea'), container).to.not.exist;
      expect($('va-select'), container).to.exist;
      expect($('va-select', container).getAttribute('label')).to.eq(
        'Type of degree',
      );
    });
  });
  context('Institution Degree Address Page', () => {
    const { educationalInstitutionAddressPage } = educationalInstitutionsPages;
    it('renders the institution degree address page', () => {
      const { container } = render(
        <DefinitionTester
          schema={educationalInstitutionAddressPage.schema}
          uiSchema={educationalInstitutionAddressPage.uiSchema}
          data={{
            educationalInstitutions: [formData],
          }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      expect($('va-checkbox', container).getAttribute('label')).to.eq(
        'Institution is on a United States military base outside of the U.S.',
      );
      expect($('va-select', container).getAttribute('label')).to.eq('Country');
      expect($('va-text-input[label="Street address"]', container)).to.exist;
      expect($('va-text-input[label="Street address line 2"]', container)).to
        .exist;
      expect($('va-text-input[label="City"]', container)).to.exist;
      expect($('va-text-input[label="State, province, or region"]', container))
        .to.exist;
      expect($('va-text-input[label="Postal code"]', container)).to.exist;
    });
  });

  context('Institution degree information page', () => {
    const {
      educationalInstitutionDegreeInformationPage,
    } = educationalInstitutionsPages;
    it('when degreeReceived=true', () => {
      const { container } = render(
        <DefinitionTester
          schema={educationalInstitutionDegreeInformationPage.schema}
          uiSchema={educationalInstitutionDegreeInformationPage.uiSchema}
          data={{
            educationalInstitutions: [formData],
          }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      expect($('va-textarea', container)).to.not.exist;
      expect($('va-select[label="Type of degree"]', container)).to.exist;
    });

    it('when degreeReceived=false', () => {
      const { container } = render(
        <DefinitionTester
          schema={educationalInstitutionDegreeInformationPage.schema}
          uiSchema={educationalInstitutionDegreeInformationPage.uiSchema}
          data={{
            educationalInstitutions: [
              {
                name: 'School Name',
                major: 'Major',
                institution: institutionTypeOptions[0],
                degreeReceived: false,
                degree: degreeOptions[0],
                dateRange: { from: '2022-01', to: '2024-06' },
                currentlyEnrolled: false,
              },
            ],
          }}
          arrayPath="educationalInstitutions"
          pagePerItemIndex={0}
        />,
      );
      expect(
        $(
          'va-textarea[label="Explain why you did not complete this degree."]',
          container,
        ),
      ).to.exist;
      expect($('va-select', container)).to.not.exist;
    });
  });
});
