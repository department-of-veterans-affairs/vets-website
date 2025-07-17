import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import militaryServicePages from '../../../../pages/02-military-service-chapter/militaryServicePages';
import MilitaryServiceIntro from '../../../../components/02-military-service-chapter/MilitaryServiceIntro';

const pages = militaryServicePages;

describe('Military Service Chapter Pages', () => {
  describe('Intro page', () => {
    it('renders the intro paragraph and all list items', () => {
      const { getByText, getAllByRole } = render(<MilitaryServiceIntro />);
      expect(
        getByText(
          /Over the next few pages, we will ask you questions about your military\s*service history. If you have served in the military, you will need to\s*provide the following:/,
        ),
      ).to.exist;
      const items = [
        'Branch of service',
        'Service start and end dates (month/year)',
        'Character of discharge',
      ];
      const listItems = getAllByRole('listitem');
      expect(listItems.length).to.equal(items.length);
      items.forEach((text, idx) => {
        expect(listItems[idx].textContent).to.equal(text);
      });
    });
  });

  describe('Summary page', () => {
    it('renders the summary yes/no question', () => {
      const { container } = render(
        <SchemaForm
          name="militaryServiceExperiencesSummary"
          title={pages.militaryServiceExperiencesSummary.title}
          schema={pages.militaryServiceExperiencesSummary.schema}
          uiSchema={pages.militaryServiceExperiencesSummary.uiSchema}
          data={{}}
          onChange={() => {}}
          onSubmit={() => {}}
        />,
      );
      // Check for the va-radio with the correct label
      const vaRadio = container.querySelector(
        'va-radio[label="Have you ever served in the military?"]',
      );
      expect(vaRadio).to.exist;
      const yesOption = container.querySelector('va-radio-option[label="Yes"]');
      const noOption = container.querySelector('va-radio-option[label="No"]');
      expect(yesOption).to.exist;
      expect(noOption).to.exist;
    });
  });

  describe('Branch and date range page', () => {
    it('renders branch select and date range fields', () => {
      const form = render(
        <DefinitionTester
          schema={pages.militaryServiceExperienceBranchDateRangePage.schema}
          uiSchema={pages.militaryServiceExperienceBranchDateRangePage.uiSchema}
          data={{
            militaryServiceExperiences: [
              {
                branch: 'Army',
                dateRange: { from: '2020-01-01', to: '2021-01-01' },
                currentlyServing: false,
              },
            ],
          }}
          arrayPath="militaryServiceExperiences"
          pagePerItemIndex={0}
        />,
      );
      const { container } = form;
      const branchSelect = container.querySelector(
        'va-select[label="Branch of service"]',
      );
      expect(branchSelect).to.exist;
      expect(container.innerHTML).to.include(
        'List all periods of military service experience. You will be able to add additional periods of service on subsequent screens.',
      );
      expect(container.innerHTML).to.include('Service start date');
      expect(container.innerHTML).to.include('Service end date');
      expect(container.innerHTML).to.include(
        'I am currently serving in this military service experience.',
      );
    });

    it("hides 'Service end date' when currently serving is checked", () => {
      const form = render(
        <DefinitionTester
          schema={pages.militaryServiceExperienceBranchDateRangePage.schema}
          uiSchema={pages.militaryServiceExperienceBranchDateRangePage.uiSchema}
          data={{
            militaryServiceExperiences: [
              {
                branch: 'Army',
                dateRange: { from: '2020-01-01', to: '' },
                currentlyServing: true,
              },
            ],
          }}
          arrayPath="militaryServiceExperiences"
          pagePerItemIndex={0}
        />,
      );
      const { container } = form;
      expect(container.querySelector('va-date[label="Service start date"]')).to
        .exist;
      expect(container.querySelector('va-date[label="Service end date"]')).to
        .not.exist;
      expect(container.innerHTML).to.include(
        'I am currently serving in this military service experience.',
      );
    });
  });

  describe('Character of discharge page', () => {
    it('renders character of discharge select', () => {
      const form = render(
        <DefinitionTester
          schema={
            pages.militaryServiceExperienceCharacterOfDischargePage.schema
          }
          uiSchema={
            pages.militaryServiceExperienceCharacterOfDischargePage.uiSchema
          }
          data={{
            militaryServiceExperiences: [
              {
                branch: 'Army',
                dateRange: { from: '2020-01-01', to: '2021-01-01' },
                currentlyServing: false,
                characterOfDischarge: 'Honorable',
              },
            ],
          }}
          arrayPath="militaryServiceExperiences"
          pagePerItemIndex={0}
        />,
      );
      const { container } = form;
      const dischargeSelect = container.querySelector(
        'va-select[label="Character of discharge"]',
      );
      expect(dischargeSelect).to.exist;
      const html = container.innerHTML;
      expect(html).to.include('Bad Conduct');
      expect(html).to.include('Honorable');
      expect(html).to.include('Other Than Honorable');
    });
  });

  describe('Explanation of discharge page', () => {
    it('renders explanation textarea', () => {
      const form = render(
        <DefinitionTester
          schema={
            pages.militaryServiceExperienceExplanationOfDischargePage.schema
          }
          uiSchema={
            pages.militaryServiceExperienceExplanationOfDischargePage.uiSchema
          }
          data={{
            militaryServiceExperiences: [
              {
                branch: 'Army',
                dateRange: { from: '2020-01-01', to: '2021-01-01' },
                currentlyServing: false,
                characterOfDischarge: 'Other Than Honorable',
                explanationOfDischarge: 'Explanation text',
              },
            ],
          }}
          arrayPath="militaryServiceExperiences"
          pagePerItemIndex={0}
        />,
      );
      const { container } = form;
      const vaTextarea = container.querySelector(
        'va-textarea[label="Explain the nature of your discharge."]',
      );
      expect(vaTextarea).to.exist;
    });
  });
});
