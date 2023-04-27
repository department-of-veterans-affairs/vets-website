import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import MemorableDateOfBirthField from '../../components/MemorableDateOfBirthField';

describe('<MemorableDateOfBirthField>', () => {
  it('should render', () => {
    const tree = shallow(<MemorableDateOfBirthField />);

    expect(tree.find('va-memorable-date').length).to.equal(1);
    tree.unmount();
  });
});
