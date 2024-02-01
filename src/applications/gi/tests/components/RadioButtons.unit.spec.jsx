import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RadioButtons from '../../components/RadioButtons';

describe('<RadioButtons>', () => {
  const options = ['yes', 'no'];

  it('calls onChange with value', () => {
    let valueChanged;
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
    wrapper
      .find('input')
      .first()
      .simulate('change');

    expect(valueChanged).to.eql(options[0]);
    wrapper.unmount();
  });

  it('does not call onChange with value', () => {
    let valueChanged;
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

  it('should add requiredSpan', () => {
    const labelValue = 'test';
    const wrapper = shallow(
      <RadioButtons
        label={labelValue}
        name="test"
        options={options}
        value={options[0]}
        onChange={() => {}}
        required
      />,
    );
    const legendText = wrapper.find('span.form-required-span').text();
    expect(legendText).to.eql('*');
    wrapper.unmount();
  });

  it('should add errorSpanId', () => {
    const labelValue = 'test';
    const wrapper = shallow(
      <RadioButtons
        label={labelValue}
        name="test"
        options={options}
        value={options[0]}
        onChange={() => {}}
        required
        errorMessage
      />,
    );
    const legendText = wrapper.find('span.usa-input-error-message').text();
    expect(legendText).to.eql('Error ');

    wrapper.unmount();
  });

  it.skip('should render option', () => {
    const labelValue = 'test';
    const wrapper = mount(
      <RadioButtons
        label={labelValue}
        name="test"
        options={[
          {
            value: 'value1',
            label: 'label1',
            additional: 'additional',
            learnMore: 'learnMore1',
          },
          {
            value: 'value2',
            label: 'label2',
            additional: 'additional',
            learnMore: 'learnMore2',
          },
        ]}
        value={options[0]}
        onChange={() => {}}
        required
        errorMessage
      />,
    );
    const legendText = wrapper
      .find('div')
      .first()
      .text();
    expect(legendText).to.eql('test*Error label1learnMore1label2learnMore2');
    wrapper.unmount();
  });

  it('should return emtpy array if options not in array', () => {
    const labelValue = 'test';
    const wrapper = mount(
      <RadioButtons
        label={labelValue}
        name="test"
        options={{
          value: 'value1',
          label: 'label1',
          additional: 'additional',
          learnMore: 'learnMore1',
        }}
        value={options[0]}
        onChange={() => {}}
        required
        errorMessage
      />,
    );
    expect(wrapper.props().options).to.not.eql([]);

    wrapper.unmount();
  });
});
