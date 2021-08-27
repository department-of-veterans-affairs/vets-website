import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GettingStartedWithBenefits from '../../../components/profile/GettingStartedWithBenefits';

describe('<GettingStartedWithBenefits>', () => {
  it('should render', () => {
    const tree = shallow(<GettingStartedWithBenefits />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
