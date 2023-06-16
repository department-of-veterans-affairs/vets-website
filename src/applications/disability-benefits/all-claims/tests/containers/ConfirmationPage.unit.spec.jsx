import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ConfirmationPage from '../../containers/ConfirmationPage';
import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../../constants';
import { bddConfirmationHeadline } from '../../content/bddConfirmationAlert';

const retryableErrorTitle =
  "It's taking us longer than expected to submit your claim.";

describe('Disability Benefits 526EZ <ConfirmationPage>', () => {
  const defaultProps = {
    fullName: {
      first: 'First',
      middle: 'M',
      last: 'Last',
      suffix: 'Sr.',
    },
    disabilities: ['something something'],
    submittedAt: '2019-02-20',
  };

  const testPage = status =>
    render(<ConfirmationPage submissionStatus={status} {...defaultProps} />);

  it('should render success status', () => {
    const tree = testPage(submissionStatuses.succeeded);
    tree.getByText('Claim ID number');
  });

  it('should not render success with BDD SHA alert when not submitting BDD claim', () => {
    const { queryByText } = render(
      <ConfirmationPage
        submissionStatus={submissionStatuses.succeeded}
        {...defaultProps}
        isSubmittingBDD={false}
      />,
    );

    expect(queryByText(bddConfirmationHeadline)).to.not.exist;
  });

  it('should render success with BDD SHA alert', () => {
    const tree = render(
      <ConfirmationPage
        submissionStatus={submissionStatuses.succeeded}
        {...defaultProps}
        isSubmittingBDD
      />,
    );
    tree.getByText('Claim ID number');
    tree.getByText(bddConfirmationHeadline);
  });

  it('should render retry status', () => {
    const tree = testPage(submissionStatuses.retry);
    tree.getByText(retryableErrorTitle);
  });

  it('should render exhausted status', () => {
    const tree = testPage(submissionStatuses.exhausted);
    tree.getByText(retryableErrorTitle);
  });

  it('should render apiFailure status', () => {
    const tree = testPage(submissionStatuses.apiFailure);
    tree.getByText(retryableErrorTitle);
  });

  it('should render retryable failure with BDD SHA alert', () => {
    const tree = render(
      <ConfirmationPage
        submissionStatus={submissionStatuses.apiFailure}
        {...defaultProps}
        isSubmittingBDD
      />,
    );

    tree.getByText(
      'Submit your Separation Health Assessment - Part A Self-Assessment now if you haven’t already',
    );
  });

  it('should render other status', () => {
    const tree = testPage(submissionStatuses.failed);
    tree.getByText(
      'We’re sorry. Something went wrong when we tried to submit your claim.',
    );
  });

  it('should render note about email', () => {
    const props = {
      ...defaultProps,
    };

    const tree = render(
      <ConfirmationPage
        submissionStatus={submissionStatuses.succeeded}
        {...props}
      />,
    );

    tree.getByText(
      'We’ll send you an email to confirm that we received your claim.',
    );
  });

  it('should not render email message when there is an error', () => {
    const props = {
      ...defaultProps,
      submissionStatus: submissionStatuses.failed,
    };

    const tree = render(<ConfirmationPage {...props} />);

    expect(
      tree.queryByText(
        'We’ll send you an email to confirm that we received your claim.',
      ),
    ).to.be.null;
  });

  it('should reset wizard state & values', () => {
    sessionStorage.setItem(WIZARD_STATUS, 'a');
    sessionStorage.setItem(FORM_STATUS_BDD, 'b');
    sessionStorage.setItem(SAVED_SEPARATION_DATE, 'c');

    const tree = testPage(submissionStatuses.succeeded);
    tree.getByText('Claim ID number');
    expect(sessionStorage.getItem(WIZARD_STATUS)).to.be.null;
    expect(sessionStorage.getItem(FORM_STATUS_BDD)).to.be.null;
    expect(sessionStorage.getItem(SAVED_SEPARATION_DATE)).to.be.null;
    tree.unmount();
  });
});
