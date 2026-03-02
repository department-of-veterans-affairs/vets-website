import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from '../../../helpers';
import { TrustSupplementaryFormsAlert } from '../../../components/FormAlerts';

describe('pension <TrustSupplementaryFormsAlert>', () => {
  let showUpdatedContentStub;

  beforeEach(() => {
    showUpdatedContentStub = sinon.stub(helpers, 'showUpdatedContent');
  });

  afterEach(() => {
    if (showUpdatedContentStub && showUpdatedContentStub.restore) {
      showUpdatedContentStub.restore();
    }
  });

  it('should render when trusts are present and showUpdatedContent is false', () => {
    showUpdatedContentStub.returns(false);

    const { container } = render(
      <TrustSupplementaryFormsAlert formData={{ trusts: [{}] }} />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'info');
    expect(container.textContent).to.include('Additional documents needed');
    expect(container.textContent).to.include(
      'You’ve added a trust, so you’ll need to submit supporting documents.',
    );
  });

  it('should not render when trusts are empty', () => {
    showUpdatedContentStub.returns(false);

    const { container } = render(
      <TrustSupplementaryFormsAlert formData={{ trusts: [] }} />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('should not render when formData is undefined', () => {
    showUpdatedContentStub.returns(false);

    const { container } = render(<TrustSupplementaryFormsAlert />);

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('should render when showUpdatedContent is true and a trust is incomplete', () => {
    showUpdatedContentStub.returns(true);

    const { container } = render(
      <TrustSupplementaryFormsAlert
        formData={{ trusts: [{ 'view:addFormQuestion': false }] }}
      />,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(container.textContent).to.include(
      'You added a trust but didn’t upload documents to show:',
    );
  });

  it('should not render when showUpdatedContent is true and all trusts are complete', () => {
    showUpdatedContentStub.returns(true);

    const { container } = render(
      <TrustSupplementaryFormsAlert
        formData={{
          trusts: [
            {
              'view:addFormQuestion': true,
              uploadedDocuments: [{ name: 'document.jpg' }],
            },
            {
              'view:addFormQuestion': true,
              uploadedDocuments: [{ name: 'document.jpg' }],
            },
          ],
        }}
      />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
  });
});
