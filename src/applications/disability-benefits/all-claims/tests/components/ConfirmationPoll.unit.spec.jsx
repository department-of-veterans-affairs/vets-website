import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { submissionStatuses } from '../../constants';
import {
  ConfirmationPoll,
  selectAllDisabilityNames,
} from '../../components/ConfirmationPoll';
import formConfig from '../../config/form';

const middleware = [thunk];
const mockStore = configureStore(middleware);

const getData = ({ renderName = true, suffix = 'Esq.' } = {}) => ({
  user: {
    profile: {
      userFullName: renderName
        ? { first: 'Foo', middle: 'Man', last: 'Smith', suffix }
        : {},
    },
  },
});

const pendingResponse = {
  shouldResolve: true,
  response: {
    data: {
      attributes: {
        status: submissionStatuses.pending,
      },
    },
  },
};

const successResponse = {
  shouldResolve: true,
  response: {
    data: {
      attributes: {
        status: submissionStatuses.succeeded,
        claimId: '123abc',
      },
    },
  },
};

const failureResponse = {
  shouldResolve: true,
  response: {
    data: {
      attributes: {
        status: submissionStatuses.failed,
      },
    },
  },
};

const errorResponse = {
  shouldResolve: true,
  response: {
    errors: [
      {
        title: 'error',
        detail: 'some error',
        code: '401',
        status: 'some status',
      },
    ],
  },
};

// Helper function to wait for polling to complete
const waitForPolling = async (_, expectedCallCount) => {
  const maxAttempts = 10;

  const checkCount = async (attempts = 0) => {
    if (
      global.fetch.callCount >= expectedCallCount ||
      attempts >= maxAttempts
    ) {
      return;
    }

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    await checkCount(attempts + 1);
  };

  await checkCount();
};

describe('ConfirmationPoll', () => {
  const defaultProps = {
    jobId: '12345',
    fullName: { first: 'John', last: 'Doe' },
    disabilities: [],
    submittedAt: Date.now(),
    isSubmittingBDD: false,
    route: {
      formConfig,
      pageList: [],
    },
  };

  it('should make an api call after mounting', () => {
    mockApiRequest(successResponse.response);
    const component = shallow(<ConfirmationPoll />);
    expect(global.fetch.calledOnce).to.be.true;
    component.unmount();
  });

  it('should continue to make api calls until the response is not pending', async () => {
    mockMultipleApiRequests([
      pendingResponse,
      pendingResponse,
      successResponse,
      failureResponse,
    ]);

    const form = mount(
      <Provider store={mockStore(getData())}>
        <ConfirmationPoll {...defaultProps} pollRate={10} />
      </Provider>,
    );

    try {
      // Wait for polling to complete (should stop after the first success)
      await waitForPolling(form, 3);

      expect(global.fetch.callCount).to.equal(3);
    } finally {
      form.unmount();
    }
  });

  it('should render the confirmation page', () => {
    // Test that component renders confirmation page when state is set to succeeded
    const wrapper = shallow(<ConfirmationPoll {...defaultProps} />);

    // Initially should show loading
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);

    // Manually set the state to succeeded (simulating successful API response)
    wrapper.setState({
      submissionStatus: submissionStatuses.succeeded,
      claimId: '123abc',
    });

    // Should now show ConfirmationPage
    const confirmationPage = wrapper.find('ConfirmationPage');
    expect(confirmationPage.length).to.equal(1);
    expect(confirmationPage.props()).to.include({
      submissionStatus: submissionStatuses.succeeded,
      claimId: '123abc',
      jobId: defaultProps.jobId,
      fullName: defaultProps.fullName,
      disabilities: defaultProps.disabilities,
      submittedAt: defaultProps.submittedAt,
      isSubmittingBDD: defaultProps.isSubmittingBDD,
    });

    wrapper.unmount();
  });

  it('should display loading message', async () => {
    mockApiRequest(pendingResponse.response);

    const form = mount(
      <Provider
        store={mockStore(
          getData({
            disability526NewConfirmationPage: true,
          }),
        )}
      >
        <ConfirmationPoll {...defaultProps} pollRate={10} longWaitTime={10} />
      </Provider>,
    );

    // Wait for initial render with loading state
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    form.update();

    const alert = form.find('va-loading-indicator');
    expect(alert.html()).to.contain('Preparing your submission');
    form.unmount();
  });

  it('should ignore immediate api failures', async () => {
    mockMultipleApiRequests([
      errorResponse,
      pendingResponse,
      pendingResponse,
      successResponse,
    ]);

    const form = mount(
      <Provider store={mockStore(getData())}>
        <ConfirmationPoll {...defaultProps} pollRate={10} delayFailure={20} />
      </Provider>,
    );

    try {
      // Wait for all API calls to complete
      await waitForPolling(form, 4);

      expect(global.fetch.callCount).to.equal(4);
      const loadingIndicator = form.find('va-loading-indicator');
      expect(loadingIndicator.length).to.equal(1);
    } finally {
      form.unmount();
    }
  });

  describe('selectAllDisabilityNames', () => {
    it('should return selected rated disability names', () => {
      const state = {
        form: {
          data: {
            ratedDisabilities: [
              {
                'view:selected': true,
                name: 'first rated disability',
              },
              {
                'view:selected': false,
                name: 'second rated disability',
              },
              {
                'view:selected': true,
                name: 'third rated disability',
              },
              {
                'view:selected': false,
                name: 'fourth rated disability',
              },
            ],
          },
        },
      };

      const selectedDisabilities = selectAllDisabilityNames(state);
      const { ratedDisabilities } = state.form.data;

      expect(selectedDisabilities).to.deep.equal([
        ratedDisabilities[0].name,
        ratedDisabilities[2].name,
      ]);
    });

    it('should return new disability names', () => {
      const state = {
        form: {
          data: {
            newDisabilities: [
              {
                condition: 'first new disability',
              },
              {
                condition: 'second new disability',
              },
            ],
          },
        },
      };

      const selectedDisabilities = selectAllDisabilityNames(state);
      const { newDisabilities } = state.form.data;

      expect(selectedDisabilities).to.deep.equal([
        newDisabilities[0].condition,
        newDisabilities[1].condition,
      ]);
    });

    it('should return both rated and new disabilities', () => {
      const state = {
        form: {
          data: {
            newDisabilities: [
              {
                condition: 'first new disability',
              },
              {
                condition: 'second new disability',
              },
            ],
            ratedDisabilities: [
              {
                'view:selected': true,
                name: 'first rated disability',
              },
              {
                'view:selected': false,
                name: 'second rated disability',
              },
              {
                'view:selected': true,
                name: 'third rated disability',
              },
              {
                'view:selected': false,
                name: 'fourth rated disability',
              },
            ],
          },
        },
      };

      const selectedDisabilities = selectAllDisabilityNames(state);
      const { newDisabilities, ratedDisabilities } = state.form.data;

      expect(selectedDisabilities).to.deep.equal([
        ratedDisabilities[0].name,
        ratedDisabilities[2].name,
        newDisabilities[0].condition,
        newDisabilities[1].condition,
      ]);
    });
  });
});
