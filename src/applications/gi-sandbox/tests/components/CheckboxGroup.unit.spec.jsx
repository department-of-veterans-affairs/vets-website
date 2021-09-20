import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CheckboxGroup from '../../components/CheckboxGroup';

describe('<CheckboxGroup>', () => {
  it('should render', () => {
    const tree = shallow(<CheckboxGroup />);
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('input').length).to.eq(0);
    tree.unmount();
  });
  it('should render inputs', () => {
    const tree = shallow(
      <CheckboxGroup
        options={[
          {
            name: 'checkbox-1',
            optionLabel: 'label 1',
          },
          {
            name: 'checkbox-2',
            optionLabel: 'label 2',
          },
        ]}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('input').length).to.eq(2);
    tree.unmount();
  });
});
