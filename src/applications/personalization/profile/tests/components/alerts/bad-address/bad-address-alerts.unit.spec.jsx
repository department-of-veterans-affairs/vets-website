import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
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
  });
});
