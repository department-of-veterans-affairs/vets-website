import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import VerifyApp from '../../containers/VerifyApp';

describe('VerifyApp Component', () => {
  it('sets the correct document title', async () => {
    renderInReduxProvider(<VerifyApp />);

    await waitFor(() => {
      expect(document.title).to.eql('Verify your identity');
    });
  });
});
