import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import MissingApplicationHelp from '../../../components/benefit-application-drafts/MissingApplicationHelp';

const mockStore = (toggles = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
      ...toggles,
    },
  }),
  dispatch: () => {},
  subscribe: () => () => {},
});

describe('MissingApplicationHelp', () => {
  describe('when decision reviews feature toggle is off', () => {
    it('should not render the decision reviews forms in the list', () => {
      const { container } = render(
        <Provider store={mockStore()}>
          <MissingApplicationHelp displayDecisionReviewsForms={false} />
        </Provider>,
      );

      const drForms = container.querySelectorAll('[data-testid="dr-forms"]');
      expect(drForms.length).to.equal(0);
    });
  });

  describe('when decision reviews feature toggle is on', () => {
    it('should render the decision reviews forms in the list', () => {
      const { container } = render(
        <Provider store={mockStore()}>
          <MissingApplicationHelp displayDecisionReviewsForms />
        </Provider>,
      );

      const drForms = container.querySelectorAll('[data-testid="dr-forms"]');
      expect(drForms.length).to.equal(4);
    });
  });
});
