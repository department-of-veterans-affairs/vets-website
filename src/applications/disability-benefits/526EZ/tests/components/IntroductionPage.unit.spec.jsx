import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../components/IntroductionPage';

const defaultProps = {
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
  it('should render FormStartControls', () => {
    const tree = shallow(<IntroductionPage {...defaultProps} />);
    const formStartControls = tree.find('FormStartControls');
    expect(formStartControls.length).to.equal(2);
    expect(formStartControls.first().props().gaStartEventName).to.equal(
      'disability-526EZ-start',
    );
  });
});
