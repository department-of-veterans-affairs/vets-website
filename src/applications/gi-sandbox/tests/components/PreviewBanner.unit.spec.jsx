import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../helpers';

import { fireEvent, waitFor } from '@testing-library/react';

import PreviewBanner from '../../components/PreviewBanner';

describe('<PreviewBanner>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <PreviewBanner version={'TEST_ID'} />,
      {},
    );

    await waitFor(() => {
      expect(screen.getByText('View live version')).to.be.ok;
    });
  });

  it('should redirect to live version', async () => {
    const screen = renderWithStoreAndRouter(
      <PreviewBanner version={'TEST_ID'} />,
      {
        path: '/?version=TEST_ID&other=test',
      },
    );

    await waitFor(() => {
      expect(screen.getByText('View live version')).to.be.ok;
    });

    fireEvent.click(screen.getByText('View live version'));
    expect(screen.history.push.lastCall.args[0]).to.equal('other=test');
  });
});
