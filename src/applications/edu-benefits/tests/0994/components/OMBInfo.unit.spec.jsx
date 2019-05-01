import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import OMBInfo from '../../../0994/components/OMBInfo';

describe('<OMBInfo/>', () => {
  it('should render', () => {
    const tree = shallow(
      <OMBInfo
        resBurden={15}
        ombNumber="OMB Number"
        expDate="Expiration date"
      />,
    );
    expect(tree.text()).to.contain('Expiration date');
    tree.unmount();
  });

  it('should pass aXe check', () =>
    axeCheck(
      <OMBInfo
        resBurden={15}
        ombNumber="OMB Number"
        expDate="Expiration date"
      />,
    ));
});
