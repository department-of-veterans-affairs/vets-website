import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VARadioButton from '../../components/VARadioButton';

describe('<VARadioButton>', () => {
  const options = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  it('should render', () => {
    const tree = shallow(
      <VARadioButton
        radioLabel="test"
        name="test"
        options={options}
        initialValue={options[1].value}
        onVaValueChange={e => `----------e=${e.detail.value}`}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
