import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import MhvTemporaryAccess from '../../containers/MhvTemporaryAccess';

describe('MhvTemporaryAccess', () => {
  it('renders main title', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const mainTitle = screen.getByRole('heading', {
      name: /access the my healthevet sign-in option/i,
    });
    expect(mainTitle).to.exist;
  });

  it('renders information paragraph', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const description = screen.getByText(
      /If you received confirmation from VA that we've given you temporary access to My HealtheVet, you can sign in here./i,
    );
    expect(description).to.exist;
  });

  it('renders button and calls login with correct parameters on click', async () => {
    const loginStub = sinon.stub(authUtilities, 'login');
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const signInHeading = screen.getByRole('heading', { name: /sign in/i });
    expect(signInHeading).to.exist;
    const accessButton = await screen.findByTestId('accessMhvBtn');
    expect(accessButton).to.exist;

    fireEvent.click(accessButton);

    await waitFor(() => {
      sinon.assert.calledOnce(loginStub);
      sinon.assert.calledWith(loginStub, {
        policy: 'mhv',
        queryParams: { operation: 'mhv_exception' },
      });
    });
    loginStub.restore();
  });

  it('renders having trouble section', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const troubleHeading = screen.getByRole('heading', {
      name: /having trouble signing in/i,
    });
    expect(troubleHeading).to.exist;

    const troubleParagraph = screen.getByText(
      /contact the administrator who gave you access to this page/i,
    );
    expect(troubleParagraph).to.exist;
  });
});
