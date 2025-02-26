import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import YourPersonalInformationAuthenticated from '../../components/YourPersonalInformationAuthenticated';
import { createMockStore, mockRouterProps } from '../common';

describe('YourPersonalInformationAuthenticated', () => {
  it('should render', () => {
    const store = createMockStore({
      formData: {
        aboutYourself: {
          first: 'Test',
          last: 'User',
          dateOfBirth: '1980-01-01',
          socialOrServiceNum: {
            ssn: '123-45-6789',
          },
        },
      },
    });
    const router = {
      ...mockRouterProps,
    };

    const { getByRole } = render(
      <Provider store={store}>
        <YourPersonalInformationAuthenticated
          router={router}
          goForward={() => {}}
          goBack={() => {}}
          isLoggedIn
        />
      </Provider>,
    );

    expect(getByRole('heading', { name: /Your personal information/i })).to
      .exist;
  });
});
