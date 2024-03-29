import React from 'react';
import { expect } from 'chai';

import { useDirectDeposit } from '../../../hooks';
import { renderWithProfileReducersAndRouter } from '../../unit-test-helpers';

const TestingComponent = () => {
  const hookResults = useDirectDeposit();

  // Use a data-testid for selecting in the tests
  return (
    <>
      <div data-testid="hookResults">{JSON.stringify(hookResults)}</div>;
      <button
        data-testid="set-form-is-dirty"
        onClick={() => hookResults.setFormIsDirty(true)}
      >
        Set form dirty
      </button>
    </>
  );
};

const baseState = {
  directDeposit: {
    controlInformation: {
      canUpdateDirectDeposit: true,
      isCorpAvailable: true,
      isEduClaimAvailable: true,
      isCorpRecFound: true,
      hasNoBdnPayments: true,
      hasIdentity: true,
      hasIndex: true,
      isCompetent: true,
      hasMailingAddress: true,
      hasNoFiduciaryAssigned: true,
      isNotDeceased: true,
      hasPaymentAddress: true,
    },
    paymentAccount: {
      name: 'BASE TEST - DIRECT DEPOSIT',
      accountType: 'CHECKING',
      accountNumber: '*******5487',
      routingNumber: '*****1533',
    },
    error: null,
    ui: {
      isEditing: false,
      isSaving: false,
    },
  },
  user: {
    profile: {
      multifactor: true,
      loa: {
        current: 3,
      },
      signIn: {
        serviceName: 'idme',
      },
      session: {
        ssoe: true,
      },
    },
  },
};

describe('useDirectDeposit hook', () => {
  it('returns direct deposit information for account and ui state', () => {
    const { getByTestId } = renderWithProfileReducersAndRouter(
      <TestingComponent />,
      {
        initialState: baseState,
      },
    );

    const parsedResults = JSON.parse(getByTestId('hookResults').textContent);

    // direct deposit paymentAccount is passed through
    expect(parsedResults.paymentAccount.name).to.equal(
      'BASE TEST - DIRECT DEPOSIT',
    );
    expect(parsedResults.paymentAccount.accountType).to.equal('CHECKING');
    expect(parsedResults.paymentAccount.accountNumber).to.equal('*******5487');
    expect(parsedResults.paymentAccount.routingNumber).to.equal('*****1533');

    // main controlInformation is passed through
    expect(parsedResults.controlInformation.canUpdateDirectDeposit).to.be.true;
    expect(parsedResults.controlInformation.isCorpAvailable).to.be.true;
    expect(parsedResults.controlInformation.isEduClaimAvailable).to.be.true;

    // isBlocked and useOauth selectors are returned correctly
    expect(parsedResults.isBlocked).to.be.false;
    expect(parsedResults.useOAuth).to.be.false;

    // isIdentityVerified is returned correctly
    expect(parsedResults.isIdentityVerified).to.be.true;

    // showUpdateSuccess and formIsDirty are returned correctly
    expect(parsedResults.showUpdateSuccess).to.be.false;
    expect(parsedResults.formIsDirty).to.be.false;
  });

  it('returns isIdentityVerified as false when not all conditions are met', () => {
    const { getByTestId } = renderWithProfileReducersAndRouter(
      <TestingComponent />,
      {
        initialState: {
          ...baseState,
          user: {
            ...baseState.user,
            profile: {
              ...baseState.user.profile,
              loa: {
                current: 1,
              },
            },
          },
        },
      },
    );

    const parsedResults = JSON.parse(getByTestId('hookResults').textContent);

    expect(parsedResults.isIdentityVerified).to.be.false;
  });

  it('sets formIsDirty to true when calling setFormIsDirty', () => {
    const { getByTestId } = renderWithProfileReducersAndRouter(
      <TestingComponent />,
      {
        initialState: baseState,
      },
    );

    const button = getByTestId('set-form-is-dirty');
    button.click();

    const parsedResults = JSON.parse(getByTestId('hookResults').textContent);

    expect(parsedResults.formIsDirty).to.be.true;
  });

  it('returns isBlocked as false when controlInformation is not provided', () => {
    const { getByTestId } = renderWithProfileReducersAndRouter(
      <TestingComponent />,
      {
        initialState: {
          ...baseState,
          directDeposit: {
            ...baseState.directDeposit,
            controlInformation: null,
          },
        },
      },
    );

    const parsedResults = JSON.parse(getByTestId('hookResults').textContent);
    expect(parsedResults.isBlocked).to.be.false;
  });
});
