import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import {
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  Paragraph,
  errorAddressAlert,
} from '../../constants';

const mockStore = configureMockStore();
const store = mockStore({});

describe('when <Paragraph/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<Paragraph />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  describe('errorAddressAlert', () => {
    it('should return the correct alert for BAD_UNIT_NUMBER', () => {
      const wrapper = shallow(
        <Provider store={store}>{errorAddressAlert(BAD_UNIT_NUMBER)}</Provider>,
      );
      expect(wrapper.find('Alert')).to.have.length(1);
      expect(wrapper.find('Alert').prop('title')).to.equal(
        'Confirm your address',
      );
      expect(wrapper.find('Alert').prop('message')).to.equal(
        'U.S. Postal Service records show that there may be a problem with the unit number for this address. Confirm that you want us to use this address as you entered it. Or, cancel to edit the address.',
      );
      wrapper.unmount();
    });

    it('should return the correct alert for MISSING_UNIT_NUMBER', () => {
      const wrapper = shallow(
        <Provider store={store}>
          {errorAddressAlert(MISSING_UNIT_NUMBER)}
        </Provider>,
      );
      expect(wrapper.find('Alert')).to.have.length(1);
      expect(wrapper.find('Alert').prop('title')).to.equal(
        'Confirm your address',
      );
      expect(wrapper.find('Alert').prop('message')).to.equal(
        'U.S. Postal Service records show this address may need a unit number. Confirm that you want us to use this address as you entered it. Or, go back to edit and add a unit number.',
      );
      wrapper.unmount();
    });

    it('should return the correct alert for MISSING_ZIP', () => {
      const wrapper = shallow(
        <Provider store={store}>{errorAddressAlert('MISSING_ZIP')}</Provider>,
      );
      expect(wrapper.find('Alert')).to.have.length(1);
      expect(wrapper.find('Alert').prop('title')).to.equal(
        'Confirm your address',
      );
      expect(wrapper.find('Alert').prop('message')).to.equal(
        'We can’t confirm the address you entered with the U.S. Postal Service. Confirm that you want us to use this address as you entered it. Or, go back to edit it.',
      );
      wrapper.unmount();
    });

    it('should return null for other values', () => {
      expect(errorAddressAlert('OTHER_VALUE')).to.be.null;
    });
  });
});
