import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { VA_FORM_IDS } from 'platform/forms/constants';

import IntroductionPage from '../../containers/IntroductionPage';

const defaultProps = {
  user: {
    profile: {
      // need to have a saved form or else form will redirect to v2
      savedForms: [
        {
          form: VA_FORM_IDS.FORM_10182,
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

describe('IntroductionPage', () => {
  it('should render', () => {
    const tree = shallow(<IntroductionPage {...defaultProps} />);
    const intro = tree.find('Connect(SaveInProgressIntro)');
    expect(intro).to.exist;

    tree.unmount();
  });

  it('should render SaveInProgressIntro', () => {
    const tree = shallow(<IntroductionPage {...defaultProps} />);
    const saveInProgressIntro = tree.find(
      'withRouter(Connect(SaveInProgressIntro))',
    );
    expect(saveInProgressIntro.length).to.equal(2);

    tree.unmount();
  });

  it('should render start button', () => {
    const props = {
      ...defaultProps,
      contestableIssues: {
        issues: [{}],
        status: 'done',
        error: '',
      },
    };

    const tree = shallow(<IntroductionPage {...props} />);
    const saveInProgressIntro = tree
      .find('withRouter(Connect(SaveInProgressIntro))')
      .first();
    expect(saveInProgressIntro.props().startText).to.include(
      'Start the Application',
    );

    tree.unmount();
  });
});
