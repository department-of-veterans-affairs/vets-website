import React from 'react';
import { render } from '@testing-library/react';
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

  context('click Continue when no file uploaded yet', () => {
    it('should populate errors and not change route', async () => {
      let testLocation;
      const { container, getByTestId } = render(
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

      const buttonPair = getByTestId('upload-button-pair');
      buttonPair.__events.primaryClick();

      expect(testLocation.pathname).to.equal('/21-0779');
      const input = container.getElementsByTagName('va-file-input');
      expect(input.item(0).error).to.eq('Upload a completed form 21-0779');
    });
  });
});
