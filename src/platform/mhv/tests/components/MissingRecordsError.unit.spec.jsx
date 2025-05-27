import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MissingRecordsError from '../../self-entered/MissingRecordsError';

const dummyReducer = {
  app: (state = {}) => state,
};

describe('MissingRecordsError', () => {
  it('should not display if no records are missing (nothing passed)', () => {
    const screen = renderWithStoreAndRouter(<MissingRecordsError />, {
      initialState: {},
      reducers: dummyReducer,
      path: '/',
    });
    const alert = screen.queryByTestId('missing-records-error-alert');
    expect(alert).to.be.null;
  });

  it('should not display if no records are missing (empty array)', () => {
    const screen = renderWithStoreAndRouter(
      <MissingRecordsError recordTypes={[]} />,
      { initialState: {}, reducers: dummyReducer, path: '/' },
    );
    const alert = screen.queryByTestId('missing-records-error-alert');
    expect(alert).to.be.null;
  });

  it('should display the missing records', () => {
    const screen = renderWithStoreAndRouter(
      <MissingRecordsError
        documentType="document"
        recordTypes={['Allergies', 'Vaccines']}
      />,
      { initialState: {}, reducers: dummyReducer, path: '/' },
    );
    const alert = screen.queryByTestId('missing-records-error-alert');
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain('Allergies');
    expect(alert.innerHTML).to.contain('Vaccines');
  });
});
