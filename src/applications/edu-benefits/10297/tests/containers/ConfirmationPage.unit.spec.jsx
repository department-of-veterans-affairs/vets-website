import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';

import formConfig from '../../config/form';
import { ConfirmationPage } from '../../containers/ConfirmationPage';
import * as maximalJson from '../fixtures/data/maximal-test.json';

before(() => {
  if (!global.scrollTo) global.scrollTo = () => {};
});

const noop = () => {};

const getPage = (claimStatus = null) =>
  render(
    <ConfirmationPage
      route={{ formConfig }}
      claimStatus={claimStatus}
      getClaimStatus={noop}
      sendConfirmation={noop}
      userEmail="test@va.gov"
      userFirstName="John"
      formData={maximalJson.data}
    />,
  );

describe('<ConfirmationPage />', () => {
  afterEach(cleanup);

  it('shows loading indicator when claimStatus is not available', () => {
    const { container } = getPage(null);
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('shows success alert for ELIGIBLE status', () => {
    const { container } = getPage({
      claimStatus: 'ELIGIBLE',
      receivedDate: '2025-08-01',
    });
    const successAlert = container.querySelector('va-alert');

    expect(successAlert).to.have.attribute('status', 'success');
    expect(successAlert.innerHTML).to.include('approved');
  });

  it('shows info alert for DENIED status', () => {
    const { container } = getPage({
      claimStatus: 'DENIED',
      receivedDate: '2025-08-01',
    });
    const infoAlert = container.querySelector('va-alert');

    expect(infoAlert).to.have.attribute('status', 'info');
    expect(infoAlert.innerHTML).to.include('not eligible');
  });

  it('shows under review for INPROGRESS status', () => {
    const { container } = getPage({
      claimStatus: 'INPROGRESS',
      receivedDate: '2025-08-01',
    });
    const successAlert = container.querySelector('va-alert');

    expect(successAlert).to.have.attribute('status', 'success');
    expect(successAlert.innerHTML).to.include('received your application');
  });

  it('shows the chapter section collection/summary accordion', () => {
    const { container } = getPage({
      claimStatus: 'ELIGIBLE',
      receivedDate: '2025-08-01',
    });
    const accordion = container.querySelector('va-accordion');

    expect(accordion).to.exist;
    expect(accordion.querySelectorAll('va-accordion-item').length).to.equal(1);
  });

  it('shows button to print page', () => {
    const { container } = getPage({
      claimStatus: 'ELIGIBLE',
      receivedDate: '2025-08-01',
    });
    const printButton = container.querySelector(
      'va-button[text="Print this page for your records"]',
    );

    expect(printButton).to.exist;
  });

  it('shows process list section', () => {
    const { container } = getPage({
      claimStatus: 'ELIGIBLE',
      receivedDate: '2025-08-01',
    });

    expect(container.querySelector('va-process-list')).to.exist;
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
  });

  it('shows action link to return to VA.gov homepage', () => {
    const { container } = getPage({
      claimStatus: 'ELIGIBLE',
      receivedDate: '2025-08-01',
    });

    expect(container.querySelector('va-link-action')).to.have.attribute(
      'text',
      'Go back to VA.gov homepage',
    );
  });

  it('defaults to under review when claimStatus is ERROR', () => {
    const { container } = getPage({
      claimStatus: 'ERROR',
      receivedDate: '2025-08-01',
    });
    const successAlert = container.querySelector('va-alert');

    expect(successAlert).to.have.attribute('status', 'success');
    expect(successAlert.innerHTML).to.include('received your application');
  });
});
