import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import ServiceType from '../../../../components/search-form/service-type';
import {
  healthServices,
  emergencyCareServices,
  urgentCareServices,
} from '../../../../config';

describe('ServiceType', () => {
  const expectOptions = (screen, number, dropdownOptions) => {
    const options = screen.getAllByRole('option');

    expect(options.length).to.equal(number);
    expect(options.map(option => option.innerHTML)).to.deep.eq(
      Object.values(dropdownOptions),
    );
  };

  const mockStore = {
    getState: () => ({
      searchQuery: {
        vamcServiceDisplay: '',
      },
      drupalStaticData: {
        vaHealthServicesData: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const props = (facilityType, size) => {
    return {
      currentQuery: {
        facilityType,
        serviceType: '',
        serviceTypeChanged: false,
      },
      isMobile: size === 'mobile',
      isTablet: size === 'tablet',
      isSmallDesktop: size === 'desktop',
      getProviderSpecialties: () => {},
      handleServiceTypeChange: () => {},
      onChange: () => {},
      setSearchInitiated: () => {},
      searchInitiated: false,
    };
  };

  describe('when using VA health services autosuggest with progressive disclosure enabled', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('health', 'tablet')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expect(screen.getByTestId('autosuggest-container')).to.exist;
    });
  });

  describe('when using VA health services without autosuggest, with progressive disclosure enabled', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('health', 'desktop')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled={false}
          />
        </Provider>,
      );

      expectOptions(screen, 19, healthServices);
      const dropdown = screen.getByTestId('service-type');
      expect(dropdown.classList.contains('service-type-dropdown-desktop')).to.be
        .true;
    });
  });

  describe('when using a facility type (urgent care) with service type options', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('urgent_care', 'tablet')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expectOptions(screen, 3, urgentCareServices);
    });
  });

  describe('when using a facility type (emergency care) with service type options', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('emergency_care', 'tablet')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expectOptions(screen, 3, emergencyCareServices);
    });
  });

  describe('when using a facility type (emergency care) with service type options, small desktop view', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('emergency_care', 'desktop')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expectOptions(screen, 3, emergencyCareServices);
      const dropdown = screen.getByTestId('service-type');
      expect(dropdown.classList.contains('service-type-dropdown-desktop')).to.be
        .true;
    });
  });

  describe('when using a facility type (CC providers) with service type options and WITH progressive disclosure, tablet view', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('provider', 'tablet')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      const typeahead = screen.getByTestId('cc-service-typeahead-pd');

      expect(typeahead).to.exist;
      expect(typeahead.classList.contains('typeahead-tablet')).to.be.true;
    });
  });

  describe('when using a facility type (CC providers) with service type options and WITH progressive disclosure, mobile view', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('provider', 'mobile')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      const typeahead = screen.getByTestId('cc-service-typeahead-pd');

      expect(typeahead).to.exist;
      expect(typeahead.classList.contains('typeahead-mobile')).to.be.true;
    });
  });

  describe('when using a facility type (CC providers) with service type options and WITHOUT progressive disclosure', () => {
    it('should render the correct service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('provider', 'tablet')}
            useProgressiveDisclosure={false}
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expect(screen.getByTestId('cc-service-typeahead')).to.exist;
    });
  });

  describe('when using a facility type (community pharmacy) without a service type requirement', () => {
    it('should render nothing', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('pharmacy', 'tablet')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expect(container.innerHTML).to.be.empty;
    });
  });

  describe('when using a facility type (VA benefits) without a service type requirement and WITH progressive disclosure', () => {
    it('should render nothing', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('benefits', 'tablet')}
            useProgressiveDisclosure
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      expect(container.innerHTML).to.be.empty;
    });
  });

  describe('when using a facility type (VA benefits) without a service type requirement and WITHOUT progressive disclosure, mobile view', () => {
    it('should render a disabled service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('benefits', 'mobile')}
            useProgressiveDisclosure={false}
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      const disabledDropdown = screen.getByTestId(
        'disabled-service-type-dropdown',
      );

      expect(disabledDropdown).to.exist;
      expect(
        disabledDropdown.classList.contains('service-type-dropdown-mobile'),
      ).to.be.true;
    });
  });

  describe('when using a facility type (VA cemeteries) without a service type requirement and WITHOUT progressive disclosure, tablet view', () => {
    it('should render a disabled service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('cemetery', 'tablet')}
            useProgressiveDisclosure={false}
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      const disabledDropdown = screen.getByTestId(
        'disabled-service-type-dropdown',
      );

      expect(disabledDropdown).to.exist;
      expect(
        disabledDropdown.classList.contains('service-type-dropdown-tablet'),
      ).to.be.true;
    });
  });

  describe('when using a facility type (Vet Center) without a service type requirement and WITHOUT progressive disclosure, small desktop view', () => {
    it('should render a disabled service type dropdown', () => {
      const screen = render(
        <Provider store={mockStore}>
          <ServiceType
            {...props('vet_center', 'desktop')}
            useProgressiveDisclosure={false}
            vamcAutoSuggestEnabled
          />
        </Provider>,
      );

      const disabledDropdown = screen.getByTestId(
        'disabled-service-type-dropdown',
      );

      expect(disabledDropdown).to.exist;
      expect(
        disabledDropdown.classList.contains('service-type-dropdown-tablet'),
      ).to.be.true;
    });
  });
});
