import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../components/IntroductionPage';

const defaultProps = {
  user: {
    profile: {
      // need to have a saved form or else form will redirect to v2
      savedForms: [
        {
          form: '21-526EZ',
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
  it('should render SaveInProgressIntro', () => {
    const oldWindow = global.window;
    global.window = { location: { replace: () => {} } };

    const tree = shallow(<IntroductionPage {...defaultProps} />);
    const formStartControls = tree.find('FormStartControls');
    expect(formStartControls.length).to.equal(2);
    expect(formStartControls.first().props().gaStartEventName).to.equal(
      'disability-526EZ-start',
    );
    tree.unmount();

    global.window = oldWindow;
  });
});
