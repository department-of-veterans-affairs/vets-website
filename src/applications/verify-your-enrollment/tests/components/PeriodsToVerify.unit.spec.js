import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { waitFor, fireEvent, render, cleanup } from '@testing-library/react';
import { USER_MOCK_DATA } from '../../constants/mockData';
import { renderWithStoreAndRouter } from '../helpers';
import PeriodsToVerify from '../../components/PeriodsToVerify';

describe('PeriodsToVerify', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<PeriodsToVerify />, {
      initialState: {
        enrollmentData: USER_MOCK_DATA,
      },
    });
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('displays the success message after verification', async () => {
    const screen = renderWithStoreAndRouter(
      <PeriodsToVerify enrollmentData={USER_MOCK_DATA} />,
      {
        initialState: {
          enrollmentData: USER_MOCK_DATA,
        },
      },
    );

    const verifyEnrollmentButton = screen.getByRole('button', {
      name: 'Verify enrollment',
    });
    fireEvent.click(verifyEnrollmentButton);
    await waitFor(() => {
      const successMessage = screen.getByText(
        'You have successfully verified your enrollment',
      );
      expect(successMessage).to.be.ok;
    });
  });

  it('renders up to date statement with blank enrollmentData', () => {
    const mockStore = configureMockStore();
    const store = mockStore({ mockData: { mockData: {} } }); // Providing blank object for enrollmentData
    const screen = render(
      <Provider store={store}>
        <PeriodsToVerify
          dispatchUpdatePendingVerifications={() => {}}
          dispatchUpdateVerifications={() => {}}
        />
      </Provider>,
    );
    const upToDateStatement =
      'You’re up-to-date with your monthly enrollment verification. You’ll be able to verify your enrollment next month.';
    expect(screen.queryByText(upToDateStatement)).to.be.visible;
  });
});
