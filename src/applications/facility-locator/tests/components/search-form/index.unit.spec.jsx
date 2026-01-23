import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { SearchForm } from '../../../components/search-form';
import { benefitsServices } from '../../../config';
import { LocationType } from '../../../constants';

describe('SearchForm', () => {
  const getDefaultProps = () => ({
    currentQuery: {
      facilityType: null,
      serviceType: null,
      searchString: '',
      zoomLevel: 4,
      geocodeError: 0,
    },
    onChange: sinon.spy(),
    onSubmit: sinon.spy(),
    setSearchInitiated: sinon.spy(),
    searchInitiated: false,
    isMobile: false,
    isSmallDesktop: false,
    isTablet: false,
    useProgressiveDisclosure: false,
    vamcAutoSuggestEnabled: false,
  });

  describe('Facility type rendering', () => {
    it('should render search controls with Choose a facility type by default', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: null,
        },
      };
      const { container } = render(<SearchForm {...props} />);
      expect(container.querySelector('.facility-type-dropdown-val-none')).to
        .exist;
    });

    it('should render search controls with VA benefits facility selected', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: 'benefits',
        },
      };
      const { container } = render(<SearchForm {...props} />);
      expect(container.querySelector('.facility-type-dropdown-val-benefits')).to
        .exist;
    });

    it('should render search controls with VA benefits services options', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: 'benefits',
        },
      };
      const { container } = render(<SearchForm {...props} />);
      const serviceDropdown = container.querySelector('#service-type-dropdown');
      const options = serviceDropdown.querySelectorAll('option');
      const benefits = Object.values(benefitsServices);
      options.forEach((option, idx) => {
        expect(option.textContent).to.equal(benefits[idx]);
      });
    });
  });

  describe('Geocode error modal', () => {
    it('shows modal error message if geocodeError is 1 (permission denied)', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          geocodeError: 1,
        },
      };
      const { container } = render(<SearchForm {...props} />);
      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('visible')).to.equal('true');
      expect(modal.getAttribute('modal-title')).to.equal(
        `Your device's location sharing is off.`,
      );
      expect(modal.querySelector('p').textContent).to.equal(
        'To use your location when searching for a VA facility, go to the settings on your device and update sharing permissions.',
      );
    });

    it('shows modal error message if geocodeError is > 1', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          geocodeError: 2,
        },
      };
      const { container } = render(<SearchForm {...props} />);
      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('visible')).to.equal('true');
      expect(modal.getAttribute('modal-title')).to.equal(
        "We couldn't locate you",
      );
      expect(modal.querySelector('p').textContent).to.equal(
        'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.',
      );
    });

    it('does not show modal error message if geocodeError is 0', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          geocodeError: 0,
        },
      };
      const { container } = render(<SearchForm {...props} />);
      const modal = container.querySelector('va-modal');
      expect(modal.getAttribute('visible')).to.equal('false');
    });
  });

  describe('Draft state behavior', () => {
    it('should NOT call onChange when only facility type changes without submit', async () => {
      const onChange = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
      };

      const { container } = render(<SearchForm {...props} />);

      const facilityDropdown = container.querySelector(
        '#facility-type-dropdown',
      );
      facilityDropdown.value = LocationType.HEALTH;
      facilityDropdown.dispatchEvent(
        new CustomEvent('vaSelect', {
          detail: { value: LocationType.HEALTH },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        expect(onChange.called).to.be.false;
      });
    });

    it('should NOT call onChange when service type changes without submit', async () => {
      const onChange = sinon.spy();
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: LocationType.BENEFITS,
          searchString: 'Austin TX',
        },
        onChange,
      };

      const { container } = render(<SearchForm {...props} />);

      const serviceDropdown = container.querySelector('#service-type-dropdown');
      if (serviceDropdown) {
        serviceDropdown.value = 'ApplyingForBenefits';
        serviceDropdown.dispatchEvent(
          new CustomEvent('vaSelect', {
            detail: { value: 'ApplyingForBenefits' },
            bubbles: true,
          }),
        );
      }

      await waitFor(() => {
        expect(onChange.called).to.be.false;
      });
    });

    it('should call onChange on valid form submit', async () => {
      const onChange = sinon.spy();
      const onSubmit = sinon.spy();
      const setSearchInitiated = sinon.spy();
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: LocationType.HEALTH,
          serviceType: 'PrimaryCare',
          searchString: 'Austin TX',
        },
        onChange,
        onSubmit,
        setSearchInitiated,
      };

      const { container } = render(<SearchForm {...props} />);

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onChange.calledOnce).to.be.true;
        expect(onChange.firstCall.args[0]).to.deep.include({
          facilityType: LocationType.HEALTH,
          serviceType: 'PrimaryCare',
          searchString: 'Austin TX',
        });
        expect(onSubmit.calledOnce).to.be.true;
      });
    });

    it('should prevent duplicate search when submitting same values twice', async () => {
      const onChange = sinon.spy();
      const onSubmit = sinon.spy();
      const setSearchInitiated = sinon.spy();
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: LocationType.HEALTH,
          serviceType: 'PrimaryCare',
          searchString: 'Austin TX',
        },
        onChange,
        onSubmit,
        setSearchInitiated,
      };

      const { container } = render(<SearchForm {...props} />);

      const form = container.querySelector('form');

      fireEvent.submit(form);

      await waitFor(() => {
        expect(onChange.calledOnce).to.be.true;
        expect(onSubmit.calledOnce).to.be.true;
      });

      onChange.reset();
      onSubmit.reset();

      fireEvent.submit(form);

      await waitFor(() => {
        expect(onChange.called).to.be.false;
        expect(onSubmit.called).to.be.false;
      });
    });

    it('should reflect facility type change in UI before submit', async () => {
      const onChange = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
      };

      const { container } = render(<SearchForm {...props} />);

      const facilityDropdown = container.querySelector(
        '#facility-type-dropdown',
      );
      facilityDropdown.value = LocationType.CEMETERY;
      facilityDropdown.dispatchEvent(
        new CustomEvent('vaSelect', {
          detail: { value: LocationType.CEMETERY },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        expect(facilityDropdown.value).to.equal(LocationType.CEMETERY);
      });

      expect(onChange.called).to.be.false;
    });

    it('should not call onSubmit with invalid draft state (missing required fields)', async () => {
      const onChange = sinon.spy();
      const onSubmit = sinon.spy();
      const setSearchInitiated = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
        onSubmit,
        setSearchInitiated,
      };

      const { container } = render(<SearchForm {...props} />);

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onSubmit.called).to.be.false;
      });
    });
  });
});
