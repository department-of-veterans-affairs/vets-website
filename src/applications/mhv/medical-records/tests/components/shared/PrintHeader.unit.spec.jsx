import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import PrintHeader from '../../../components/shared/PrintHeader';
import user from '../../fixtures/user.json';
import userWithoutFullName from '../../fixtures/userWithoutFullName.json';

describe('PrintHeader', () => {
  it("should display the user's full name when it exists in redux", () => {
    const initialState = {
      user,
    };
    const screen = renderInReduxProvider(<PrintHeader />, {
      initialState,
      reducers: reducer,
    });
    expect(screen.getByTestId('print-header-name')).to.exist;
  });

  it('should display a header message', async () => {
    const initialState = {
      user: userWithoutFullName,
    };
    const screen = renderInReduxProvider(<PrintHeader />, {
      initialState,
      reducers: reducer,
    });
    const foo = await screen.queryByTestId('print-header-name');
    expect(foo).to.not.exist;
  });
});
