import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ContactAlert from '../../../../components/alerts/bad-address/ContactAlert';
import FormAlert from '../../../../components/alerts/bad-address/FormAlert';
import ProfileAlert from '../../../../components/alerts/bad-address/ProfileAlert';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('ProfileAlert', () => {
    it('passes axeCheck', () => {
      axeCheck(
        <Router>
          <ProfileAlert />
        </Router>,
      );
    });
    it('has accessibility considerations', async () => {
      const { findByRole } = render(
        <Router>
          <ProfileAlert />
        </Router>,
      );
      const alert = await findByRole('alert');
      expect(alert.getAttribute('aria-label')).to.equal(
        'The address we have on file for you may not be correct.',
      );
      expect(alert.getAttribute('aria-live')).to.equal('polite');
      expect(alert.getAttribute('tabIndex')).to.equal('0');
    });
  });
  describe('FormAlert', () => {
    it('passes axeCheck', () => {
      axeCheck(<FormAlert />);
    });
  });
  describe('ContactAlert', () => {
    it('passes axeCheck', () => {
      axeCheck(
        <Router>
          <ContactAlert />
        </Router>,
      );
    });
    it('has accessibility considerations', async () => {
      const { findByRole } = render(
        <Router>
          <ContactAlert />
        </Router>,
      );
      const alert = await findByRole('alert');
      expect(alert.getAttribute('aria-label')).to.equal(
        'The address we have on file for you may not be correct.',
      );
      expect(alert.getAttribute('aria-live')).to.equal('polite');
      expect(alert.getAttribute('tabIndex')).to.equal('0');
    });
  });
});
