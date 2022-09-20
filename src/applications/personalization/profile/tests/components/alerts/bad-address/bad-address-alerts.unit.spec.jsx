import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import FormAlert from '../../../../components/alerts/bad-address/FormAlert';
import ProfileAlert from '../../../../components/alerts/bad-address/ProfileAlert';

describe('authenticated experience -- profile -- bad address alert', () => {
  describe('ProfileAlert', () => {
    it('passes axeCheck', () => {
      axeCheck(
        <Router>
          <ProfileAlert />
        </Router>,
      );
    });
    it('has accessibility considerations including alert role and aria-live', async () => {
      const { findByRole } = render(
        <Router>
          <ProfileAlert />
        </Router>,
      );
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
