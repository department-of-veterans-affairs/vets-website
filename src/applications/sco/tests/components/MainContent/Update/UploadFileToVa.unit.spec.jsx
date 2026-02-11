import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import UploadFileToVa from '../../../../components/MainContent/Update/UploadFileToVa';

const mockStore = configureStore([]);

describe('UploadFileToVa', () => {
  it('should render all new forms digitized form links', () => {
    const initialState = {
      initialState: {
        featureToggles: {},
      },
    };
    const store = mockStore(initialState);

    const { getByText, queryByTestId } = render(
      <Provider store={store}>
        <UploadFileToVa />
      </Provider>,
    );

    expect(getByText('Other accepted documents')).to.exist;

    // Digital/PDF Forms
    expect(queryByTestId('digital-10215-form')).to.exist;
    expect(queryByTestId('digital-10216-form')).to.exist;
    expect(queryByTestId('digital-8794-form')).to.exist;
    expect(queryByTestId('digital-1919-form')).to.exist;
    expect(queryByTestId('digital-0839-form')).to.exist;
  });
});
