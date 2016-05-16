import React from 'react';
import SkinDeep from 'skin-deep';

import { VeteranAddressSection } from '../../../../../_health-care/_js/components/personal-information/VeteranAddressSection';

describe('<VeteranAddressSection>', () => {
  const nullAddress = [{
    street: null,
    city: null,
    country: null,
    state: null,
    zipcode: null,
  }];

  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<VeteranAddressSection data={{ address: nullAddress }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom.props.children).to.exist;
  });

  describe('Email confimration', () => {
    it('does not include `error` prop when matches Email', () => {
      const tree = SkinDeep.shallowRender(
        <VeteranAddressSection data={{ address: nullAddress, email: 'mock@aol.com', emailConfirmation: 'mock@aol.com' }}/>);
      const emailInputs = tree.everySubTree('Email');
      expect(emailInputs).to.have.lengthOf(2);
      expect(emailInputs[1].props.error).to.be.undefined;
    });

    it('does include `error` prop when does not match Email', () => {
      const tree = SkinDeep.shallowRender(
        <VeteranAddressSection data={{ address: nullAddress, email: '', emailConfirmation: 'mock@aol.com' }}/>);
      const emailInputs = tree.everySubTree('Email');
      expect(emailInputs).to.have.lengthOf(2);
      expect(emailInputs[1].props.error).to.not.be.undefined;
    });
  });
});
