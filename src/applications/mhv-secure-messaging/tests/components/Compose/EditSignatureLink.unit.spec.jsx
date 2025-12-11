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
    const { getByTestId } = setup(testState);
    const link = getByTestId('edit-signature-link');
    expect(link).to.exist;
    expect(link.tagName).to.equal('VA-LINK');
    expect(link.getAttribute('href')).to.equal(
      '/profile/personal-information#messaging-signature',
    );
    expect(link.getAttribute('text')).to.equal(
      'Edit signature for all messages',
    );
    expect(link.getAttribute('data-dd-action-name')).to.equal('Edit Signature');
    expect(link.getAttribute('data-testid')).to.equal('edit-signature-link');

    // Verify it uses STANDARD link styling (not active)
    expect(link).to.not.have.attribute('active');
  });

  it('should not render when includeSignature is false', () => {
    const testState = { ...customState, featureToggles: { loading: false } };
    testState.sm.preferences.signature.includeSignature = false;
    const { queryByTestId } = setup(testState);
    expect(queryByTestId('edit-signature-link')).to.not.exist;
  });

  it('should not render when includeSignature is undefined', () => {
    const testState = { ...customState, featureToggles: { loading: false } };
    testState.sm.preferences.signature.includeSignature = undefined;
    const { queryByTestId } = setup(testState);
    expect(queryByTestId('edit-signature-link')).to.not.exist;
  });

  describe('React Router integration', () => {
    it('renders RouterLink with correct profile URL', () => {
      const testState = {
        sm: {
          preferences: {
            signature: {
              includeSignature: true,
            },
          },
        },
        featureToggles: { loading: false },
      };
      const screen = setup(testState);
      const link = screen.getByTestId('edit-signature-link');

      // Verify it renders with the correct href including hash
      expect(link.getAttribute('href')).to.equal(
        '/profile/personal-information#messaging-signature',
      );

      // Verify it's a va-link element (RouterLink uses VaLink)
      expect(link.tagName).to.equal('VA-LINK');
    });

    it('renders as standard link (no active attribute) for utility link styling', () => {
      const testState = {
        sm: {
          preferences: {
            signature: {
              includeSignature: true,
            },
          },
        },
        featureToggles: { loading: false },
      };
      const screen = setup(testState);
      const link = screen.getByTestId('edit-signature-link');

      // Verify it does NOT have active attribute (standard link, not action link)
      expect(link).to.not.have.attribute('active');
    });
  });
});
