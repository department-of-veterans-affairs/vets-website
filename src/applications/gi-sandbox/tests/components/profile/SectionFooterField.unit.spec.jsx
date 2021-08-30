import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SectionFooterField from '../../../components/profile/SectionFooterField';

describe('<SectionFooterField>', () => {
  it('should render', () => {
    const tree = shallow(<SectionFooterField />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
