import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import OnlineClassesFilter from '../../../components/search/OnlineClassesFilter';

describe('<OnlineClassesFilter/>', () => {
  it('should render', () => {
    const wrapper = shallow(<OnlineClassesFilter />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('contains the radio buttons label text', () => {
    const onChangeSpy = sinon.spy();
    const showModalSpy = sinon.spy();
    const wrapper = shallow(
      <OnlineClassesFilter
        onlineClasses="yes"
        showModal={showModalSpy}
        onChange={onChangeSpy}
      />,
    );
    const learnMoreLabel = wrapper.find('LearnMoreLabel');
    expect(learnMoreLabel).to.have.lengthOf(1);
    expect(learnMoreLabel.prop('text')).to.equal(
      'Will you be taking any classes in person?',
    );
    wrapper.unmount();
  });
  it('calls showModal when the LearnMoreLabel is clicked', () => {
    const onChangeSpy = sinon.spy();
    const showModalSpy = sinon.spy();
    const wrapper = shallow(
      <OnlineClassesFilter
        onlineClasses="yes"
        showModal={showModalSpy}
        onChange={onChangeSpy}
      />,
    );
    const learnMoreLabel = wrapper.find('LearnMoreLabel');
    expect(learnMoreLabel).to.have.lengthOf(1);
    learnMoreLabel.prop('onClick')();
    expect(showModalSpy.calledOnce).to.be.true;
    expect(showModalSpy.calledWith('onlineOnlyDistanceLearning')).to.be.true;
    wrapper.unmount();
  });
  it('passes the correct initial value to the VARadioButton', () => {
    const onChangeSpy = sinon.spy();
    const showModalSpy = sinon.spy();
    const wrapper = shallow(
      <OnlineClassesFilter
        onlineClasses="yes"
        showModal={showModalSpy}
        onChange={onChangeSpy}
      />,
    );
    const radioButton = wrapper.find('VARadioButton');
    expect(radioButton).to.have.lengthOf(1);
    expect(radioButton.prop('initialValue')).to.equal('yes');
    wrapper.unmount();
  });
  it('calls onChange with the correct arguments when an option is selected', () => {
    const onChangeSpy = sinon.spy();
    const showModalSpy = sinon.spy();
    const wrapper = shallow(
      <OnlineClassesFilter
        onlineClasses="yes"
        showModal={showModalSpy}
        onChange={onChangeSpy}
      />,
    );
    const radioButton = wrapper.find('VARadioButton');
    const mockEvent = { target: { value: 'no' } };
    radioButton.prop('onVaValueChange')(mockEvent);

    expect(onChangeSpy.calledOnce).to.be.true;
    expect(onChangeSpy.calledWith(mockEvent, 'onlineClasses', 2)).to.be.true;
    wrapper.unmount();
  });
});
