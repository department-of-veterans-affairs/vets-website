import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../containers/IntroductionPage';

describe('Edu 10203 <IntroductionPage>', () => {
  it('should render', () => {
    const tree = shallow(
      <IntroductionPage
        getRemainingEntitlement={() => {}}
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
    expect(tree.find('Connect(SaveInProgressIntro)').exists()).to.be.true;
    expect(tree.find('.process-step').length).to.equal(5);
    tree.unmount();
  });

  it('should show entitlement remaining alert', () => {
    const remainingEntitlementGreaterThan180 = { months: 6, days: 3 };

    const tree = shallow(
      <IntroductionPage
        isLoggedIn
        remainingEntitlement={remainingEntitlementGreaterThan180}
        getRemainingEntitlement={() => {}}
        useEvss
        route={{
          formConfig: {
            prefillEnabled: false,
            savedFormMessages: '',
          },
          pageList: [],
        }}
      />,
    );

    expect(tree.find('#entitlement-remaining-alert').exists()).to.be.true;
    tree.unmount();
  });

  it('should not show entitlement remaining alert', () => {
    const remainingEntitlementLessThan180 = { months: 1, days: 3 };

    const tree = shallow(
      <IntroductionPage
        isLoggedIn
        remainingEntitlement={remainingEntitlementLessThan180}
        getRemainingEntitlement={() => {}}
        useEvss
        route={{
          formConfig: {
            prefillEnabled: false,
            savedFormMessages: '',
          },
          pageList: [],
        }}
      />,
    );
    expect(tree.find('#entitlement-remaining-alert').exists()).to.be.false;
    tree.unmount();
  });

  it('should not show entitlement remaining alert if evss disabled', () => {
    const remainingEntitlementLessThan180 = { months: 1, days: 3 };

    const tree = shallow(
      <IntroductionPage
        isLoggedIn
        remainingEntitlement={remainingEntitlementLessThan180}
        getRemainingEntitlement={() => {}}
        useEvss={false}
        route={{
          formConfig: {
            prefillEnabled: false,
            savedFormMessages: '',
          },
          pageList: [],
        }}
      />,
    );
    expect(tree.find('#entitlement-remaining-alert').exists()).to.be.false;
    tree.unmount();
  });
});
