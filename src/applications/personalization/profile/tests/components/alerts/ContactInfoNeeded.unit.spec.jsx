import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import {
  createCustomProfileState,
  getBasicContactInfoState,
} from '../../unit-test-helpers';
import { ContactInfoNeeded } from '../../../components/alerts/ContactInfoNeeded';

describe('ContactInfoNeeded', () => {
  afterEach(cleanup);

  it('renders alert when email address is missing', () => {
    const initialState = {
      ...createCustomProfileState({
        user: {
          profile: {
            vapContactInfo: {
              ...getBasicContactInfoState(),
              email: {
                createdAt: '2020-07-30T23:38:04.000+00:00',
                emailAddress: null, // email address is missing
                effectiveEndDate: null,
                effectiveStartDate: '2020-07-30T23:38:03.000+00:00',
                id: 115097,
                sourceDate: '2020-07-30T23:38:03.000+00:00',
                sourceSystemUser: null,
                transactionId: '604abf55-422b-4f51-b33d-9fb38b4daad1',
                updatedAt: '2020-07-30T23:38:04.000+00:00',
                vet360Id: '1273780',
              },
            },
          },
        },
      }),
      featureToggles: {
        [Toggler.TOGGLE_NAMES.veteranOnboardingContactInfoFlow]: true,
      },
    };
    const tree = renderWithStoreAndRouter(<ContactInfoNeeded />, {
      initialState,
    });

    expect(tree.getByText('We need your contact information')).to.exist;
  });

  it('does not render alert when email address is present', () => {
    const initialState = {
      ...createCustomProfileState(),
      featureToggles: {
        [Toggler.TOGGLE_NAMES.veteranOnboardingContactInfoFlow]: true,
      },
    };
    const tree = renderWithStoreAndRouter(<ContactInfoNeeded />, {
      initialState,
    });

    expect(tree.queryByText('Are you the dependent?')).not.to.exist;
  });
});
