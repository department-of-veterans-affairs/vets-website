import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import jurisdictionsPages, {
  arrayBuilderOptions,
} from '../../../../pages/05-professional-affiliations-chapter/jurisdictionsPages';

describe('Jurisdictions Pages', () => {
  const formData = {
    jurisdiction: 'Alabama',
    admissionDate: '1993-10-11',
    membershipOrRegistrationNumber: 'TEST123',
  };
  context('Summary Page', () => {
    const { jurisdictionsSummary } = jurisdictionsPages;
    it('renders the summary yes/no question', () => {
      const { container } = render(
        <DefinitionTester
          schema={jurisdictionsSummary.schema}
          uiSchema={jurisdictionsSummary.uiSchema}
          data={{}}
        />,
      );
      const radio = $('va-radio', container);
      expect(radio).to.exist;
      expect(radio.getAttribute('label')).to.include(
        'Are you currently admitted to practice before any jurisdictions?',
      );
      expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
      expect(
        $('va-radio-option:nth-child(2)', container).getAttribute('value'),
      ).to.eq('N');
    });
  });

  context('Agency or Court Page', () => {
    const { jurisdictionPage } = jurisdictionsPages;
    it('renders the jurisdiction page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={jurisdictionPage.schema}
          uiSchema={jurisdictionPage.uiSchema}
          data={{ jurisdictions: [formData] }}
          arrayPath="jurisdictions"
          pagePerItemIndex={0}
        />,
      );
      getByText('Jurisdiction');
      getByText(
        'List each jurisdiction to which you are admitted. You will be able to add additional jurisdictions on the next screen.',
      );
      expect($('va-select[label="Jurisdiction"]', container)).to.exist;
      expect($('va-text-input[label="Name of jurisdiction"]', container)).to.not
        .exist;
      expect($('va-memorable-date', container)).to.exist;
      expect(
        $(
          'va-text-input[label="Membership or registration number"]',
          container,
        ),
      ).to.exist;
    });
    it('verifies values from the form data are populating the page', () => {
      const { container } = render(
        <DefinitionTester
          schema={jurisdictionPage.schema}
          uiSchema={jurisdictionPage.uiSchema}
          data={{ jurisdictions: [formData] }}
          arrayPath="jurisdictions"
          pagePerItemIndex={0}
        />,
      );
      expect(
        $('va-select[label="Jurisdiction"]', container).getAttribute('value'),
      ).to.equal(formData.jurisdiction);
      expect($('va-memorable-date', container).getAttribute('value')).to.equal(
        formData.admissionDate,
      );
      expect(
        $(
          'va-text-input[label="Membership or registration number"]',
          container,
        ).getAttribute('value'),
      ).to.equal(formData.membershipOrRegistrationNumber);
    });
    it('renders the name of jurisdiction when other is selected', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={jurisdictionPage.schema}
          uiSchema={jurisdictionPage.uiSchema}
          data={{
            jurisdictions: [
              {
                ...formData,
                jurisdiction: 'Other',
                otherJurisdiction: 'Other Agency Name',
              },
            ],
          }}
          arrayPath="jurisdictions"
          pagePerItemIndex={0}
        />,
      );
      getByText('Jurisdiction');
      getByText(
        'List each jurisdiction to which you are admitted. You will be able to add additional jurisdictions on the next screen.',
      );
      expect($('va-select[label="Jurisdiction"]', container)).to.exist;
      expect($('va-text-input[label="Name of jurisdiction"]', container)).to
        .exist;
      expect($('va-memorable-date', container)).to.exist;
      expect(
        $(
          'va-text-input[label="Membership or registration number"]',
          container,
        ),
      ).to.exist;
    });
  });

  context('arrayBuilderOptions', () => {
    it('should have the correct arrayPath, nouns, reviewAddButton text, yesNoBlankReviewQuestion text and maxItems properties', () => {
      expect(arrayBuilderOptions.arrayPath).to.equal('jurisdictions');
      expect(arrayBuilderOptions.nounSingular).to.equal('jurisdiction');
      expect(arrayBuilderOptions.nounPlural).to.equal('jurisdictions');
      expect(arrayBuilderOptions.required).to.be.false;
      expect(arrayBuilderOptions.text.reviewAddButtonText()).to.equal(
        'Add a jurisdiction',
      );
      expect(arrayBuilderOptions.text.yesNoBlankReviewQuestion()).to.equal(
        'Are you currently admitted to practice before any jurisdictions?',
      );
    });

    it('should return the correct card title from getItemName', () => {
      const item = { jurisdiction: 'Alabama' };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(item.jurisdiction)).to.exist;
    });

    it('when jurisdiction is Other, should return the correct card title from getItemName', () => {
      const item = {
        jurisdiction: 'Other',
        otherJurisdiction: 'Other Jurisdiction Name',
      };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(item.otherJurisdiction)).to.exist;
    });

    it('should return the correct card description with admissionDate and membership/registration number', () => {
      const item = {
        admissionDate: '1990-01-13',
        membershipOrRegistrationNumber: 'TEST123',
      };
      const { getByText } = render(
        arrayBuilderOptions.text.cardDescription(item),
      );
      expect(getByText('January 13, 1990, #TEST123')).to.exist;
    });

    context('isItemIncomplete function', () => {
      it('should return true when item is null', () => {
        expect(arrayBuilderOptions.isItemIncomplete(null)).to.be.true;
      });

      it('should return true when item is undefined', () => {
        expect(arrayBuilderOptions.isItemIncomplete(undefined)).to.be.true;
      });

      it('should return true when item is empty object', () => {
        expect(arrayBuilderOptions.isItemIncomplete({})).to.be.true;
      });

      it('should return true when jurisdiction is missing', () => {
        const item = {
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when jurisdiction is null', () => {
        const item = {
          jurisdiction: null,
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when jurisdiction is empty string', () => {
        const item = {
          jurisdiction: '',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when jurisdiction is "Other" but otherJurisdiction is missing', () => {
        const item = {
          jurisdiction: 'Other',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when jurisdiction is "Other" but otherJurisdiction is null', () => {
        const item = {
          jurisdiction: 'Other',
          otherJurisdiction: null,
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when jurisdiction is "Other" but otherJurisdiction is empty string', () => {
        const item = {
          jurisdiction: 'Other',
          otherJurisdiction: '',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when admissionDate is missing', () => {
        const item = {
          jurisdiction: 'Alabama',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when admissionDate is null', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: null,
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when admissionDate is empty string', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: '',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when membershipOrRegistrationNumber is missing', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: '1990-01-13',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when membershipOrRegistrationNumber is null', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: null,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when membershipOrRegistrationNumber is empty string', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: '',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return false when all required fields are present with regular jurisdiction', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return false when all required fields are present with "Other" jurisdiction and otherJurisdiction', () => {
        const item = {
          jurisdiction: 'Other',
          otherJurisdiction: 'Custom Jurisdiction Name',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return true when only jurisdiction is missing (all others present)', () => {
        const item = {
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only admissionDate is missing (all others present)', () => {
        const item = {
          jurisdiction: 'Alabama',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only membershipOrRegistrationNumber is missing (all others present)', () => {
        const item = {
          jurisdiction: 'Alabama',
          admissionDate: '1990-01-13',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when jurisdiction is "Other" but otherJurisdiction is missing (all others present)', () => {
        const item = {
          jurisdiction: 'Other',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });
    });
  });
});
