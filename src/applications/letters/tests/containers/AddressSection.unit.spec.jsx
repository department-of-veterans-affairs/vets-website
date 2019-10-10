import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { AddressSection } from '../../containers/AddressSection';
import { ADDRESS_TYPES } from '../../utils/constants';

const defaultProps = {
  savedAddress: {
    type: ADDRESS_TYPES.domestic,
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
  type: ADDRESS_TYPES.domestic,
};

describe('<AddressSection>', () => {
  it('should enable the View Letters button with default props', () => {
    const tree = shallow(<AddressSection {...defaultProps} />);
    expect(tree.find('button').prop('disabled')).to.be.false;
    tree.unmount();
  });

  it('should render an empty address warning on the view screen and disable the View Letters button', () => {
    const tree = shallow(
      <AddressSection {...defaultProps} savedAddress={emptyAddress} />,
    );
    expect(
      tree
        .find('.usa-alert-heading')
        .first()
        .text(),
    ).to.equal("We don't have a valid address on file for you");
    expect(tree.find('button').prop('disabled')).to.be.true;
    tree.unmount();
  });
});
