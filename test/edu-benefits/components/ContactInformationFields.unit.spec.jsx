import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import ContactInformationFields from '../../../src/js/edu-benefits/components/personal-information/ContactInformationFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<ContactInformationFields>', () => {
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

