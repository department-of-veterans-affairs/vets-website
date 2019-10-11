import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { IntroductionPage } from '../../components/IntroductionPage';

const defaultProps = {
  user: {
    profile: {
      // need to have a saved form or else form will redirect to v2
      savedForms: [
        {
          form: VA_FORM_IDS.FORM_20_0996,
          metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
        },
      ],
    },
  },
  saveInProgress: {
    user: {},
  },
  location: {
    pathname: '/introduction',
  },
  saveInProgressActions: {},
  route: {
    formConfig: {
      verifyRequiredPrefill: true,
      savedFormMessages: [],
    },
    pageList: [],
  },
};

const showLegacyComponent = {
  user: {
    login: {
      currentlyLoggedIn: true,
    },
  },
  form: {
    isInLegacySystem: true,
  },
};

const doNotShowLegacyComponent = {
  user: {
    login: {
      currentlyLoggedIn: true,
    },
  },
  form: {
    isInLegacySystem: false,
  },
};

const globalWin = {
  location: {
    pathname: '/introduction',
    replace: () => {},
  },
};

describe('IntroductionPage', () => {
  it('should render CallToActionWidget', () => {
    const oldWindow = global.window;
    global.window = globalWin;

    const tree = shallow(<IntroductionPage {...defaultProps} />);

    const callToActionWidget = tree.find('Connect(CallToActionWidget)');
    expect(callToActionWidget.length).to.equal(1);
    expect(callToActionWidget.first().props().appId).to.equal(
      'higher-level-review',
    );
    tree.unmount();

    global.window = oldWindow;
  });

  it('should render WithdrawFromLegacySystem', () => {
    const oldWindow = global.window;
    global.window = globalWin;

    const props = { ...defaultProps, ...showLegacyComponent };
    const tree = shallow(<IntroductionPage {...props} />);

    const withdrawFromLegacySystem = tree.find('WithdrawFromLegacySystem');
    expect(withdrawFromLegacySystem.length).to.equal(1);
    expect(withdrawFromLegacySystem.first().props().appId).to.equal(
      'withdraw-from-legacy-appeal-system',
    );
    tree.unmount();

    global.window = oldWindow;
  });

  it('should not render WithdrawFromLegacySystem if withdrawn', () => {
    const oldWindow = global.window;
    global.window = globalWin;

    const props = { ...defaultProps, ...doNotShowLegacyComponent };
    const tree = shallow(<IntroductionPage {...props} />);

    const withdrawFromLegacySystem = tree.find('WithdrawFromLegacySystem');
    expect(withdrawFromLegacySystem.length).to.equal(0);
    tree.unmount();

    global.window = oldWindow;
  });
});
