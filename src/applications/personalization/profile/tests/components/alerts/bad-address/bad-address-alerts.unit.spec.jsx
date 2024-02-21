import React from 'react';
import { expect } from 'chai';
import { axeCheck } from '~/platform/forms-system/test/config/helpers';
import FormAlert from '../../../../components/alerts/bad-address/FormAlert';
import ProfileAlert from '../../../../components/alerts/bad-address/ProfileAlert';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { PROFILE_PATHS } from '~/applications/personalization/profile/constants';

describe('authenticated experience -- profile -- bad address alert', () => {
  describe('ProfileAlert', () => {
    it('passes axeCheck', () => {
      const { container } = renderWithStoreAndRouter(<ProfileAlert />, {
        path: PROFILE_PATHS.PROFILE_ROOT,
      });

      return axeCheck(<container />);
    });
    it('has accessibility considerations including alert role and aria-live', async () => {
      const { findByRole } = renderWithStoreAndRouter(<ProfileAlert />, {
        path: PROFILE_PATHS.PROFILE_ROOT,
      });

      const alert = await findByRole('alert');
      expect(alert.getAttribute('aria-live')).to.equal('polite');
    });
  });
  describe('FormAlert', () => {
    it('passes axeCheck', () => {
      axeCheck(<FormAlert />);
    });
  });
});
