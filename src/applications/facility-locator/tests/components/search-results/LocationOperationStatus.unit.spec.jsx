import React from 'react';
import { shallow } from 'enzyme';
import LocationOperationStatus from '../../../components/search-results-items/common/LocationOperationStatus';
import { expect } from 'chai';

describe('LocationOperationStatus', () => {
  it('should render the operation status - LIMITED', () => {
    const operationStatus = { code: 'LIMITED' };
    const wrapper = shallow(
      <LocationOperationStatus operatingStatus={operationStatus} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should render the operation status - CLOSED', () => {
    const operationStatus = { code: 'CLOSED' };
    const wrapper = shallow(
      <LocationOperationStatus operatingStatus={operationStatus} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should render the operation status - NOTICE', () => {
    const operationStatus = { code: 'NOTICE' };
    const wrapper = shallow(
      <LocationOperationStatus operatingStatus={operationStatus} />,
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
