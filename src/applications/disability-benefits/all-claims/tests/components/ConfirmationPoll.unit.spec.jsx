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
        ? { first: 'Foo', middle: 'Man', last: 'Choo', suffix }
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

describe('ConfirmationPoll', () => {
  const defaultProps = {
    jobId: '12345',
    fullName: { first: 'asdf', last: 'fdsa' },
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

  it('should continue to make api calls until the response is not pending', done => {
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
    // Should stop after the first success
    setTimeout(() => {
      expect(global.fetch.callCount).to.equal(3);
      form.unmount();
      done();
    }, 50);
  });

  it('should render the confirmation page', done => {
    mockApiRequest(successResponse.response);
    const tree = shallow(<ConfirmationPoll {...defaultProps} pollRate={10} />);
    setTimeout(() => {
      // Without this update, it wasn't catching the last render even though the function was running first
      tree.update();
      const confirmationPage = tree.find('ConfirmationPage');
      expect(confirmationPage.length).to.equal(1);
      expect(confirmationPage.first().props()).to.eql({
        submissionStatus: submissionStatuses.succeeded,
        claimId: '123abc',
        jobId: defaultProps.jobId,
        fullName: defaultProps.fullName,
        disabilities: defaultProps.disabilities,
        submittedAt: defaultProps.submittedAt,
        isSubmittingBDD: defaultProps.isSubmittingBDD,
        route: defaultProps.route,
      });
      tree.unmount();
      done();
    }, 500);
  });

  it('should display loading message', done => {
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
    setTimeout(() => {
      const alert = form.find('va-loading-indicator');
      expect(alert.html()).to.contain('Preparing your submission');
      form.unmount();
      done();
    }, 50);
  });

  it('should ignore immediate api failures', done => {
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
    setTimeout(() => {
      expect(global.fetch.callCount).to.equal(4);
      const loadingIndicator = form.find('va-loading-indicator');
      expect(loadingIndicator.length).to.equal(1);
      form.unmount();
      done();
    }, 50);
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
