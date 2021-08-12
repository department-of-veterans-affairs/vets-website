import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import OptInWidget from '../../components/OptInWidget';

describe('<OptInWidget>', () => {
  const getProps = ({ submitted = false, onChange = () => {} } = {}) => ({
    id: 'id',
    value: false,
    additionalIssues: [],
    onChange,
    formContext: {
      submitted,
    },
  });

  it('should render a check box', () => {
    const props = getProps();
    const wrapper = mount(<OptInWidget {...props} />);
    expect(wrapper.find('Checkbox')).to.exist;
    wrapper.unmount();
  });

  it('should call onChange when the checkbox is toggled', () => {
    const onChange = sinon.spy();
    const props = getProps({ onChange });
    const wrapper = mount(<OptInWidget {...props} />);

    // "Click" the option
    // .simulate('click') wasn't calling the onChange handler for some reason
    wrapper
      .find('input')
      .props()
      .onChange({ target: { checked: true } });

    // Check that it changed
    expect(onChange.callCount).to.equal(1);
    expect(onChange.firstCall.args[0]).to.be.true;

    // "Click" the option
    wrapper
      .find('input')
      .props()
      .onChange({ target: { checked: false } });

    // Check that it changed back
    expect(onChange.callCount).to.equal(2);
    expect(onChange.secondCall.args[0]).to.be.false;

    wrapper.unmount();
  });
  it('should not show an error when submitted with no selections in eligible issues', () => {
    const props = getProps({ submitted: true });
    const wrapper = mount(<OptInWidget {...props} value />);
    wrapper
      .find('input')
      .props()
      .onChange({ target: { checked: true } });

    expect(wrapper.find('.usa-input-error').length).to.equal(0);
    wrapper.unmount();
  });
});
