import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ServiceType from '../../../../components/search-form/service-type';
import {
  benefitsServices,
  healthServices,
  emergencyCareServices,
  urgentCareServices,
} from '../../../../config';

describe('ServiceType', () => {
  // const expectOptions = (screen, number, nonPPMS = false) => {
  //   const options = screen.getAllByRole('option');

  //   expect(options.length).to.equal(number);
  //   expect(options.map(option => option.innerHTML)).to.deep.eq(
  //     Object.values(
  //       nonPPMS ? nonPPMSfacilityTypeOptions : facilityTypesOptions,
  //     ),
  //   );
  // };

  const setSize = size => {
    return {
      isMobile: size === 'mobile',
      isTablet: size === 'tablet',
      isSmallDesktop: size === 'desktop',
    };
  };

  describe('when using VAMC services autosuggest with progressive disclosure enabled', () => {
    it('should correctly render the autosuggest component', () => {
      const screen = render(
        <ServiceType
          currentQuery={{
            facilityType: 'health',
            serviceType: 'Primary care',
            serviceTypeChanged: false,
          }}
          {...setSize('tablet')}
          onChange={() => {}}
          searchInitiated={false}
          setSearchInitiated={() => {}}
          useProgressiveDisclosure
          vamcAutoSuggestEnabled
        />,
      );

      expect(screen.getByTestId('autosuggest-container')).to.exist;
    });
  });

  // describe('when not using progressive disclosure', () => {
  //   it('should correctly render the facility type dropdown', () => {
  //     const screen = render(
  //       <ServiceType
  //         currentQuery={{
  //           facilityType: 'urgent_care',
  //           facilityTypeChanged: false,
  //           isValid: true,
  //         }}
  //         handleServiceTypeChange={() => {}}
  //         {...setSize('tablet')}
  //         suppressPPMS={false}
  //         useProgressiveDisclosure={false}
  //       />,
  //     );

  //     const dropdown = screen.getByTestId('facility-type');
  //     expect(dropdown.classList.contains('facility-type-dropdown'));

  //     expectOptions(screen, 9);
  //   });

  //   it('should render an error when one exists', () => {
  //     const screen = render(
  //       <ServiceType
  //         currentQuery={{
  //           facilityType: null,
  //           facilityTypeChanged: true,
  //           isValid: false,
  //         }}
  //         handleServiceTypeChange={() => {}}
  //         {...setSize('tablet')}
  //         suppressPPMS={false}
  //         useProgressiveDisclosure={false}
  //       />,
  //     );

  //     const dropdown = screen.getByTestId('facility-type');
  //     expect(dropdown.classList.contains('facility-error'));

  //     expectOptions(screen, 9);
  //   });

  //   it('should remove the pharmacy option when the PPMS service is down', () => {
  //     const screen = render(
  //       <ServiceType
  //         currentQuery={{
  //           facilityType: 'urgent_care',
  //           facilityTypeChanged: false,
  //           isValid: true,
  //         }}
  //         handleServiceTypeChange={() => {}}
  //         {...setSize('tablet')}
  //         suppressPPMS
  //         useProgressiveDisclosure={false}
  //       />,
  //     );

  //     expectOptions(screen, 5, true);
  //   });
  // });

  // describe('when using progressive disclosure', () => {
  //   it('should correctly render the facility type dropdown for tablet', () => {
  //     const screen = render(
  //       <ServiceType
  //         currentQuery={{
  //           facilityType: 'urgent_care',
  //           facilityTypeChanged: false,
  //           isValid: true,
  //         }}
  //         handleServiceTypeChange={() => {}}
  //         {...setSize('tablet')}
  //         suppressPPMS={false}
  //         useProgressiveDisclosure
  //       />,
  //     );

  //     const dropdown = screen.getByTestId('facility-type');
  //     expect(dropdown.classList.contains('facility-type-dropdown-tablet'));

  //     expectOptions(screen, 9);
  //   });

  //   it('should correctly render the facility type dropdown for mobile', () => {
  //     const screen = render(
  //       <ServiceType
  //         currentQuery={{
  //           facilityType: 'urgent_care',
  //           facilityTypeChanged: false,
  //           isValid: true,
  //         }}
  //         handleServiceTypeChange={() => {}}
  //         {...setSize('mobile')}
  //         suppressPPMS={false}
  //         useProgressiveDisclosure
  //       />,
  //     );

  //     const dropdown = screen.getByTestId('facility-type');
  //     expect(dropdown.classList.contains('facility-type-dropdown-mobile'));

  //     expectOptions(screen, 9);
  //   });

  //   it('should correctly render the facility type dropdown for desktop', () => {
  //     const screen = render(
  //       <ServiceType
  //         currentQuery={{
  //           facilityType: 'urgent_care',
  //           facilityTypeChanged: false,
  //           isValid: true,
  //         }}
  //         handleServiceTypeChange={() => {}}
  //         {...setSize('desktop')}
  //         suppressPPMS={false}
  //         useProgressiveDisclosure
  //       />,
  //     );

  //     const dropdown = screen.getByTestId('facility-type');
  //     expect(dropdown.classList.contains('facility-type-dropdown-desktop'));

  //     expectOptions(screen, 9);
  //   });
  // });
});
