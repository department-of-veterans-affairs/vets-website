import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import militaryServicePages, {
  arrayBuilderOptions,
} from '../../../../pages/02-military-service-chapter/militaryServicePages';
import MilitaryServiceIntro from '../../../../components/02-military-service-chapter/MilitaryServiceIntro';
import { explanationRequired } from '../../../../constants/options';

const pages = militaryServicePages;

describe('Military Service Chapter Pages', () => {
  const formData = {
    militaryServiceExperiences: [
      {
        branch: 'Army',
        dateRange: { from: '2020-01-01', to: '2021-01-01' },
        currentlyServing: false,
      },
    ],
  };
  context('Intro page', () => {
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

  context('Summary page', () => {
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

      expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
      expect(
        $('va-radio-option:nth-child(2)', container).getAttribute('value'),
      ).to.eq('N');
    });
  });

  context('Branch and date range page', () => {
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
      const { container, getByText } = form;
      expect($('va-select[label="Branch of service"]', container)).to.exist;
      expect($('va-date[label="Service start date"]', container)).to.exist;
      expect($('va-date[label="Service end date"]', container)).to.exist;

      expect(
        $(
          'va-checkbox[label="I am currently serving in this military service experience."]',
          container,
        ),
      ).to.exist;

      getByText(
        'List all periods of military service experience. You will be able to add additional periods of service on subsequent screens.',
      );
    });

    it("hides 'Service end date' when currently serving is checked", () => {
      const { container } = render(
        <DefinitionTester
          schema={pages.militaryServiceExperienceBranchDateRangePage.schema}
          uiSchema={pages.militaryServiceExperienceBranchDateRangePage.uiSchema}
          data={formData}
          arrayPath="militaryServiceExperiences"
          pagePerItemIndex={0}
        />,
      );
      // service dates and checkbox  should be visible
      expect($('va-date[label="Service start date"]', container)).to.exist;
      expect($('va-date[label="Service end date"]', container)).to.exist;
      const currentlyServingCheckbox = $('va-checkbox', container);
      expect(currentlyServingCheckbox).to.exist;
      expect(currentlyServingCheckbox.getAttribute('checked')).to.equal(
        'false',
      );

      // check currently enrolled checkbox
      $('va-checkbox', container).__events.vaChange({
        target: { checked: true },
      });
      // end date is hidden and checkbox is checked
      expect($('va-date[label="Service end date"]', container)).to.not.exist;
      expect(currentlyServingCheckbox.getAttribute('checked')).to.equal('true');
    });
  });

  context('Character of discharge page', () => {
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
      const { container, getByRole } = form;
      const dischargeSelect = container.querySelector(
        'va-select[label="Character of discharge"]',
      );
      expect(dischargeSelect).to.exist;

      explanationRequired.forEach(option => {
        expect(getByRole('option', { name: option })).to.exist;
      });
    });
  });

  context('Explanation of discharge page', () => {
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

  context('arrayBuilderOptions', () => {
    it('should have the correct arrayPath, nouns, and maxItems properties', () => {
      expect(arrayBuilderOptions.arrayPath).to.equal(
        'militaryServiceExperiences',
      );
      expect(arrayBuilderOptions.nounSingular).to.equal(
        'military service experience',
      );
      expect(arrayBuilderOptions.nounPlural).to.equal(
        'military service experiences',
      );
      expect(arrayBuilderOptions.required).to.be.false;
    });

    it('should return the correct card title from getItemName', () => {
      const item = { branch: 'Air Force' };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(item.branch)).to.exist;
    });

    it('should return the correct card description with from and to dates', () => {
      const item = { dateRange: { from: '2000-01', to: '2004-01' } };
      const { getByText } = render(
        arrayBuilderOptions.text.cardDescription(item, 'currentlyServing'),
      );
      expect(getByText('January 2000 - January 2004')).to.exist;
    });

    it('should return the correct card description with from date and present', () => {
      const item = {
        dateRange: { from: '2000-01', to: '' },
        currentlyServing: true,
      };
      const { getByText } = render(
        arrayBuilderOptions.text.cardDescription(item, 'currentlyServing'),
      );
      expect(getByText('January 2000 - Present')).to.exist;
    });
  });
});
