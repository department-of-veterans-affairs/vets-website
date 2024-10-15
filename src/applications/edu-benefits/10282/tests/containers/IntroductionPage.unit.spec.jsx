import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
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

  it('should render', () => {
    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);

    expect(wrapper.find('FormTitle').props().title).to.contain('Apply');

    expect(wrapper.find('va-link-action').length).to.equal(1);

    expect(wrapper.find(OmbInfo)).to.not.be.undefined;

    wrapper.unmount();
  });

  it('should start form when start application link is clicked', () => {
    const router = {
      push: () => {},
    };
    const wrapper = shallow(
      <IntroductionPage router={router} {...fakeStore.getState()} />,
    );
    const vaLink = wrapper.find('va-link-action');
    const event = { preventDefault: () => {} };
    const preventDefault = sinon.spy(event, 'preventDefault');

    expect(vaLink).to.exist;
    vaLink.simulate('click', event);
    expect(preventDefault.called).to.be.true;
    wrapper.unmount();
  });
});
