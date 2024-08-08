import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
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
});
