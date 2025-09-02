import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import {
  DeleteToxicExposureModalContent,
  deletedToxicExposureAlertConfirmationContent,
  getRemovingConditions,
  hasValidData,
} from '../../content/toxicExposureChoiceContent';

describe('Toxic Exposure Choice Content', () => {
  describe('Helper functions', () => {
    describe('hasValidData', () => {
      it('should return false for null/undefined values', () => {
        expect(hasValidData(null)).to.be.false;
        expect(hasValidData(undefined)).to.be.false;
        expect(hasValidData('')).to.be.false;
      });

      it('should validate boolean values', () => {
        expect(hasValidData(true)).to.be.true;
        expect(hasValidData(false)).to.be.false;
      });

      it('should validate string values', () => {
        expect(hasValidData('test')).to.be.true;
        expect(hasValidData('  ')).to.be.false;
        expect(hasValidData('  text  ')).to.be.true;
      });

      it('should validate array values', () => {
        expect(hasValidData([])).to.be.false;
        expect(hasValidData(['item'])).to.be.true;
      });

      it('should validate object values', () => {
        expect(hasValidData({})).to.be.false;
        expect(hasValidData({ key: false })).to.be.false;
        expect(hasValidData({ key: true })).to.be.true;
        expect(hasValidData({ key: 'value' })).to.be.true;
        expect(hasValidData({ key: '  ' })).to.be.false;
      });
    });

    describe('getRemovingConditions', () => {
      it('should return all conditions when none is selected', () => {
        const conditions = { none: true };
        const newDisabilities = [
          { condition: 'Asthma' },
          { condition: 'Bronchitis' },
        ];

        const result = getRemovingConditions(conditions, newDisabilities);
        expect(result).to.deep.equal(['Asthma', 'Bronchitis']);
      });

      it('should return all conditions when nothing is selected', () => {
        const conditions = {};
        const newDisabilities = [
          { condition: 'Asthma' },
          { condition: 'Bronchitis' },
        ];

        const result = getRemovingConditions(conditions, newDisabilities);
        expect(result).to.deep.equal(['Asthma', 'Bronchitis']);
      });

      it('should return only unchecked conditions', () => {
        const conditions = {
          asthma: true,
          bronchitis: false,
        };
        const newDisabilities = [
          { condition: 'Asthma' },
          { condition: 'Bronchitis' },
        ];

        const result = getRemovingConditions(conditions, newDisabilities);
        expect(result).to.deep.equal(['Bronchitis']);
      });

      it('should handle conditions with special characters', () => {
        const conditions = {
          tinnitusringingorhissinginears: false,
        };
        const newDisabilities = [
          { condition: 'Tinnitus (ringing or hissing in ears)' },
        ];

        const result = getRemovingConditions(conditions, newDisabilities);
        expect(result).to.deep.equal(['Tinnitus (ringing or hissing in ears)']);
      });

      it('should filter out disabilities without conditions', () => {
        const conditions = {};
        const newDisabilities = [
          { condition: 'Asthma' },
          { condition: null },
          { condition: undefined },
          {},
        ];

        const result = getRemovingConditions(conditions, newDisabilities);
        expect(result).to.deep.equal(['Asthma']);
      });

      it('should return empty array when all conditions are selected', () => {
        const conditions = {
          asthma: true,
          bronchitis: true,
        };
        const newDisabilities = [
          { condition: 'Asthma' },
          { condition: 'Bronchitis' },
        ];

        const result = getRemovingConditions(conditions, newDisabilities);
        expect(result).to.deep.equal([]);
      });
    });
  });

  describe('Modal content', () => {
    it('should render dynamic modal content with single condition', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            flatfeet: false,
            bronchitis: true, // This one is selected, so won't be removed
          },
        },
        newDisabilities: [
          { condition: 'flat feet' },
          { condition: 'Bronchitis' },
        ],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      // Check title for single condition
      expect(container.textContent).to.contain(
        'Remove condition related to toxic exposure?',
      );

      // Check description mentions the specific condition
      expect(container.textContent).to.contain(
        'If you choose to remove flat feet as a condition related to toxic exposure',
      );

      // Check that toxic exposure info is listed
      expect(container.textContent).to.contain(
        'Gulf War service locations and dates (1990 and 2001)',
      );
      expect(container.textContent).to.contain(
        'Agent Orange exposure locations and dates',
      );
      expect(container.textContent).to.contain(
        'Other toxic exposure details and dates',
      );

      // Verify it's a list structure
      expect(container.querySelector('ul')).to.exist;
      expect(container.querySelectorAll('li')).to.have.length(3);
    });

    it('should render dynamic modal content with multiple conditions', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            flatfeet: false,
            asthma: false,
          },
        },
        newDisabilities: [{ condition: 'flat feet' }, { condition: 'asthma' }],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      // Check title for multiple conditions
      expect(container.textContent).to.contain(
        'Remove conditions related to toxic exposure?',
      );

      // Check description mentions the specific conditions
      expect(container.textContent).to.contain(
        'If you choose to remove flat feet and asthma as conditions related to toxic exposure',
      );

      // Check that toxic exposure info is listed
      expect(container.textContent).to.contain(
        'Gulf War service locations and dates (1990 and 2001)',
      );

      // Verify it's a list structure with toxic exposure info
      expect(container.querySelector('ul')).to.exist;
      expect(container.querySelectorAll('li')).to.have.length(3);
    });

    it('should render modal with no conditions when all are selected', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            asthma: true,
            bronchitis: true,
          },
        },
        newDisabilities: [{ condition: 'Asthma' }, { condition: 'Bronchitis' }],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      // Should show generic title when no conditions being removed
      expect(container.textContent).to.contain(
        'Remove condition related to toxic exposure?',
      );

      // Should show generic description
      expect(container.textContent).to.contain(
        "If you choose to remove conditions related to toxic exposure, we'll delete information about:",
      );
    });

    it('should handle conditions with special characters correctly', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            tinnitusringingorhissinginears: false,
          },
        },
        newDisabilities: [
          { condition: 'Tinnitus (ringing or hissing in ears)' },
        ],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      expect(container.textContent).to.contain(
        'Tinnitus (ringing or hissing in ears)',
      );
    });

    it('should handle "none" selection removing all conditions', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            none: true,
          },
        },
        newDisabilities: [
          { condition: 'Condition 1' },
          { condition: 'Condition 2' },
        ],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      // Should show plural title
      expect(container.textContent).to.contain(
        'Remove conditions related to toxic exposure?',
      );

      // Should list both conditions
      expect(container.textContent).to.contain('Condition 1 and Condition 2');
    });

    it('should handle empty newDisabilities array', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            none: true,
          },
        },
        newDisabilities: [],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      // Should show generic description when no disabilities
      expect(container.textContent).to.contain(
        'If you choose to remove conditions related to toxic exposure',
      );
    });

    it('should handle missing formData gracefully', () => {
      const { container } = render(
        <DeleteToxicExposureModalContent formData={null} />,
      );

      expect(container.textContent).to.contain(
        'Remove condition related to toxic exposure?',
      );
    });

    it('should handle mixed selection of conditions', () => {
      const mockFormData = {
        toxicExposure: {
          conditions: {
            asthma: true,
            bronchitis: false,
            cancer: false,
            diabetes: true,
          },
        },
        newDisabilities: [
          { condition: 'Asthma' },
          { condition: 'Bronchitis' },
          { condition: 'Cancer' },
          { condition: 'Diabetes' },
        ],
      };

      const { container } = render(
        <DeleteToxicExposureModalContent formData={mockFormData} />,
      );

      // Should show plural title for 2 conditions
      expect(container.textContent).to.contain(
        'Remove conditions related to toxic exposure?',
      );

      // Should mention the 2 unselected conditions
      expect(container.textContent).to.contain('Bronchitis and Cancer');

      // Should not mention selected conditions
      expect(container.textContent).not.to.contain('Asthma');
      expect(container.textContent).not.to.contain('Diabetes');
    });
  });

  describe('Alert confirmation content', () => {
    it('should render confirmation alert with correct content', () => {
      const { container } = render(
        deletedToxicExposureAlertConfirmationContent,
      );

      // Get text content from each paragraph separately
      const paragraphs = container.querySelectorAll('p');

      // Use a simpler text matching approach
      const text1 = paragraphs[0].textContent.trim();
      const text2 = paragraphs[1].textContent.trim();

      expect(text1).to.include(
        'removed toxic exposure conditions from your claim',
      );
      expect(text2).to.include(
        'Review your conditions and supporting documents to remove any information',
      );

      // Check styling
      expect(paragraphs).to.have.length(2);
      expect(paragraphs[0]).to.have.class('vads-u-margin-y--0');
      expect(paragraphs[1]).to.have.class('vads-u-margin-y--0');
    });
  });
});
