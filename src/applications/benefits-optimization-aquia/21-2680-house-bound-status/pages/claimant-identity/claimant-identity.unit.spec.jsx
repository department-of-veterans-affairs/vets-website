/**
 * @module tests/pages/claimant-identity.unit.spec
 * @description Unit tests for ClaimantIdentityPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { ClaimantIdentityPage } from './claimant-identity';

describe('Claimant Information Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should render without errors when not veteran claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title when not veteran claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Claimant information');
    });

    it('should render instruction text', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Enter your information as the person filing on behalf of the Veteran',
      );
    });

    it('should skip page if veteran is claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'yes' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should render name fields when not veteran claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[name="fullName.first"]',
      );
      const middleNameInput = container.querySelector(
        'va-text-input[name="fullName.middle"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[name="fullName.last"]',
      );

      expect(firstNameInput).to.exist;
      expect(middleNameInput).to.exist;
      expect(lastNameInput).to.exist;
      expect(firstNameInput.hasAttribute('required')).to.be.true;
      expect(lastNameInput.hasAttribute('required')).to.be.true;
    });

    it('should render address fields when not veteran claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[name="claimantAddress.street"]',
      );
      const unitInput = container.querySelector(
        'va-text-input[name="claimantAddress.street2"]',
      );
      const cityInput = container.querySelector(
        'va-text-input[name="claimantAddress.city"]',
      );
      const stateSelect = container.querySelector(
        'va-select[name="claimantAddress.state"]',
      );
      const zipInput = container.querySelector(
        'va-text-input[name="claimantAddress.postalCode"]',
      );

      expect(streetInput).to.exist;
      expect(unitInput).to.exist;
      expect(cityInput).to.exist;
      expect(stateSelect).to.exist;
      expect(zipInput).to.exist;
    });

    it('should render phone field when not veteran claimant', async () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const phoneInput = container.querySelector('va-telephone-input');
        expect(phoneInput).to.exist;
        expect(phoneInput.getAttribute('label')).to.include('Phone number');
        expect(phoneInput.hasAttribute('required')).to.be.true;
      });
    });

    it('should render relationship select field when not veteran claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const relationshipSelect = container.querySelector(
        'va-select[name="claimantRelationship"]',
      );
      expect(relationshipSelect).to.exist;
      expect(relationshipSelect.getAttribute('label')).to.include(
        'Relationship to Veteran',
      );
      expect(relationshipSelect.hasAttribute('required')).to.be.true;
    });

    it('should render continue and back buttons', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      const backButton = container.querySelector('va-button[text="Back"]');
      expect(continueButton).to.exist;
      expect(backButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display claimant name values', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Ahsoka',
          claimantMiddleName: '',
          claimantLastName: 'Tano',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[name="fullName.first"]',
      );
      const middleNameInput = container.querySelector(
        'va-text-input[name="fullName.middle"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[name="fullName.last"]',
      );

      expect(firstNameInput.getAttribute('value')).to.equal('Ahsoka');
      expect(middleNameInput.getAttribute('value')).to.equal('');
      expect(lastNameInput.getAttribute('value')).to.equal('Tano');
    });

    it('should display claimant address values', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantStreetAddress: '77 Fulcrum Station',
          claimantUnitNumber: 'Level 5',
          claimantCity: 'Coruscant',
          claimantState: 'CA',
          claimantZip: '94105',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[name="claimantAddress.street"]',
      );
      const unitInput = container.querySelector(
        'va-text-input[name="claimantAddress.street2"]',
      );
      const cityInput = container.querySelector(
        'va-text-input[name="claimantAddress.city"]',
      );
      const stateSelect = container.querySelector(
        'va-select[name="claimantAddress.state"]',
      );
      const zipInput = container.querySelector(
        'va-text-input[name="claimantAddress.postalCode"]',
      );

      expect(streetInput.getAttribute('value')).to.equal('77 Fulcrum Station');
      expect(unitInput.getAttribute('value')).to.equal('Level 5');
      expect(cityInput.getAttribute('value')).to.equal('Coruscant');
      expect(stateSelect.getAttribute('value')).to.equal('CA');
      expect(zipInput.getAttribute('value')).to.equal('94105');
    });

    it('should display phone number value', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantPhone: '415-555-7567',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const phoneInput = container.querySelector('va-telephone-input');
      expect(phoneInput.getAttribute('value')).to.equal('415-555-7567');
    });

    it('should display claimant relationship selection', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantRelationship: 'other',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const relationshipSelect = container.querySelector(
        'va-select[name="claimantRelationship"]',
      );
      expect(relationshipSelect.getAttribute('value')).to.equal('other');
    });

    it('should handle various relationship values', () => {
      const relationships = ['spouse', 'child', 'parent', 'fiduciary', 'other'];

      relationships.forEach(relationship => {
        const data = {
          isVeteranClaimant: 'no',
          claimantIdentification: {
            claimantRelationship: relationship,
          },
        };

        const { container } = render(
          <ClaimantIdentityPage
            data={data}
            setFormData={mockSetFormData}
            goForward={mockGoForward}
            goBack={mockGoBack}
          />,
        );

        const relationshipSelect = container.querySelector(
          'va-select[name="claimantRelationship"]',
        );
        expect(relationshipSelect.getAttribute('value')).to.equal(relationship);
      });
    });

    it('should handle empty data when not veteran claimant', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={{ isVeteranClaimant: 'no' }}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should handle function data prop', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={() => {}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should handle string data prop', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data="invalid"
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should handle number data prop', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={123}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });

    it('should handle array with isVeteranClaimant no', () => {
      const { container } = render(
        <ClaimantIdentityPage
          data={['isVeteranClaimant']}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.equal('');
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Ahsoka',
          claimantLastName: 'Tano',
          claimantRelationship: 'other',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should show page in review mode even if veteran is claimant', () => {
      const data = {
        isVeteranClaimant: 'yes',
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should show save button instead of continue in review mode', () => {
      const data = {
        isVeteranClaimant: 'no',
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = container.querySelector('va-button[text="Save"]');
      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });

  describe('Conditional Fields', () => {
    it('should show relationship other field when relationship is other', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantRelationship: 'other',
          claimantRelationshipOther: '',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="claimantRelationshipOther"]',
      );
      expect(textInput).to.exist;
      expect(textInput.hasAttribute('required')).to.be.true;
    });

    it('should not show relationship other field when relationship is not other', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantRelationship: 'spouse',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="claimantRelationshipOther"]',
      );
      expect(textInput).to.not.exist;
    });

    it('should not show relationship other field when relationship is empty', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantRelationship: '',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="claimantRelationshipOther"]',
      );
      expect(textInput).to.not.exist;
    });

    it('should display relationship other description value', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantRelationship: 'other',
          claimantRelationshipOther: 'Former Padawan',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textInput = container.querySelector(
        'va-text-input[name="claimantRelationshipOther"]',
      );
      expect(textInput.getAttribute('value')).to.equal('Former Padawan');
    });

    it('should render with various field values populated', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Ahsoka',
          claimantMiddleName: '',
          claimantLastName: 'Tano',
          claimantStreetAddress: '77 Fulcrum Station',
          claimantCity: 'Coruscant',
          claimantState: 'CA',
          claimantZip: '94105',
          claimantPhone: '415-555-7567',
          claimantRelationship: 'other',
          claimantRelationshipOther: 'Former Padawan',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      const otherInput = container.querySelector(
        'va-text-input[name="claimantRelationshipOther"]',
      );
      expect(otherInput).to.exist;
      expect(otherInput.getAttribute('value')).to.equal('Former Padawan');
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <ClaimantIdentityPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Test',
          claimantLastName: 'User',
          claimantRelationship: 'spouse',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Complete Claimant Information', () => {
    it('should handle complete claimant information with all fields', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Padmé',
          claimantMiddleName: 'Naberrie',
          claimantLastName: 'Amidala',
          claimantStreetAddress: '500 Royal Palace',
          claimantUnitNumber: 'Throne Room',
          claimantCity: 'Theed',
          claimantState: 'CA',
          claimantZip: '94102',
          claimantPhone: '415-555-9876',
          claimantRelationship: 'spouse',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[name="fullName.first"]',
      );
      const middleNameInput = container.querySelector(
        'va-text-input[name="fullName.middle"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[name="fullName.last"]',
      );
      const relationshipSelect = container.querySelector(
        'va-select[name="claimantRelationship"]',
      );

      expect(firstNameInput.getAttribute('value')).to.equal('Padmé');
      expect(middleNameInput.getAttribute('value')).to.equal('Naberrie');
      expect(lastNameInput.getAttribute('value')).to.equal('Amidala');
      expect(relationshipSelect.getAttribute('value')).to.equal('spouse');
    });

    it('should handle partial claimant information', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Bail',
          claimantLastName: 'Organa',
          claimantCity: 'Alderaan',
          claimantState: 'CA',
          claimantRelationship: 'fiduciary',
        },
      };

      const { container } = render(
        <ClaimantIdentityPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[name="fullName.first"]',
      );
      const cityInput = container.querySelector(
        'va-text-input[name="claimantAddress.city"]',
      );
      const stateSelect = container.querySelector(
        'va-select[name="claimantAddress.state"]',
      );

      expect(firstNameInput.getAttribute('value')).to.equal('Bail');
      expect(cityInput.getAttribute('value')).to.equal('Alderaan');
      expect(stateSelect.getAttribute('value')).to.equal('CA');
    });
  });
});
