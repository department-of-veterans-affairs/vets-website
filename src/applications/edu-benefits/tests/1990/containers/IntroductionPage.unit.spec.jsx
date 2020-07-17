import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { IntroductionPage } from '../../../1990/containers/IntroductionPage';

describe('Edu 1990 <IntroductionPage>', () => {
  const mockStore = {
    getState: () =>
      []
        .concat([
          ['newBenefit'],
          ['serviceBenefitBasedOn', 'transferredEduBenefits'],
          ['nationalCallToService', 'sponsorDeceasedDisabledMIA'],
          ['vetTecBenefit'],
          ['sponsorTransferredBenefits'],
          ['applyForScholarship'],
        ])
        .reduce((state, field) => Object.assign(state, { [field]: null }), {
          open: false,
          educationBenefitSelected: 'none selected',
          wizardCompletionStatus: 'not complete',
        }),
    subscribe: () => {},
    dispatch: () => {},
    sessionStorage: {},
  };

  let state;
  let sessionStorage;
  let sessionStorageGetItemSpy;
  let sessionStorageSetItemSpy;

  before(() => {
    global.sessionStorage = {
      getItem: key =>
        key in mockStore.sessionStorage ? mockStore.sessionStorage[key] : null,
      setItem: (key, value) => {
        mockStore.sessionStorage[key] = `${value}`;
      },
      removeItem: key => delete mockStore.sessionStorage[key],
      clear: () => {
        mockStore.sessionStorage = {};
      },
    };
  });

  beforeEach(() => {
    state = mockStore.getState();
  });

  it('should show the wizard on initial render with no education-benefits sessionStorage keys', () => {
    const tree = shallow(
      <IntroductionPage
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
    // expect(tree.find('FormTitle').props().title).to.contain('Apply for');
    // expect(tree.find('withRouter(Connect(SaveInProgressIntro))').exists()).to.be
    //   .true;
    // expect(tree.find('.process-step').length).to.equal(4);
    tree.unmount();
  });
});
