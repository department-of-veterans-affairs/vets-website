import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FileUpload from '../../components/FileUpload';

const mockStore = configureStore([]);

describe('<FileUpload />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      navigation: {
        route: {
          path: '/test-path',
        },
      },
    });
  });

  it('allows the user to add a file', async () => {
    const screen = render(
      <Provider store={store}>
        <FileUpload />
      </Provider>,
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('askVA_upload_first');

    await waitFor(() => fireEvent.change(input, { target: { files: [file] } }));
    expect(input.files[0].name).to.equal('hello.png');
  });
});
