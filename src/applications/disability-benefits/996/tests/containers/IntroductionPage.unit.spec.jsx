import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { IntroductionPage } from '../../components/IntroductionPage';
import formConfig from '../../config/form';

import { FETCH_CONTESTABLE_ISSUES_INIT } from '../../actions';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

const defaultProps = {
  getContestableIssues: () => {},
  testHlr: true,
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
  let oldWindow;
  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, globalWin);
  });
  afterEach(() => {
    global.window = oldWindow;
    sessionStorage.removeItem(WIZARD_STATUS);
  });

  it('should render CallToActionWidget', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const tree = shallow(<IntroductionPage {...defaultProps} />);

    const callToActionWidget = tree.find('Connect(CallToActionWidget)');
    expect(callToActionWidget.length).to.equal(2);
    expect(callToActionWidget.first().props().appId).to.equal(
      'higher-level-review',
    );
    tree.unmount();
  });

  it('should render alert showing a server error', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [],
        status: '',
        error: {
          errors: [{ title: 'We can’t load your issues' }],
        },
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);

    const AlertBox = tree.find('AlertBox').first();
    expect(AlertBox.render().text()).to.include('can’t load your issues');
    tree.unmount();
  });
  it('should render alert showing no contestable issues', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
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
    expect(AlertBox.render().text()).to.include(
      'don’t have any issues on file for you',
    );
    tree.unmount();
  });
  it('should render start button', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
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
  });
  it('should include start button with form event', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
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
    expect(Intro.props().children.props.gaStartEventName).to.equal(
      `${formConfig.trackingPrefix}start-form`,
    );
    tree.unmount();
  });

  it('should show contestable issue loading indicator', () => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [{}],
        status: FETCH_CONTESTABLE_ISSUES_INIT,
        error: '',
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);

    const Intro = tree.find('Connect(CallToActionWidget)').first();
    expect(Intro.props().children.props.message).to.contain(
      'Loading your contestable issues',
    );
    tree.unmount();
  });

  // Wizard
  it('should render wizard', () => {
    sessionStorage.removeItem(WIZARD_STATUS);
    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [{}],
        status: '',
        error: '',
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);
    expect(tree.find('FormTitle')).to.have.lengthOf(1);
    expect(tree.find('WizardContainer')).to.have.lengthOf(1);
    expect(tree.find('Connect(CallToActionWidget)')).to.have.lengthOf(0);
    tree.unmount();
  });
});
