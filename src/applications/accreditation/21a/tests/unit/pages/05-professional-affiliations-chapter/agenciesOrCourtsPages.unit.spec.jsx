import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import agenciesOrCourtsPages, {
  arrayBuilderOptions,
} from '../../../../pages/05-professional-affiliations-chapter/agenciesOrCourtsPages';

describe('Agencies Or Courts Pages', () => {
  const formData = {
    agencyOrCourt: 'Court of Appeals for the Federal Circuit',
    admissionDate: '1993-10-11',
    membershipOrRegistrationNumber: 'TEST123',
  };
  context('Summary Page', () => {
    const { agenciesOrCourtsSummary } = agenciesOrCourtsPages;
    it('renders the summary yes/no question', () => {
      const { container } = render(
        <DefinitionTester
          schema={agenciesOrCourtsSummary.schema}
          uiSchema={agenciesOrCourtsSummary.uiSchema}
          data={{}}
        />,
      );
      const radio = $('va-radio', container);
      expect(radio).to.exist;
      expect(radio.getAttribute('label')).to.include(
        'Are you currently admitted to practice before any state or Federal agency or any Federal court?',
      );
      expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
      expect(
        $('va-radio-option:nth-child(2)', container).getAttribute('value'),
      ).to.eq('N');
    });
  });

  context('Agency or Court Page', () => {
    const { agencyOrCourtPage } = agenciesOrCourtsPages;
    it('renders the agency or court page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={agencyOrCourtPage.schema}
          uiSchema={agencyOrCourtPage.uiSchema}
          data={{ agenciesOrCourts: [formData] }}
          arrayPath="agenciesOrCourts"
          pagePerItemIndex={0}
        />,
      );
      getByText('State or Federal agency or court');
      getByText(
        'List each agency or court to which you are admitted. You will be able to add additional agencies or courts on the next screen.',
      );
      expect($('va-select[label="Agency/court"]', container)).to.exist;
      expect($('va-text-input[label="Name of agency/court"]', container)).to.not
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
          schema={agencyOrCourtPage.schema}
          uiSchema={agencyOrCourtPage.uiSchema}
          data={{ agenciesOrCourts: [formData] }}
          arrayPath="agenciesOrCourts"
          pagePerItemIndex={0}
        />,
      );
      expect(
        $('va-select[label="Agency/court"]', container).getAttribute('value'),
      ).to.equal(formData.agencyOrCourt);
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
    it('renders the name of agency/court when other is selected', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={agencyOrCourtPage.schema}
          uiSchema={agencyOrCourtPage.uiSchema}
          data={{
            agenciesOrCourts: [
              {
                ...formData,
                agencyOrCourt: 'Other',
                otherAgencyOrCourt: 'Other Agency Name',
              },
            ],
          }}
          arrayPath="agenciesOrCourts"
          pagePerItemIndex={0}
        />,
      );
      getByText('State or Federal agency or court');
      getByText(
        'List each agency or court to which you are admitted. You will be able to add additional agencies or courts on the next screen.',
      );
      expect($('va-select[label="Agency/court"]', container)).to.exist;
      expect($('va-text-input[label="Name of agency/court"]', container)).to
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
      expect(arrayBuilderOptions.arrayPath).to.equal('agenciesOrCourts');
      expect(arrayBuilderOptions.nounSingular).to.equal(
        'state or Federal agency or court',
      );
      expect(arrayBuilderOptions.nounPlural).to.equal(
        'state or Federal agencies or courts',
      );
      expect(arrayBuilderOptions.required).to.be.false;
      expect(arrayBuilderOptions.text.reviewAddButtonText()).to.equal(
        'Add an agency or court',
      );
      expect(arrayBuilderOptions.text.yesNoBlankReviewQuestion()).to.equal(
        'Are you currently admitted to practice before any state or Federal agency or any Federal court?',
      );
    });

    it('should return the correct card title from getItemName', () => {
      const item = { agencyOrCourt: 'Tax Court' };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(item.agencyOrCourt)).to.exist;
    });

    it('when agencyOrCourt is Other, should return the correct card title from getItemName', () => {
      const item = {
        agencyOrCourt: 'Other',
        otherAgencyOrCourt: 'Other Agency Name',
      };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(item.otherAgencyOrCourt)).to.exist;
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

      it('should return true when agencyOrCourt is missing', () => {
        const item = {
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when agencyOrCourt is null', () => {
        const item = {
          agencyOrCourt: null,
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when agencyOrCourt is empty string', () => {
        const item = {
          agencyOrCourt: '',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when agencyOrCourt is "Other" but otherAgencyOrCourt is missing', () => {
        const item = {
          agencyOrCourt: 'Other',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when agencyOrCourt is "Other" but otherAgencyOrCourt is null', () => {
        const item = {
          agencyOrCourt: 'Other',
          otherAgencyOrCourt: null,
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when agencyOrCourt is "Other" but otherAgencyOrCourt is empty string', () => {
        const item = {
          agencyOrCourt: 'Other',
          otherAgencyOrCourt: '',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when admissionDate is missing', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when admissionDate is null', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: null,
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when admissionDate is empty string', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: '',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when membershipOrRegistrationNumber is missing', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: '1990-01-13',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when membershipOrRegistrationNumber is null', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: null,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when membershipOrRegistrationNumber is empty string', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: '',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return false when all required fields are present with regular agencyOrCourt', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return false when all required fields are present with "Other" agencyOrCourt and otherAgencyOrCourt', () => {
        const item = {
          agencyOrCourt: 'Other',
          otherAgencyOrCourt: 'Custom Agency Name',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return true when only agencyOrCourt is missing (all others present)', () => {
        const item = {
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only admissionDate is missing (all others present)', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only membershipOrRegistrationNumber is missing (all others present)', () => {
        const item = {
          agencyOrCourt: 'Tax Court',
          admissionDate: '1990-01-13',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when agencyOrCourt is "Other" but otherAgencyOrCourt is missing (all others present)', () => {
        const item = {
          agencyOrCourt: 'Other',
          admissionDate: '1990-01-13',
          membershipOrRegistrationNumber: 'TEST123',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });
    });
  });
});
