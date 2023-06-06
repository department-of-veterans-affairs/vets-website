import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react';

import { ConnectedApps } from '../../../components/connected-apps/ConnectedApps';

const noAppsConnectedText =
  'You don’t have any third-party apps connected to your profile.';
const moreQuestionsText = 'Have more questions about connected apps?';
const appInfoText =
  'Connected apps are third-party (non-VA) applications or websites that can share certain information from your VA.gov profile, with your permission. For example, you can connect information from your VA health record to an app that helps you track your health.';
const convenienceText =
  'We offer this feature for your convenience. It’s always your choice whether to connect, or stay connected, to a third-party app';
const otherAppsText =
  'What other third-party apps can I connect to my profile?';
const loadingAppsText = 'Loading your connected apps...';
const goToAppDirectoryText = 'Go to app directory';
const title = 'Connected apps';

describe('<ConnectedApps>', () => {
  it('renders correctly with apps', () => {
    const defaultProps = {
      apps: [{ deleted: true }, { deleted: false }],
      loading: false,
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = shallow(<ConnectedApps {...defaultProps} />);

    const headline = wrapper.find('ProfileSectionHeadline');
    expect(headline.dive().text()).to.equal(title);

    const text = wrapper.text();
    expect(text).to.include(
      'Your VA.gov profile is connected to the third-party (non-VA) apps listed below. If you want to stop sharing information with an app, you can disconnect it from your profile at any time.',
    );
    expect(text).to.not.include(appInfoText);
    expect(text).to.not.include(loadingAppsText);
    expect(text).to.not.include(noAppsConnectedText);
    expect(text).to.not.include(goToAppDirectoryText);
    expect(text).to.include(moreQuestionsText);

    wrapper.unmount();
  });

  it('renders correctly with all deleted apps', () => {
    const defaultProps = {
      apps: [{ deleted: true }, { deleted: true }],
      loading: false,
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = mount(<ConnectedApps {...defaultProps} />);

    const text = wrapper.text();
    expect(text).to.include(title);
    expect(text).to.include(appInfoText);
    expect(text).to.not.include(loadingAppsText);
    expect(text).to.include(convenienceText);
    expect(text).to.include(noAppsConnectedText);
    expect(text).to.include(goToAppDirectoryText);
    expect(text).not.to.include(otherAppsText);
    expect(text).to.include(moreQuestionsText);

    wrapper.unmount();
  });

  it('renders correctly when Record not found error is thrown', () => {
    const defaultProps = {
      errors: [
        {
          title: 'Some server error',
          detail: 'Some server error',
          code: '404',
          status: '404',
        },
        {
          title: 'Record not found',
          detail: 'The record identified by 0000 could not be found',
          code: '404',
          status: '404',
        },
      ],
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = mount(<ConnectedApps {...defaultProps} />);

    const text = wrapper.text();
    expect(text).to.include(title);
    expect(text).to.include(appInfoText);
    expect(text).to.not.include(loadingAppsText);
    expect(text).to.include(convenienceText);
    expect(text).to.include(noAppsConnectedText);
    expect(text).to.include(goToAppDirectoryText);
    expect(text).not.to.include(otherAppsText);
    expect(text).to.include(moreQuestionsText);

    wrapper.unmount();
  });

  it('renders correctly when loading', () => {
    const defaultProps = {
      apps: [{ deleted: true }, { deleted: true }],
      loading: true,
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = render(<ConnectedApps {...defaultProps} />);

    // making sure the loading indicator web component is present
    expect(wrapper.getByTestId('connected-apps-loading-indicator')).to.exist;

    wrapper.unmount();
  });
});
