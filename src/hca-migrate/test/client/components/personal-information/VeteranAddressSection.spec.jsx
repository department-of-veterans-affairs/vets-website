import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { VeteranAddressSection } from '../../../../src/client/components/veteran-information/VeteranAddressSection';
import { makeField } from '../../../../src/common/fields';

describe('<VeteranAddressSection>', () => {
  const nullAddress = {
    street: makeField(''),
    city: makeField(''),
    country: makeField(''),
    state: makeField(''),
    zipcode: makeField(''),
  };

  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<VeteranAddressSection data={{ address: nullAddress }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom.props.children).to.exist;
  });
});
