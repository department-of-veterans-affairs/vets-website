import React from 'react';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { SearchForm } from '../../../components/search-form';
import { benefitsServices } from '../../../config';

describe('SearchForm', () => {
  it('Should render search controls with Choose a facility type by default', () => {
    const query = {
      facilityType: null,
    };
    const wrapper = shallow(<SearchForm currentQuery={query} />);
    expect(wrapper.render().find('.facility-type-dropdown-val-none')).to.exist;
    wrapper.unmount();
  });

  it('Should render search controls with VA benefits facility selected', () => {
    const query = {
      facilityType: 'benefits',
    };
    const wrapper = shallow(<SearchForm currentQuery={query} />);
    expect(
      wrapper
        .render()
        .find(`.facility-type-dropdown-val-${query.facilityType}`),
    ).to.exist;

    wrapper.unmount();
  });

  it('Should render search controls with VA benefits its services options', () => {
    const query = {
      facilityType: 'benefits',
    };
    const wrapper = shallow(<SearchForm currentQuery={query} />);
    const servicesList = wrapper.find('#service-type-dropdown').find('option');
    const benefits = Object.values(benefitsServices);
    servicesList.forEach((val, idx) =>
      expect(val.text()).to.equal(benefits[idx]),
    );
    wrapper.unmount();
  });

  it('Shows modal error message if geocodeError is 1 (permission denied)', () => {
    const query = {
      geocodeError: 1,
    };
    const wrapper = shallow(<SearchForm currentQuery={query} />);
    const modal = wrapper.find('ForwardRef(VaModal)');
    expect(modal.prop('visible')).to.be.true;
    expect(modal.prop('modalTitle')).to.equal(
      `Your device's location sharing is off.`,
    );
    expect(
      modal
        .dive()
        .find('p')
        .text(),
    ).to.equal(
      'To use your location when searching for a VA facility, go to the settings on your device and update sharing permissions.',
    );
    wrapper.unmount();
  });

  it('Shows modal error message if geocodeError is > 1', () => {
    const query = {
      geocodeError: 2,
    };
    const wrapper = shallow(<SearchForm currentQuery={query} />);
    const modal = wrapper.find('ForwardRef(VaModal)');
    expect(modal.prop('visible')).to.be.true;
    expect(modal.prop('modalTitle')).to.equal("We couldn't locate you");
    expect(
      modal
        .dive()
        .find('p')
        .text(),
    ).to.equal(
      'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.',
    );
    wrapper.unmount();
  });

  it('Does not show modal error message if geocodeError is 0', () => {
    const query = {
      geocodeError: 0,
    };
    const wrapper = shallow(<SearchForm currentQuery={query} />);
    expect(wrapper.find('ForwardRef(VaModal)').prop('visible')).to.be.false;
    wrapper.unmount();
  });

  describe('Draft state behavior', () => {
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

    it('should NOT call onChange when facility type changes (draft state pattern)', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<SearchForm {...props} />);

      const facilityType = wrapper.find('FacilityType');
      facilityType.prop('handleFacilityTypeChange')({
        target: { value: 'health' },
      });

      // In draft state pattern, onChange is only called on submit
      expect(props.onChange.called).to.be.false;
      wrapper.unmount();
    });

    it('should NOT call onChange when service type changes (draft state pattern)', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: 'benefits',
        },
      };
      const wrapper = shallow(<SearchForm {...props} />);

      // Get the ServiceType component and call its handler
      const serviceType = wrapper.find('ServiceType');
      serviceType.prop('handleServiceTypeChange')({
        target: { value: 'ApplyingForBenefits' },
        selectedItem: { name: 'Applying for Benefits' },
      });

      // In draft state pattern, onChange is only called on submit
      expect(props.onChange.called).to.be.false;
      wrapper.unmount();
    });

    it('should call onChange with all draft values on valid form submit', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          searchString: '10001',
        },
      };
      const wrapper = shallow(<SearchForm {...props} />);

      // Set facility type in draft state via the handler
      const facilityType = wrapper.find('FacilityType');
      facilityType.prop('handleFacilityTypeChange')({
        target: { value: 'health' },
      });

      // Submit form
      const form = wrapper.find('form#facility-search-controls');
      form.simulate('submit', { preventDefault: () => {} });

      expect(props.onChange.called).to.be.true;
      const { lastCall } = props.onChange;
      expect(lastCall.args[0]).to.deep.include({
        facilityType: 'health',
        searchString: '10001',
      });
      wrapper.unmount();
    });

    it('should prevent duplicate search with same draft values', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          searchString: '10001',
          facilityType: 'health',
          zoomLevel: 4,
        },
      };
      const wrapper = shallow(<SearchForm {...props} />);

      const form = wrapper.find('form#facility-search-controls');

      // First submit
      form.simulate('submit', { preventDefault: () => {} });
      expect(props.onSubmit.calledOnce).to.be.true;

      // Second submit with same values should be prevented
      form.simulate('submit', { preventDefault: () => {} });
      expect(props.onSubmit.calledOnce).to.be.true; // Still only once
      wrapper.unmount();
    });
  });

  describe('Callback props for draft state pattern', () => {
    const getDefaultProps = () => ({
      currentQuery: {
        facilityType: null,
        serviceType: null,
        searchString: '',
        vamcServiceDisplay: null,
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

    it('should update draft state when onLocationSelection is called', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: 'health',
        },
      };
      const wrapper = shallow(<SearchForm {...props} />);

      const addressAutosuggest = wrapper.find('AddressAutosuggest');
      const onLocationSelection = addressAutosuggest.prop(
        'onLocationSelection',
      );

      onLocationSelection({ searchString: 'New York, NY' });

      const form = wrapper.find('form#facility-search-controls');
      form.simulate('submit', { preventDefault: () => {} });

      expect(props.onChange.called).to.be.true;
      expect(props.onChange.lastCall.args[0]).to.deep.include({
        searchString: 'New York, NY',
        facilityType: 'health',
      });
      wrapper.unmount();
    });

    it('should update draft state when onVamcDraftChange is called', () => {
      const props = {
        ...getDefaultProps(),
        currentQuery: {
          ...getDefaultProps().currentQuery,
          facilityType: 'health',
          searchString: '10001',
        },
        vamcAutoSuggestEnabled: true,
      };
      const wrapper = shallow(<SearchForm {...props} />);

      const serviceType = wrapper.find('ServiceType');
      const onVamcDraftChange = serviceType.prop('onVamcDraftChange');

      onVamcDraftChange({
        serviceType: 'PrimaryCare',
        vamcServiceDisplay: 'Primary care',
      });

      const form = wrapper.find('form#facility-search-controls');
      form.simulate('submit', { preventDefault: () => {} });

      expect(props.onChange.called).to.be.true;
      expect(props.onChange.lastCall.args[0]).to.deep.include({
        serviceType: 'PrimaryCare',
        vamcServiceDisplay: 'Primary care',
      });
      wrapper.unmount();
    });
  });
});
