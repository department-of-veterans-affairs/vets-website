import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PreSubmitNotice from '../../containers/PreSubmitInfo';

describe('<PreSubmitNotice />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<PreSubmitNotice formData={{}} />);
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('renders correct text when isActiveDuty is true', () => {
    const wrapper = shallow(
      <PreSubmitNotice formData={{ isActiveDuty: true }} />,
    );
    expect(
      wrapper
        .find('li')
        .at(0)
        .text(),
    ).to.equal(
      'All statements in this application are true and correct to the best of your knowledge and belief',
    );
    expect(
      wrapper
        .find('li')
        .at(1)
        .text(),
    ).to.equal(
      'As an active-duty service member, you have consulted with an Education Service Officer (ESO) regarding your education program',
    );
    wrapper.unmount();
  });

  it('renders correct text when isActiveDuty is false', () => {
    const wrapper = shallow(
      <PreSubmitNotice formData={{ isActiveDuty: false }} />,
    );
    expect(wrapper.find('p').text()).to.equal(
      'By submitting this form you certify that all statements in this application are true and correct to the best of your knowledge and belief.',
    );
    wrapper.unmount();
  });
});
