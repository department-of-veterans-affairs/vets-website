import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { NursingHomeDetailsPage } from '@bio-aquia/21-0779-nursing-home-information/pages/nursing-home-details/nursing-home-details';

describe('NursingHomeDetailsPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunset Care Facility',
          nursingHomeAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
          },
        },
      };
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with empty nursing home data', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: '',
          nursingHomeAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
          },
        },
      };
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with partial address data', () => {
      const data = {
        nursingHomeDetails: {
          nursingHomeName: 'Sunset Care Facility',
          nursingHomeAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: '',
            postalCode: '',
          },
        },
      };
      const { container } = render(
        <NursingHomeDetailsPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
