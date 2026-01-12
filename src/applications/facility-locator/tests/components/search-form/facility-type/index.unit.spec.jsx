import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FacilityType from '../../../../components/search-form/facility-type';
import {
  facilityTypesOptions,
  nonPPMSfacilityTypeOptions,
} from '../../../../config';

describe('FacilityType', () => {
  const expectOptions = (screen, number, nonPPMS = false) => {
    const options = screen.getAllByRole('option');

    expect(options.length).to.equal(number);
    expect(options.map(option => option.innerHTML)).to.deep.eq(
      Object.values(
        nonPPMS ? nonPPMSfacilityTypeOptions : facilityTypesOptions,
      ),
    );
  };

  const expectHintAttribute = screen => {
    const vaSelect = screen.container.querySelector('va-select');
    expect(vaSelect.getAttribute('hint')).to.equal('Choose a facility type');
  };

  const setSize = size => {
    return {
      isMobile: size === 'mobile',
      isTablet: size === 'tablet',
      isSmallDesktop: size === 'desktop',
    };
  };

  describe('when not using progressive disclosure', () => {
    it('should correctly render the facility type dropdown', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: 'urgent_care',
            facilityTypeChanged: false,
            isValid: true,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('tablet')}
          suppressPPMS={false}
          useProgressiveDisclosure={false}
        />,
      );

      const dropdown = screen.getByTestId('facility-type');
      expect(dropdown.classList.contains('facility-type-dropdown')).to.be.true;

      expectOptions(screen, 8);
      expectHintAttribute(screen);
    });

    it('should render an error when one exists', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: null,
            facilityTypeChanged: true,
            isValid: false,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('tablet')}
          suppressPPMS={false}
          useProgressiveDisclosure={false}
        />,
      );

      const dropdown = screen.getByTestId('facility-type');
      expect(dropdown.classList.contains('facility-error')).to.be.true;

      expectOptions(screen, 8);
      expectHintAttribute(screen);
    });

    it('should remove the pharmacy option when the PPMS service is down', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: 'urgent_care',
            facilityTypeChanged: false,
            isValid: true,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('tablet')}
          suppressPPMS
          useProgressiveDisclosure={false}
        />,
      );

      expectOptions(screen, 4, true);
      expectHintAttribute(screen);
    });

    it('displays hint attribute to guide users', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: null,
            facilityTypeChanged: false,
            isValid: true,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('tablet')}
          suppressPPMS={false}
          useProgressiveDisclosure={false}
        />,
      );

      expectHintAttribute(screen);
    });
  });

  describe('when using progressive disclosure', () => {
    it('should correctly render the facility type dropdown for tablet', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: 'urgent_care',
            facilityTypeChanged: false,
            isValid: true,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('tablet')}
          suppressPPMS={false}
          useProgressiveDisclosure
        />,
      );

      const dropdown = screen.getByTestId('facility-type');
      expect(dropdown.classList.contains('facility-type-dropdown-tablet')).to.be
        .true;

      expectOptions(screen, 8);
      expectHintAttribute(screen);
    });

    it('should correctly render the facility type dropdown for mobile', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: 'urgent_care',
            facilityTypeChanged: false,
            isValid: true,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('mobile')}
          suppressPPMS={false}
          useProgressiveDisclosure
        />,
      );

      const dropdown = screen.getByTestId('facility-type');
      expect(dropdown.classList.contains('facility-type-dropdown-mobile')).to.be
        .true;

      expectOptions(screen, 8);
      expectHintAttribute(screen);
    });

    it('should correctly render the facility type dropdown for desktop', () => {
      const screen = render(
        <FacilityType
          currentQuery={{
            facilityType: 'urgent_care',
            facilityTypeChanged: false,
            isValid: true,
          }}
          handleFacilityTypeChange={() => {}}
          {...setSize('desktop')}
          suppressPPMS={false}
          useProgressiveDisclosure
        />,
      );

      const dropdown = screen.getByTestId('facility-type');
      expect(dropdown.classList.contains('facility-type-dropdown-desktop')).to
        .be.true;

      expectOptions(screen, 8);
      expectHintAttribute(screen);
    });
  });
});
