import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import CustomReviewTopContent from '../../components/CustomReviewTopContent';

const initialState = {
  form: {
    data: {
      startedFormVersion: '2019',
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        {
          cause: 'NEW',
          primaryDescription: 'Test description',
          condition: 'asthma',
          'view:descriptionInfo': {},
        },
      ],
    },
  },
};

describe('CustomReviewTopContent', () => {
  it('renders when startedFormVersion: "2019", claim type of new, and new condition present (success path)', () => {
    const store = createStore(() => initialState);

    const { container, queryByText } = render(
      <Provider store={store}>
        <CustomReviewTopContent />
      </Provider>,
    );

    expect(container.querySelector('va-alert')).to.exist;
    queryByText('We updated our online form');
    queryByText(
      'Your answers may support your claim for disability compensation',
    );
    queryByText('Answer our new questions');
  });

  it('does not render when startedFormVersion: "2019" and cfi only', () => {
    const testState = JSON.parse(JSON.stringify(initialState));
    testState.form.data['view:claimType'] = {
      'view:claimingIncrease': true,
      'view:claimingNew': false,
    };
    testState.form.data.ratedDisabilities = [
      {
        name: 'Diabetes mellitus0',
        ratedDisabilityId: '0',
        ratingDecisionId: '63655',
        diagnosticCode: 5238,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        disabilityActionType: 'NONE',
        'view:selected': true,
      },
    ];
    const store = createStore(() => testState);

    const { container } = render(
      <Provider store={store}>
        <CustomReviewTopContent />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('does not render when startedFormVersion: "2022"', () => {
    const testState = JSON.parse(JSON.stringify(initialState));
    testState.form.data.startedFormVersion = '2022';
    const store = createStore(() => testState);

    const { container } = render(
      <Provider store={store}>
        <CustomReviewTopContent />
      </Provider>,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('does not render when startedFormVersion not present"', () => {
    const testState = JSON.parse(JSON.stringify(initialState));
    testState.form.data.startedFormVersion = undefined;
    const store = createStore(() => testState);

    const { container } = render(
      <Provider store={store}>
        <CustomReviewTopContent />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('does not render when no new conditions"', () => {
    const testState = JSON.parse(JSON.stringify(initialState));
    testState.form.data.newDisabilities = [];
    const store = createStore(() => testState);

    const { container } = render(
      <Provider store={store}>
        <CustomReviewTopContent />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.not.exist;
  });

  describe('newDisabilities initialization', () => {
    const createMockStore = (state, dispatchSpy) => ({
      getState: () => state,
      subscribe: () => {},
      dispatch: dispatchSpy,
    });

    it('should initialize newDisabilities as empty array when claiming new but newDisabilities does not exist', () => {
      const testState = JSON.parse(JSON.stringify(initialState));
      delete testState.form.data.newDisabilities;
      const dispatchSpy = sinon.spy();
      const mockStore = createMockStore(testState, dispatchSpy);

      render(
        <Provider store={mockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      expect(dispatchSpy.calledOnce).to.be.true;
      const dispatchedAction = dispatchSpy.firstCall.args[0];
      expect(dispatchedAction.type).to.equal('SET_DATA');
      expect(dispatchedAction.data.newDisabilities).to.deep.equal([]);
    });

    it('should not initialize newDisabilities if it already exists', () => {
      const testState = JSON.parse(JSON.stringify(initialState));
      testState.form.data.newDisabilities = [];
      const dispatchSpy = sinon.spy();
      const mockStore = createMockStore(testState, dispatchSpy);

      render(
        <Provider store={mockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      expect(dispatchSpy.called).to.be.false;
    });

    it('should not initialize newDisabilities when not claiming new', () => {
      const testState = JSON.parse(JSON.stringify(initialState));
      testState.form.data['view:claimType']['view:claimingNew'] = false;
      delete testState.form.data.newDisabilities;
      const dispatchSpy = sinon.spy();
      const mockStore = createMockStore(testState, dispatchSpy);

      render(
        <Provider store={mockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      expect(dispatchSpy.called).to.be.false;
    });

    it('should only initialize once even if component re-renders', () => {
      const testState = JSON.parse(JSON.stringify(initialState));
      delete testState.form.data.newDisabilities;
      const dispatchSpy = sinon.spy();
      const mockStore = createMockStore(testState, dispatchSpy);

      const { rerender } = render(
        <Provider store={mockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      expect(dispatchSpy.calledOnce).to.be.true;

      // Re-render with same state
      rerender(
        <Provider store={mockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      // Should still only be called once
      expect(dispatchSpy.calledOnce).to.be.true;
    });

    it('should reset initialization ref when claimingNew changes from true to false', () => {
      const testState = JSON.parse(JSON.stringify(initialState));
      delete testState.form.data.newDisabilities;
      const dispatchSpy = sinon.spy();
      const mockStore = createMockStore(testState, dispatchSpy);

      const { rerender } = render(
        <Provider store={mockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      expect(dispatchSpy.calledOnce).to.be.true;

      // Change claimingNew to false
      testState.form.data['view:claimType']['view:claimingNew'] = false;
      const newMockStore = createMockStore(testState, dispatchSpy);

      rerender(
        <Provider store={newMockStore}>
          <CustomReviewTopContent />
        </Provider>,
      );

      // Should still only be called once (no new initialization)
      expect(dispatchSpy.calledOnce).to.be.true;
    });
  });
});
