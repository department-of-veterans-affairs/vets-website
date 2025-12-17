import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FEATURE_FLAGS from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  createPageList,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage'; // Use default export (connected component)

const defaultState = {
  form: {
    formId: formConfig.formId,
    loadedData: {
      metadata: {},
    },
  },
  user: {
    login: {
      currentlyLoggedIn: false,
    },
    profile: {
      loa: { current: 1 },
    },
  },
  data: {},
  featureToggles: {},
};

const createMockStore = state => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: () => {},
});

const formPages = createFormPageList(formConfig);
const pageList = createPageList(formConfig, formPages);

const defaultRoute = {
  pageList,
  formConfig,
};

const renderIntroductionPage = store => {
  return render(
    <Provider store={store}>
      <IntroductionPage route={defaultRoute} />
    </Provider>,
  );
};

describe('<IntroductionPage />', () => {
  it('should render v1', () => {
    const store = createMockStore(defaultState);

    const { container } = renderIntroductionPage(store);

    expect(container).to.exist;
  });

  it('should render v2', () => {
    const state = {
      ...defaultState,
      featureToggles: {
        ...defaultState.featureToggles,
        [FEATURE_FLAGS.showMeb54901990eTextUpdate]: true,
      },
    };

    const store = createMockStore(state);

    const { container } = renderIntroductionPage(store);

    expect(container).to.exist;
  });

  it('should render v3', () => {
    const state = {
      ...defaultState,
      featureToggles: {
        ...defaultState.featureToggles,
        [FEATURE_FLAGS.meb1995Reroute]: true,
      },
    };

    const store = createMockStore(state);

    const { container } = renderIntroductionPage(store);

    expect(container).to.exist;
  });

  it('should handle va-omb-info spacing when user.loging.currentlyLoggedIn', () => {
    const state = {
      ...defaultState,
      user: {
        ...defaultState.user,
        login: {
          currentlyLoggedIn: true,
        },
      },
    };

    const store = createMockStore(state);

    const { container } = renderIntroductionPage(store);

    const ombInfoContainer = container.querySelector('.omb-info--container');
    expect(ombInfoContainer.className).to.include('vads-u-margin-top--4');
  });
});
