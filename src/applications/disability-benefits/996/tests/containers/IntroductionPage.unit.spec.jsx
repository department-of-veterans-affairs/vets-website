import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { IntroductionPage } from '../../components/IntroductionPage';

const defaultProps = {
  getContestableIssues: () => {},
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
    expect(callToActionWidget.length).to.equal(2);
    expect(callToActionWidget.first().props().appId).to.equal(
      'higher-level-review',
    );
    tree.unmount();

    global.window = oldWindow;
  });

  it('should render alert showing a server error', () => {
    const oldWindow = global.window;
    global.window = globalWin;

    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [],
        status: '',
        error: {
          errors: [{ title: 'some server error' }],
        },
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);

    const AlertBox = tree.find('AlertBox').first();
    expect(AlertBox.render().text()).to.include('some server error');
    tree.unmount();

    global.window = oldWindow;
  });
  it('should render alert showing no contestable issues', () => {
    const oldWindow = global.window;
    global.window = globalWin;

    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [],
        status: '',
        error: '',
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);

    const AlertBox = tree.find('AlertBox').first();
    expect(AlertBox.render().text()).to.include('No Contestable Issues');
    tree.unmount();

    global.window = oldWindow;
  });
  it('should render start button', () => {
    const oldWindow = global.window;
    global.window = globalWin;

    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [{}],
        status: '',
        error: '',
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);

    const Intro = tree.find('Connect(CallToActionWidget)').first();
    expect(Intro.props().children.props.startText).to.include(
      'Start the Request for a Higher-Level Review',
    );
    tree.unmount();

    global.window = oldWindow;
  });
});
