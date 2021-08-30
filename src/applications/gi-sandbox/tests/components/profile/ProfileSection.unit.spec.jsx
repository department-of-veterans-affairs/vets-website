import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ProfileSection from '../../../components/profile/ProfileSection';

describe('<ProfileSection>', () => {
  it('should render', () => {
    const tree = shallow(<ProfileSection />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
