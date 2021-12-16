import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CautionFlagDetails from '../../../components/profile/CautionFlagDetails';

describe('<CautionFlagDetails>', () => {
  it('should render', () => {
    const tree = shallow(
      <CautionFlagDetails
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
    const tree = shallow(<CautionFlagDetails cautionFlags={[]} />);
    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
});
