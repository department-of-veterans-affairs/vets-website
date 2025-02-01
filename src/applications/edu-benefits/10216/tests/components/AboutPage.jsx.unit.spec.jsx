import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import AboutPage from '../../components/AboutPage';

describe('<SubmissionInstructions />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<AboutPage />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('should navigate to introduction on goToIntroduction call', () => {
    const mockPush = sinon.spy();
    const wrapper = shallow(
      <AboutPage aboutProps={{ router: { push: mockPush } }} />,
    );
    const event = { preventDefault: sinon.spy() };
    wrapper.find('va-link-action').simulate('click', event);
    sinon.assert.calledWith(mockPush, '/introduction');
    wrapper.unmount();
  });
});
