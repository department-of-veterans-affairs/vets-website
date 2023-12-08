import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ADDRESS_TYPES_ALTERNATE } from '@@vap-svc/constants';
import { AddressSection } from '../../containers/AddressSection';

const defaultProps = {
  address: {
    type: ADDRESS_TYPES_ALTERNATE.domestic,
    addressOne: '2476 Main Street',
    addressTwo: '',
    addressThree: '',
    city: 'Reston',
    countryName: 'USA',
    stateCode: 'VA',
    zipCode: '12345',
  },
  location: {
    pathname: '/confirm-address',
  },
  router: {
    push: sinon.spy(),
  },
};

const emptyAddress = {
  addressOne: '',
  addressTwo: '',
  addressThree: '',
  city: '',
  countryName: '',
  stateCode: '',
  type: ADDRESS_TYPES_ALTERNATE.domestic,
};

describe('<AddressSection>', () => {
  it('should enable the View Letters button with default props', () => {
    const tree = shallow(<AddressSection {...defaultProps} />);
    expect(tree.find('button').prop('disabled')).to.be.false;
    tree.unmount();
  });

  it('should render an empty address warning on the view screen and disable the View Letters button', () => {
    const tree = shallow(
      <AddressSection {...defaultProps} address={emptyAddress} />,
    );

    expect(tree.find('NoAddressBanner'));
    expect(tree.find('button').prop('disabled')).to.be.true;
    tree.unmount();
  });
});
