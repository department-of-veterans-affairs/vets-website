import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import VerifyApp from '../../containers/VerifyApp';

describe('VerifyApp Component', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('sets the correct document title', async () => {
    renderInReduxProvider(<VerifyApp />);

    await waitFor(() => {
      expect(document.title).to.eql('Verify your identity');
    });
  });

  it('renders the UnauthenticatedVerify component', async () => {
    const { getByTestId } = renderInReduxProvider(<VerifyApp />);

    await waitFor(() => {
      expect(getByTestId('unauthenticated-verify-app')).to.exist;
    });
  });
});
