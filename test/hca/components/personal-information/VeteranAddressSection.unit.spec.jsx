import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { VeteranAddressSection } from '../../../../src/js/hca/components/veteran-information/VeteranAddressSection';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<VeteranAddressSection>', () => {
  const nullAddress = {
    street: makeField(''),
    street2: makeField(''),
    street3: makeField(''),
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
