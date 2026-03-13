import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CustomReviewTopContent from '../../components/CustomReviewTopContent';

const buildState = ({
  disability526NewBddShaEnforcementWorkflowEnabled = true,
} = {}) => ({
  form: {
    data: {
      disability526NewBddShaEnforcementWorkflowEnabled,
    },
  },
});

const renderComponent = state => {
  const store = createStore(() => state);
  return render(
    <Provider store={store}>
      <CustomReviewTopContent />
    </Provider>,
  );
};

function assertShaAlertExists({ container, getByText }) {
  getByText('A Separation Health Assessment (SHA) Part A is required');
  getByText(/If you do not include a SHA Part A/);
  const link = container.querySelector('va-link');
  expect(link).to.exist;
  expect(link.getAttribute('text')).to.equal(
    "Check if you've uploaded a SHA Part A document",
  );
}

function assertShaAlertNotExists({ container, queryByText }) {
  expect(queryByText('A Separation Health Assessment (SHA) Part A is required'))
    .to.not.exist;
  expect(queryByText(/If you do not include a SHA Part A/)).to.not.exist;
  expect(container.querySelector('va-link')).to.not.exist;
}

describe('CustomReviewTopContent', () => {
  it('renders the SHA alert when feature flag is enabled', () => {
    const state = buildState();

    const result = renderComponent(state);

    expect(result.container.querySelector('va-alert')).to.exist;
    assertShaAlertExists(result);
  });

  it('does not render the SHA alert when feature flag is disabled', () => {
    const state = buildState({
      disability526NewBddShaEnforcementWorkflowEnabled: false,
    });

    const result = renderComponent(state);

    assertShaAlertNotExists(result);
  });
});
