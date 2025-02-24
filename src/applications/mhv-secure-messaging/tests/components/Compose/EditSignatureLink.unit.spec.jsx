/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import EditSignatureLink from '../../../components/ComposeForm/EditSignatureLink';
import reducer from '../../../reducers';
import { Paths } from '../../../util/constants';

describe('EditSignatureLink component', () => {
  const customState = {
    sm: {
      preferences: {
        signature: {
          includeSignature: true,
        },
      },
    },
    featureToggles: [],
  };

  const setup = (initialState = customState) => {
    return renderWithStoreAndRouter(<EditSignatureLink />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });
  };

  it('should render', () => {
    const testState = { ...customState, featureToggles: { loading: false } };
    testState.featureToggles.mhv_secure_messaging_signature_settings = true;
    const { getByText } = setup(testState);
    const link = getByText('Edit signature for all messages');
    expect(link).to.exist;
    expect(link.tagName).to.equal('A');
    expect(link.getAttribute('href')).to.equal(
      '/profile/personal-information#messaging-signature',
    );
    expect(link.getAttribute('data-dd-action-name')).to.equal('Edit Signature');
  });

  it('should not render when feature flag is not enabled', () => {
    const testState = { ...customState, featureToggles: { loading: false } };
    testState.featureToggles.mhv_secure_messaging_signature_settings = false;
    const { queryByText } = setup(testState);
    expect(queryByText('Edit signature for all messages')).to.not.exist;
  });

  it('should not render when feature flag is loading', () => {
    const testState = { ...customState, featureToggles: { loading: true } };
    testState.featureToggles.mhv_secure_messaging_signature_settings = true;
    const { queryByText } = setup(testState);
    expect(queryByText('Edit signature for all messages')).to.not.exist;
  });

  it('should not render when includeSignature is false', () => {
    const testState = { ...customState, featureToggles: { loading: false } };
    testState.featureToggles.mhv_secure_messaging_signature_settings = true;
    testState.sm.preferences.signature.includeSignature = false;
    const { queryByText } = setup(testState);
    expect(queryByText('Edit signature for all messages')).to.not.exist;
  });

  it('should not render when includeSignature is undefined', () => {
    const testState = { ...customState, featureToggles: { loading: false } };
    testState.featureToggles.mhv_secure_messaging_signature_settings = true;
    testState.sm.preferences.signature.includeSignature = undefined;
    const { queryByText } = setup(testState);
    expect(queryByText('Edit signature for all messages')).to.not.exist;
  });
});
