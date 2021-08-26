import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import VeteranProgramsAndSupport from '../../../components/profile/VeteranProgramsAndSupport';

describe('<VeteranProgramsAndSupport>', () => {
  it('should render', () => {
    const tree = shallow(<VeteranProgramsAndSupport />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
