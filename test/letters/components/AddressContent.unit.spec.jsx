import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Address from '../../../src/js/letters/components/Address';
import AddressContent from '../../../src/js/letters/components/AddressContent';

const addressLines = {
  streetAddress: '57 Columbus Strassa, Ben Franklin Village',
  cityStatePostal: 'APO, AE 09028',
  country: 'USA',
};

const defaultProps = {
  saveError: false,
  addressObject: addressLines,
  name: 'Gary Todd',
};

describe('<AddressContent/>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AddressContent { ...defaultProps }/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should render an <UpdateFailureAlert/> if address save fails', () => {
    const props = { ...defaultProps, saveError: true };
    const tree = SkinDeep.shallowRender(<AddressContent { ...props }/>);
    const updateFailureAlert = tree.dive(['UpdateFailureAlert']);
    expect(updateFailureAlert).to.exist;
  });

  it('should render an <AddressBlock/> if there is no save error', () => {
    const tree = SkinDeep.shallowRender(<AddressContent { ...defaultProps }/>);
    const addressBlock = tree.dive(['AddressBlock']);
    expect(addressBlock).to.exist;
  });
});