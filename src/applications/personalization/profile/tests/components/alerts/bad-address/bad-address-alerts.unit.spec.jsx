import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import FormAlert from '../../../../components/alerts/bad-address/FormAlert';
import ProfileAlert from '../../../../components/alerts/bad-address/ProfileAlert';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { PROFILE_PATHS } from '~/applications/personalization/profile/constants';
import { Toggler } from '~/platform/utilities/feature-toggles';

describe('authenticated experience -- profile -- bad address alert', () => {
  describe('ProfileAlert', () => {
    it('passes axeCheck', () => {
      const { container } = renderWithStoreAndRouter(<ProfileAlert />, {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseHubPage]: false,
          },
        },
        path: PROFILE_PATHS.PERSONAL_INFORMATION,
      });

      return axeCheck(<container />);
    });
    it('has accessibility considerations including alert role and aria-live', async () => {
      const { findByRole } = renderWithStoreAndRouter(<ProfileAlert />, {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseHubPage]: false,
          },
        },
        path: PROFILE_PATHS.PERSONAL_INFORMATION,
      });

      const alert = await findByRole('alert');
      expect(alert.getAttribute('aria-live')).to.equal('polite');
    });

    it('does not render on personal information page when hub toggle is ON', async () => {
      const { queryByRole } = renderWithStoreAndRouter(<ProfileAlert />, {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseHubPage]: true,
          },
        },
        path: PROFILE_PATHS.PERSONAL_INFORMATION,
      });

      expect(queryByRole('alert')).to.not.exist;
    });

    it('render on profile root page when hub toggle is ON', async () => {
      const { queryByRole } = renderWithStoreAndRouter(<ProfileAlert />, {
        initialState: {
          featureToggles: {
            [Toggler.TOGGLE_NAMES.profileUseHubPage]: true,
          },
        },
        path: PROFILE_PATHS.PROFILE_ROOT,
      });

      expect(queryByRole('alert')).to.exist;
    });
  });
  describe('FormAlert', () => {
    it('passes axeCheck', () => {
      axeCheck(<FormAlert />);
    });
  });
});
