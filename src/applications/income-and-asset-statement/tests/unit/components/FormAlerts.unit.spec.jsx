import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { TrustSupplementaryFormsAlert } from '../../../components/FormAlerts';

describe('pension <TrustSupplementaryFormsAlert>', () => {
  it('should render when a trust is incomplete', () => {
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

  it('should not render when all trusts are complete', () => {
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
