import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ContactInformation from '../../../components/profile/ContactInformation';

describe('<ContactInformation>', () => {
  it('should render', () => {
    const tree = shallow(<ContactInformation institution={{}} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
