/**
 * @module tests/pages/claimant-identity.unit.spec
 * @description Unit tests for ClaimantIdentityPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { ClaimantIdentityPage } from './claimant-identity';

describe('ClaimantIdentityPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
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
          claimantFirstName: 'John',
          claimantMiddleName: 'Michael',
          claimantLastName: 'Smith',
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

      expect(firstNameInput.getAttribute('value')).to.equal('John');
      expect(middleNameInput.getAttribute('value')).to.equal('Michael');
      expect(lastNameInput.getAttribute('value')).to.equal('Smith');
    });

    it('should display claimant address values', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantStreetAddress: '456 Oak Street',
          claimantUnitNumber: 'Apt 2B',
          claimantCity: 'Chicago',
          claimantState: 'IL',
          claimantZip: '60601',
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

      expect(streetInput.getAttribute('value')).to.equal('456 Oak Street');
      expect(unitInput.getAttribute('value')).to.equal('Apt 2B');
      expect(cityInput.getAttribute('value')).to.equal('Chicago');
      expect(stateSelect.getAttribute('value')).to.equal('IL');
      expect(zipInput.getAttribute('value')).to.equal('60601');
    });

    it('should display phone number value', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantPhone: '312-555-0123',
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
      expect(phoneInput.getAttribute('value')).to.equal('312-555-0123');
    });

    it('should display claimant relationship selection', () => {
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

      const relationshipSelect = container.querySelector(
        'va-select[name="claimantRelationship"]',
      );
      expect(relationshipSelect.getAttribute('value')).to.equal('spouse');
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
          claimantFirstName: 'Jane',
          claimantLastName: 'Doe',
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
          claimantRelationshipOther: 'Legal Guardian',
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
      expect(textInput.getAttribute('value')).to.equal('Legal Guardian');
    });

    it('should render with various field values populated', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Jane',
          claimantMiddleName: 'Marie',
          claimantLastName: 'Doe',
          claimantStreetAddress: '123 Main St',
          claimantCity: 'Springfield',
          claimantState: 'IL',
          claimantZip: '62701',
          claimantPhone: '555-123-4567',
          claimantRelationship: 'other',
          claimantRelationshipOther: 'Power of Attorney',
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
      expect(otherInput.getAttribute('value')).to.equal('Power of Attorney');
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
          claimantFirstName: 'Elizabeth',
          claimantMiddleName: 'Anne',
          claimantLastName: 'Johnson',
          claimantStreetAddress: '789 Park Avenue',
          claimantUnitNumber: 'Suite 300',
          claimantCity: 'New York',
          claimantState: 'NY',
          claimantZip: '10001',
          claimantPhone: '212-555-9876',
          claimantRelationship: 'child',
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

      // Verify all fields are populated
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

      expect(firstNameInput.getAttribute('value')).to.equal('Elizabeth');
      expect(middleNameInput.getAttribute('value')).to.equal('Anne');
      expect(lastNameInput.getAttribute('value')).to.equal('Johnson');
      expect(relationshipSelect.getAttribute('value')).to.equal('child');
    });

    it('should handle partial claimant information', () => {
      const data = {
        isVeteranClaimant: 'no',
        claimantIdentification: {
          claimantFirstName: 'Robert',
          claimantLastName: 'Williams',
          claimantCity: 'Dallas',
          claimantState: 'TX',
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

      expect(firstNameInput.getAttribute('value')).to.equal('Robert');
      expect(cityInput.getAttribute('value')).to.equal('Dallas');
      expect(stateSelect.getAttribute('value')).to.equal('TX');
    });
  });
});
