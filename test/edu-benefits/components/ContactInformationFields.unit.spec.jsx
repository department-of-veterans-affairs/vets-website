import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ContactInformationFields from '../../../src/js/edu-benefits/components/personal-information/ContactInformationFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<ContactInformationFields>', () => {
  describe('Phone number requirement', () => {
    it('requires a valid primary phone number when preferred contact is phone', () => {
      let data = createVeteran();
      data.preferredContactMethod = {
        value: 'phone',
        dirty: true
      };

      const onStateChange = sinon.spy();
      const tree = SkinDeep.shallowRender(
        <ContactInformationFields
            data={data}
            onStateChange={onStateChange}/>);

      const primaryPhone = tree.everySubTree('Phone')[0];
      expect(primaryPhone.props.required).to.be.true;
    });
  });
  describe('Email confirmation', () => {
    it('does not include `error` prop when matches Email', () => {
      let data = createVeteran();
      data.email = {
        value: 'mock@aol.com',
        dirty: true
      };
      data.emailConfirmation = {
        value: 'mock@aol.com',
        dirty: true
      };

      const onStateChange = sinon.spy();
      const tree = SkinDeep.shallowRender(
        <ContactInformationFields
            data={data}
            onStateChange={onStateChange}/>);

      const emailInputs = tree.everySubTree('Email');
      expect(emailInputs).to.have.lengthOf(2);
      expect(emailInputs[1].props.error).to.be.undefined;
    });
  });
});

