import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CautionFlagHeading from '../../../components/profile/CautionFlagHeading';

describe('<CautionFlagHeading>', () => {
  it('should render', () => {
    const tree = shallow(
      <CautionFlagHeading
        cautionFlags={[
          {
            title: 'Test',
          },
        ]}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should not render without caution flags', () => {
    const tree = shallow(<CautionFlagHeading cautionFlags={[]} />);
    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
});
