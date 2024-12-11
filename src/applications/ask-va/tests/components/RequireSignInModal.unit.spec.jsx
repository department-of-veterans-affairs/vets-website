import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import RequireSignInModal from '../../components/RequireSignInModal';

describe('RequireSignInModal Component', () => {
  // TODO - refactor this test once sign in modal is working and finalized
  it.skip('should render the modal with the correct content', () => {
    const { container } = render(
      <RequireSignInModal show onClose={() => {}} restrictedItem="Topic A" />,
    );

    expect($('p', container).textContent).to.eq(
      `Because your question is about this Topic A, you need to sign in. When you sign in, we can communicate with you securely about the specific details of your benefits.`,
    );
  });
});
