import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VARadioButton from '../../components/VARadioButton';

describe('<VARadioButton>', () => {
  const options = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  it('calls onVaValueChange with value', () => {
    let valueChanged;
    // shallowly render component with callback that alters valueChanged with passed argument
    const wrapper = mount(
      <VARadioButton
        radioLabel="test"
        name="test"
        options={options}
        initialValue={options[1].value}
        onVaValueChange={e => {
          valueChanged = e.detail.value;
        }}
      />,
    );

    // simulate change event on first input
    wrapper
      .find('input')
      .first()
      .simulate('change');

    // verify that change event value matches first value in options passed to component
    expect(valueChanged).to.eql(options[0].value);
    wrapper.unmount();
  });
});
