import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { NursingOfficialInformationPage } from '@bio-aquia/21-0779-nursing-home-information/pages/nursing-official-information/nursing-official-information';

describe('NursingOfficialInformationPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Mary',
          lastName: 'Johnson',
          jobTitle: 'Nursing Director',
          phoneNumber: '555-123-4567',
        },
      };
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with empty official data', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: '',
          lastName: '',
          jobTitle: '',
          phoneNumber: '',
        },
      };
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with partial official data', () => {
      const data = {
        nursingOfficialInformation: {
          firstName: 'Mary',
          lastName: 'Johnson',
          jobTitle: '',
          phoneNumber: '',
        },
      };
      const { container } = render(
        <NursingOfficialInformationPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
