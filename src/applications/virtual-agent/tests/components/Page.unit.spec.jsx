import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import Page from '../../components/Page';

// eslint-disable-next-line no-unused-vars
function getData({ virtualAgentShowFloatingChatbot, isLoading }) {
  return {
    props: {
      virtualAgentShowFloatingChatbot,
    },
    mockStore: {
      getState: () => ({
        featureToggles: [
          {
            [FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot]: virtualAgentShowFloatingChatbot,
          },
        ],
        isLoading,
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  };
}

describe('Page', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.reset();
  });

  it('renders the loading indicator', () => {
    const { props, mockStore } = getData({
      virtualAgentShowFloatingChatbot: false,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <Page {...props} />
      </Provider>,
    );

    // expect(getByTestId('page')).toBeInTheDocument(); // Assumes your Page component has a data-testid="page"
  });
  // it('renders the sticky bot', () => {
  //   const store = getStore({
  //     virtualAgentShowFloatingChatbot: true,
  //     isLoading: false,
  //   });
  //   const { getByTestId } = render(
  //     <Provider store={store}>
  //       <Page />
  //     </Provider>,
  //   );

  //   expect(getByTestId('page')).toBeInTheDocument(); // Assumes your Page component has a data-testid="page"
  // });
});
