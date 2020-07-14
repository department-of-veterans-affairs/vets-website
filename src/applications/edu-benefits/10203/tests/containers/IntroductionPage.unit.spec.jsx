import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../containers/IntroductionPage';
import { getRemainingEntitlement } from '../../actions/post-911-gib-status';

describe('Edu 10203 <IntroductionPage>', () => {
  it('should render', () => {
    const tree = shallow(
      <IntroductionPage
        getRemainingEntitlement={getRemainingEntitlement}
        route={{
          formConfig: {},
        }}
        saveInProgress={{
          user: {
            login: {},
            profile: {
              services: [],
            },
          },
        }}
      />,
    );

    expect(tree.find('FormTitle').props().title).to.contain('Apply');
    expect(tree.find('withRouter(Connect(SaveInProgressIntro))').exists()).to.be
      .true;
    expect(tree.find('.process-step').length).to.equal(5);
    tree.unmount();
  });

  it('should show entitlement remaining alert', () => {
    const enrollmentDataGreaterThan180 = {
      remainingEntitlement: { months: 6, days: 3 },
    };

    const tree = shallow(
      <IntroductionPage
        isLoggedIn
        enrollmentData={enrollmentDataGreaterThan180}
        getRemainingEntitlement={getRemainingEntitlement}
        route={{
          formConfig: {},
        }}
      />,
    );
    expect(tree.find('.usa-alert-warning').exists()).to.be.true;
    tree.unmount();
  });

  it('should not show entitlement remaining alert', () => {
    const enrollmentDataLessThan180 = {
      remainingEntitlement: { months: 1, days: 3 },
    };

    const tree = shallow(
      <IntroductionPage
        isLoggedIn
        enrollmentData={enrollmentDataLessThan180}
        getRemainingEntitlement={getRemainingEntitlement}
        route={{
          formConfig: {},
        }}
      />,
    );
    expect(tree.find('.usa-alert-warning').exists()).to.be.false;
    tree.unmount();
  });
});
