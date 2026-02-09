import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { StemClaimStatusPage } from '../../containers/StemClaimStatusPage';
import { renderWithRouter } from '../utils';

const documentTitle =
  'Your Edith Nourse Rogers STEM Scholarship application | Veterans Affairs';

const store = createStore(() => ({}));

const props = {
  claim: {},
  getStemClaims: () => {},
  loading: false,
  params: { id: 1 },
};

describe('<StemClaimStatusPage>', () => {
  it('should render null when claim empty', () => {
    const { getByText, queryByText, container } = renderWithRouter(
      <Provider store={store}>
        <StemClaimStatusPage {...props} />
      </Provider>,
    );
    expect(
      queryByText(
        "You didn't meet the following criteria for the Rogers STEM Scholarship:",
      ),
    ).to.not.exist;
    expect(document.title).to.equal(documentTitle);
    getByText('We encountered a problem');
    expect($('va-alert', container)).to.exist;
    expect(container.textContent).to.include(
      "We can't access your claim right now",
    );
  });

  it('should render null when claim is null', () => {
    const { getByText, queryByText, container } = renderWithRouter(
      <Provider store={store}>
        <StemClaimStatusPage {...props} claim={null} />
      </Provider>,
    );
    expect(
      queryByText(
        "You didn't meet the following criteria for the Rogers STEM Scholarship:",
      ),
    ).to.not.exist;
    expect(document.title).to.equal(documentTitle);
    getByText('We encountered a problem');
    expect($('va-alert', container)).to.exist;
    expect(container.textContent).to.include(
      "We can't access your claim right now",
    );
  });

  it('should render empty content when loading', () => {
    const { container, queryByText } = renderWithRouter(
      <Provider store={store}>
        <StemClaimStatusPage {...props} loading />
      </Provider>,
    );
    expect(
      queryByText(
        'You didn’t meet the following criteria for the Rogers STEM Scholarship:',
      ),
    ).to.not.exist;
    expect(document.title).to.equal(documentTitle);
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render stem denied details ', () => {
    const claim = {
      type: 'education_benefits_claims',
      attributes: {
        confirmationNumber: 'V-EBC-9043',
        isEnrolledStem: true,
        isPursuingTeachingCert: null,
        benefitLeft: 'moreThanSixMonths',
        remainingEntitlement: null,
        automatedDenial: true,
        deniedAt: '2024-01-31T15:08:20.489Z',
        submittedAt: '2024-01-31T15:08:20.489Z',
      },
    };
    const { queryByText } = renderWithRouter(
      <Provider store={store}>
        <StemClaimStatusPage {...props} claim={claim} />
      </Provider>,
    );
    expect(queryByText('Your application was denied on Jan. 31, 2024')).to
      .exist;
    expect(
      queryByText(
        'You didn’t meet the following criteria for the Rogers STEM Scholarship:',
      ),
    ).to.exist;
    expect(document.title).to.equal(documentTitle);
  });
});
