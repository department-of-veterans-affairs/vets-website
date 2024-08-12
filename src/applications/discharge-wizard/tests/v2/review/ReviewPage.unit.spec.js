import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewPage from '../../../components/v2/ReviewPage';

const pushSpyStandard = sinon.spy();

const mockStoreStandard = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwForm: {
        form: {},
        viewedIntroPage: true,
        editMode: false,
        questionFlowChanged: false,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsStandard = {
  formResponses: {
    SERVICE_BRANCH: 'Air Force',
    DISCHARGE_YEAR: '2022',
    DISCHARGE_MONTH: null,
    REASON:
      'I received a DD215 that shows my discharge upgrade or correction. But I want an updated DD214.',
    DISCHARGE_TYPE: null,
    INTENTION: null,
    COURT_MARTIAL: null,
    PREV_APPLICATION: null,
    PREV_APPLICATION_YEAR: null,
    PREV_APPLICATION_TYPE:
      'I applied to a Discharge Review Board (DRB) for a Documentary Review.',
    FAILURE_TO_EXHAUST: null,
    PRIOR_SERVICE: null,
    REVIEW: null,
  },
  router: {
    push: pushSpyStandard,
  },
  viewedIntroPage: true,
  questionFlowChanged: false,
  editMode: false,
  toggleEditMode: () => {},
};

describe('Review Page', () => {
  it('should correctly load the review page', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('label-SERVICE_BRANCH').textContent).to.equal(
      'Air Force',
    );
    expect(screen.getByTestId('label-DISCHARGE_YEAR').textContent).to.equal(
      '2022',
    );
    expect(screen.getByTestId('label-REASON').textContent).to.equal(
      'I received a DD215 that shows my discharge upgrade or correction. But I want an updated DD214.',
    );
    expect(
      screen.getByTestId('label-PREV_APPLICATION_TYPE').textContent,
    ).to.equal(
      'I applied to a Discharge Review Board (DRB) for a Documentary Review.',
    );
  });
});
