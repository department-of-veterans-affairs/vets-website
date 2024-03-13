import React from 'react';
import { expect } from 'chai';
import { renderComponentForA11y } from 'platform/user/tests/helpers';
import FormAlert from '../../../../components/alerts/bad-address/FormAlert';
import ProfileAlert from '../../../../components/alerts/bad-address/ProfileAlert';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { PROFILE_PATHS } from '~/applications/personalization/profile/constants';

describe('authenticated experience -- profile -- bad address alert', () => {
  describe('ProfileAlert', () => {
    it('passes axeCheck', async () => {
      const { container } = renderWithStoreAndRouter(<ProfileAlert />, {
        path: PROFILE_PATHS.PROFILE_ROOT,
      });
      const component = renderComponentForA11y(container, { isWrapped: true });
      await expect(component).to.be.accessible();
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
    it('passes axeCheck', async () => {
      const component = renderComponentForA11y(<FormAlert />);
      await expect(component).to.be.accessible();
    });
  });
});
