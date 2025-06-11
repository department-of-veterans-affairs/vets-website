import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import IntroductionPage from '../../containers/IntroductionPage';
import OmbInfo from '../../components/OmbInfo';

describe('Edu 10282 <IntroductionPage>', () => {
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
      'Apply for the IBM SkillsBuild program',
    );

    wrapper.unmount();
  });

  it('should render save in progress widget', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    const sipContainer = wrapper.find('Connect(SaveInProgressIntro)');

    expect(sipContainer.length).to.equal(1);
    expect(sipContainer.props().startText).to.contain('Start your application');

    wrapper.unmount();
  });

  it('should render omb info', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find(OmbInfo).length).to.equal(1);

    wrapper.unmount();
  });
});
