import React from 'react';

import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { SearchForm } from '../../../components/search-form';
import { benefitsServices } from '../../../config';
import { LocationType } from '../../../constants';

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

    it('should NOT call onChange on facility type change', () => {
      const onChange = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
      };

      const wrapper = mount(<SearchForm {...props} />);

      const facilityType = wrapper.find('FacilityType');
      facilityType.prop('handleFacilityTypeChange')({
        target: { value: LocationType.HEALTH },
      });

      expect(onChange.called).to.be.false;

      wrapper.unmount();
    });

    it('should NOT call onChange on service type change', () => {
      const onChange = sinon.spy();
      const defaultProps = getDefaultProps();
      const props = {
        ...defaultProps,
        currentQuery: {
          ...defaultProps.currentQuery,
          facilityType: LocationType.BENEFITS,
          searchString: 'Austin TX',
        },
        onChange,
      };

      const wrapper = mount(<SearchForm {...props} />);

      const serviceType = wrapper.find('ServiceType');
      serviceType.prop('handleServiceTypeChange')({
        target: { value: 'ApplyingForBenefits' },
        selectedItem: null,
      });

      expect(onChange.called).to.be.false;

      wrapper.unmount();
    });

    it('should call onChange only on form submit with all draft values', () => {
      const onChange = sinon.spy();
      const onSubmit = sinon.spy();
      const setSearchInitiated = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
        onSubmit,
        setSearchInitiated,
      };

      const wrapper = mount(<SearchForm {...props} />);

      const facilityType = wrapper.find('FacilityType');
      facilityType.prop('handleFacilityTypeChange')({
        target: { value: LocationType.HEALTH },
      });
      wrapper.update();

      expect(onChange.called).to.be.false;

      const serviceType = wrapper.find('ServiceType');
      serviceType.prop('handleServiceTypeChange')({
        target: { value: 'PrimaryCare' },
        selectedItem: { name: 'Primary care' },
      });
      wrapper.update();

      expect(onChange.called).to.be.false;

      const addressAutosuggest = wrapper.find('AddressAutosuggest');
      addressAutosuggest.prop('onLocationSelection')({
        searchString: 'Austin TX',
      });
      wrapper.update();

      expect(onChange.called).to.be.false;

      wrapper.find('form').simulate('submit', { preventDefault: () => {} });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        facilityType: LocationType.HEALTH,
        serviceType: 'PrimaryCare',
        searchString: 'Austin TX',
      });

      wrapper.unmount();
    });

    it('should prevent duplicate search with draft state', () => {
      const onChange = sinon.spy();
      const onSubmit = sinon.spy();
      const setSearchInitiated = sinon.spy();
      const defaultProps = getDefaultProps();
      const props = {
        ...defaultProps,
        currentQuery: {
          ...defaultProps.currentQuery,
          facilityType: LocationType.HEALTH,
          serviceType: 'PrimaryCare',
          searchString: 'Austin TX',
        },
        onChange,
        onSubmit,
        setSearchInitiated,
      };

      const wrapper = mount(<SearchForm {...props} />);

      wrapper.find('form').simulate('submit', { preventDefault: () => {} });

      expect(onChange.calledOnce).to.be.true;
      expect(onSubmit.calledOnce).to.be.true;

      onChange.reset();
      onSubmit.reset();

      wrapper.find('form').simulate('submit', { preventDefault: () => {} });

      expect(onChange.called).to.be.false;
      expect(onSubmit.called).to.be.false;

      wrapper.unmount();
    });

    it('should update draft state when form fields change', () => {
      const onChange = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
      };

      const wrapper = mount(<SearchForm {...props} />);

      const facilityType = wrapper.find('FacilityType');
      facilityType.prop('handleFacilityTypeChange')({
        target: { value: LocationType.CEMETERY },
      });
      wrapper.update();

      const updatedFacilityType = wrapper.find('FacilityType');
      expect(updatedFacilityType.prop('currentQuery').facilityType).to.equal(
        LocationType.CEMETERY,
      );

      expect(updatedFacilityType.prop('currentQuery').serviceType).to.be.null;

      wrapper.unmount();
    });

    it('should not submit with invalid draft state', () => {
      const onChange = sinon.spy();
      const onSubmit = sinon.spy();
      const setSearchInitiated = sinon.spy();
      const props = {
        ...getDefaultProps(),
        onChange,
        onSubmit,
        setSearchInitiated,
      };

      const wrapper = mount(<SearchForm {...props} />);

      wrapper.find('form').simulate('submit', { preventDefault: () => {} });

      expect(onSubmit.called).to.be.false;

      wrapper.unmount();
    });
  });
});
