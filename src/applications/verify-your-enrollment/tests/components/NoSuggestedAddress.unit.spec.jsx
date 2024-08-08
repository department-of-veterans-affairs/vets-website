import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import NoSuggestedAddress from '../../components/NoSuggestedAddress';

describe('<NoSuggestedAddress />', () => {
  let wrapper;
  const setChooseAddressSpy = sinon.spy();
  beforeEach(() => {
    const props = {
      deliveryPointValidation: 'MISSING_ZIP',
      formData: {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'New York',
        stateCode: 'NY',
        zipCode: '10001',
        countryCodeIso3: 'USA',
      },
      setChooseAddress: setChooseAddressSpy,
    };
    act(() => {
      wrapper = shallow(<NoSuggestedAddress {...props} />);
    });
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('renders without crashing', () => {
    expect(wrapper.exists()).to.be.true;
  });

  it('should calls setChooseAddress with "entered" when isThereNoSuggestedAddress is true', () => {
    wrapper.update();

    expect(setChooseAddressSpy.calledWith('suggested')).to.be.false;
  });
  it('sjould not render addressLine2 is there is no addressLine2', () => {
    wrapper.setProps({
      formData: {
        addressLine1: '123 Main St',
        city: 'New York',
        stateCode: 'NY',
        zipCode: '10001',
        countryCodeIso3: 'USA',
      },
    });
    expect(wrapper.find('#entered-address').text()).to.include('123 Main St');
    expect(wrapper.find('#entered-address').text()).to.not.include('Apt 4B');
  });
  it('renders the entered address when deliveryPointValidation is not CONFIRMED', () => {
    expect(wrapper.find('#entered-address').text()).to.not.include(
      '123 Main St Apt 4B',
    );
    expect(wrapper.find('#entered-address').text()).to.include(
      'New York, NY 10001',
    );
  });

  it('does not render the error alert or the entered address when deliveryPointValidation is CONFIRMED', () => {
    wrapper.setProps({ deliveryPointValidation: 'CONFIRMED' });
    expect(wrapper.find('.usa-alert-error')).to.have.lengthOf(0);
    expect(wrapper.find('.usa-radio')).to.have.lengthOf(0);
  });
});
