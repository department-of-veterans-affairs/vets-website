import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import IntroductionPage from '../../containers/IntroductionPage';

describe('22-10216 <IntroductionPage>', () => {
  const fakeStore = {
    getState: () => ({
      showWizard: false,
      route: { formConfig: {} },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should render form title', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('FormTitle').props().title).to.contain(
      'Request exemption from the 85/15 rule reporting requirements',
    );

    wrapper.unmount();
  });

  it('should render info alert box', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('va-alert').props().status).to.contain('info');
    expect(wrapper.find('va-alert').length).to.equal(1);
    expect(wrapper.find('va-alert').text()).to.contain(
      'For educational institutions only',
    );

    wrapper.unmount();
  });

  it('should render section headers', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('h2').length).to.equal(6);

    wrapper.unmount();
  });

  it('should render process list', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('va-process-list').length).to.equal(1);
    expect(wrapper.find('va-process-list-item').length).to.equal(3);

    wrapper.unmount();
  });

  it('should render accordion', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('va-accordion').length).to.equal(1);
    expect(wrapper.find('va-accordion-item').length).to.equal(5);

    wrapper.unmount();
  });

  it('should render save in progress widget', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    const sipContainer = wrapper.find(
      'Connect(withRouter(SaveInProgressIntro))',
    );

    expect(sipContainer.length).to.equal(1);
    expect(sipContainer.props().startText).to.contain(
      'Start your 35% exemption request',
    );

    wrapper.unmount();
  });

  it('should render omb info', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('va-omb-info').length).to.equal(1);

    wrapper.unmount();
  });
});
