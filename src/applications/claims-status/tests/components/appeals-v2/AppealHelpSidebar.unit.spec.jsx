import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import * as Sentry from '@sentry/browser';
import AppealHelpSidebar from '../../../components/appeals-v2/AppealHelpSidebar';

describe('<AppealHelpSidebar>', () => {
  it('should render', () => {
    const props = { aoj: 'vba' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(wrapper.find('NeedHelp')).to.not.be.false;
    wrapper.unmount();
  });

  it('should render the vba version', () => {
    const props = { aoj: 'vba' };
    const mockStore = {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          omni_channel_link: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = mount(
      <Provider store={mockStore}>
        <AppealHelpSidebar {...props} />
      </Provider>,
    );

    expect(wrapper.find('NeedHelp').text()).to.contain(
      "We're here Monday through Friday, 8:00 a.m to 9:00 p.m ET.",
    );
    wrapper.unmount();
  });

  it('should render the vha version', () => {
    const props = { aoj: 'vha' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);

    expect(
      wrapper
        .find('p')
        .first()
        .text(),
    ).to.equal('Call Health Care Benefits');
    wrapper.unmount();
  });

  it('should render null when nca', () => {
    const props = { aoj: 'nca' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });

  it('should render null when other', () => {
    const props = { aoj: 'other' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });

  it('should render null and capture sentry message with appeal type unknown', () => {
    const spy = sinon.spy(Sentry, 'captureMessage');
    const props = { aoj: 'unknown' };
    const wrapper = shallow(<AppealHelpSidebar {...props} />);
    expect(wrapper.isEmptyRender()).to.be.true;
    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0]).to.equal(
      'appeal-status-unexpected-aoj: unknown',
    );
    wrapper.unmount();
  });
});
