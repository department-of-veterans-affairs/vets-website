import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RadioButtons from '../../components/RadioButtons';

describe('<RadioButtons>', () => {
  const options = ['yes', 'no'];

  it('calls onChange with value', () => {
    let valueChanged;
    // shallowly render component with callback that alters valueChanged with passed argument
    const wrapper = mount(
      <RadioButtons
        label="test"
        name="test"
        options={options}
        value={options[1]}
        onChange={e => {
          valueChanged = e.target.value;
        }}
      />,
    );

    // simulate change event on first input
    wrapper
      .find('input')
      .first()
      .simulate('change');

    // verify that change event value matches first value in options passed to component
    expect(valueChanged).to.eql(options[0]);
    wrapper.unmount();
  });

  it('does not call onChange with value', () => {
    let valueChanged;
    // shallowly render component with callback that alters valueChanged with passed argument
    const wrapper = mount(
      <RadioButtons
        label="test"
        name="test"
        options={options}
        value={options[1]}
        onChange={e => {
          valueChanged = e.target.value;
        }}
      />,
    );

    expect(valueChanged).not.to.eql(options[0]);
    wrapper.unmount();
  });

  it('renders label htmlFor attribute with correct input id attribute value', () => {
    const wrapper = shallow(
      <RadioButtons
        label="test"
        name="test"
        options={options}
        value={options[0]}
        onChange={() => {}}
      />,
    );

    // gather input id and label for attributes from render component
    const inputIds = wrapper.find('input').map(inputId => inputId.prop('id'));
    const labelFors = wrapper
      .find('label')
      .map(labelFor => labelFor.prop('htmlFor'));

    // assert each input id attribute value matches respective label for attribute value
    inputIds.forEach((inputId, index) =>
      expect(inputId).to.eql(labelFors[index]),
    );
    wrapper.unmount();
  });

  it('renders a legend tag with the label attribute', () => {
    const labelValue = 'test';
    const wrapper = shallow(
      <RadioButtons
        label={labelValue}
        name="test"
        options={options}
        value={options[0]}
        onChange={() => {}}
      />,
    );

    // assert that legend element was rendered with label value as its text
    const legendText = wrapper.find('.gibct-legend').text();
    expect(legendText).to.eql(labelValue);
    wrapper.unmount();
  });
});
