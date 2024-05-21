import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import UploadPage from '../../containers/UploadPage';

describe('UploadPage', () => {
  const getStore = () => ({
    getState: () => {},
    subscribe: () => {},
    dispatch: () => {},
  });

  it('should handle the Continue button', async () => {
    let testLocation;
    const { getByTestId } = render(
      <Provider store={getStore()}>
        <MemoryRouter initialEntries={['/21-0779']}>
          <UploadPage />
          <Route
            path="/:id"
            render={({ _, location }) => {
              testLocation = location;
              return null;
            }}
          />
        </MemoryRouter>
      </Provider>,
    );

    await fireEvent.click(getByTestId('continue-button'));

    expect(testLocation.pathname).to.equal('/21-0779/review');
  });
});
