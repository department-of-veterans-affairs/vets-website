import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import SearchMessages from '../../containers/SearchMessages';

describe('SearchMessages container', () => {
  it('should not be empty', () => {
    const screen = renderWithStoreAndRouter(<SearchMessages />, {
      path: '/search',
    });

    expect(screen.getByTestId('search-messages')).to.not.be.empty;
  });

  it('should contain an h1 element with page title', () => {
    const screen = renderWithStoreAndRouter(<SearchMessages />, {
      path: '/search',
    });

    expect(screen.findByText('Search messages')).to.exist;
  });
});
