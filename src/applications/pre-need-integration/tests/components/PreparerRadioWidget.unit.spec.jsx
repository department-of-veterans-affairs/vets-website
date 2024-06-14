import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import PreparerRadioWidget from '../../components/PreparerRadioWidget';

describe('PreparerRadioWidget in Pre-need preparer info', () => {
  const mockEnumOptions = [
    { value: 'Freddy Kruger', label: 'Self' },
    { value: 'Pinhead', label: 'Other' },
  ];

  const props = {
    id: 'testRadio',
    options: {
      enumOptions: mockEnumOptions,
      enableAnalytics: false,
    },
    value: 'value1',
    onChange: sinon.spy(),
  };

  it('should render', () => {
    const wrapper = mount(<PreparerRadioWidget {...props} />);
    expect(wrapper.find('va-radio-option').length).to.equal(2);
    wrapper.unmount();
  });

  it('should invoke onChange when a radio button is clicked', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <PreparerRadioWidget {...props} onChange={onChange} />,
    );

    const vaRadio = wrapper.find('VaRadio');
    expect(vaRadio.exists()).to.be.true;

    vaRadio
      .props()
      .onVaValueChange({ detail: { value: 'Pinhead', checked: true } });
    expect(onChange.calledWith('Pinhead')).to.be.true;
    wrapper.unmount();
  });
});
