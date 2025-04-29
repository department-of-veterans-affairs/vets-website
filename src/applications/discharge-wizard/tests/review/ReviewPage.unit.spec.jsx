import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewPage from '../../components/ReviewPage';
import { ROUTES } from '../../constants';
import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';

const pushStub = sinon.stub();

const mockStoreStandard = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwForm: {
        form: {
          [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.AIR_FORCE,
          [SHORT_NAME_MAP.DISCHARGE_YEAR]: '2022',
          [SHORT_NAME_MAP.DISCHARGE_MONTH]: null,
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: null,
          [SHORT_NAME_MAP.INTENTION]: null,
          [SHORT_NAME_MAP.COURT_MARTIAL]: null,
          [SHORT_NAME_MAP.PREV_APPLICATION]: null,
          [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]: null,
          [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]:
            RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
          [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]: null,
          [SHORT_NAME_MAP.PRIOR_SERVICE]: null,
        },
        viewedIntroPage: true,
        editMode: false,
        questionFlowChanged: false,
        routeMap: [
          ROUTES.HOME,
          ROUTES.SERVICE_BRANCH,
          ROUTES.REASON,
          ROUTES.PREV_APPLICATION_TYPE,
        ],
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const mockStoreStandardNoIntro = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwForm: {
        form: {
          [SHORT_NAME_MAP.SERVICE_BRANCH]: null,
          [SHORT_NAME_MAP.DISCHARGE_YEAR]: null,
          [SHORT_NAME_MAP.DISCHARGE_MONTH]: null,
          [SHORT_NAME_MAP.REASON]: null,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: null,
          [SHORT_NAME_MAP.INTENTION]: null,
          [SHORT_NAME_MAP.COURT_MARTIAL]: null,
          [SHORT_NAME_MAP.PREV_APPLICATION]: null,
          [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]: null,
          [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]: null,
          [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]: null,
          [SHORT_NAME_MAP.PRIOR_SERVICE]: null,
        },
        viewedIntroPage: false,
        editMode: false,
        questionFlowChanged: false,
        routeMap: [
          ROUTES.HOME,
          ROUTES.SERVICE_BRANCH,
          ROUTES.REASON,
          ROUTES.PREV_APPLICATION_TYPE,
        ],
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsStandard = {
  //   formResponses: {
  //     [SHORT_NAME_MAP.SERVICE_BRANCH]: RESPONSES.AIR_FORCE,
  //     [SHORT_NAME_MAP.DISCHARGE_YEAR]: '2022',
  //     [SHORT_NAME_MAP.DISCHARGE_MONTH]: null,
  //     [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_DD215_UPDATE_TO_DD214,
  //     [SHORT_NAME_MAP.DISCHARGE_TYPE]: null,
  //     [SHORT_NAME_MAP.INTENTION]: null,
  //     [SHORT_NAME_MAP.COURT_MARTIAL]: null,
  //     [SHORT_NAME_MAP.PREV_APPLICATION]: null,
  //     [SHORT_NAME_MAP.PREV_APPLICATION_YEAR]: null,
  //     [SHORT_NAME_MAP.PREV_APPLICATION_TYPE]:
  //       RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY,
  //     [SHORT_NAME_MAP.FAILURE_TO_EXHAUST]: null,
  //     [SHORT_NAME_MAP.PRIOR_SERVICE]: null,
  //   },
  //   router: {
  //     push: pushStub,
  //   },
  //   viewedIntroPage: true,
  //   questionFlowChanged: false,
  //   editMode: false,
  //   toggleEditMode: () => {},
  //   routeMap: [
  //     ROUTES.HOME,
  //     ROUTES.SERVICE_BRANCH,
  //     ROUTES.REASON,
  //     ROUTES.PREV_APPLICATION_TYPE,
  //   ],
};

const propsNoIntroPage = {
  formResponses: {},
  answerChanged: false,
  routeMap: [],
  setQuestionSelectedToEdit: () => {},
  setRouteMap: () => {},
  toggleEditMode: () => {},
  toggleQuestionFlowChanged: () => {},
  viewedIntroPage: false,
  router: {
    push: pushStub,
  },
};

describe('Review Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });
  it('should show the return home without seeing the intro page', () => {
    render(
      <Provider store={mockStoreStandardNoIntro}>
        <ReviewPage {...propsNoIntroPage} />
      </Provider>,
    );
    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
  it('should show the review page component', () => {
    const tree = shallow(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );
    expect(tree.find(ReviewPage)).to.have.lengthOf(1);
    tree.unmount();
  });

  it('should show the correct number of edit links', () => {
    const { container, unmount } = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    const editLinks = container.querySelectorAll(
      "[data-testid*='duw-edit-link']",
    );
    expect(editLinks).to.have.lengthOf(4);
    unmount();
  });

  it('should correctly show the answer to the service branch question', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('answer-SERVICE_BRANCH').textContent).to.equal(
      `I served in the ${RESPONSES.AIR_FORCE}.`,
    );
  });

  it('should correctly show the answer to the reason question', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('answer-REASON').textContent).to.equal(
      RESPONSES.REASON_DD215_UPDATE_TO_DD214,
    );
  });

  it('should correctly show the answer to the prev app type question', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    expect(
      screen.getByTestId('answer-PREV_APPLICATION_TYPE').textContent,
    ).to.equal(RESPONSES.PREV_APPLICATION_DRB_DOCUMENTARY);
  });
});
