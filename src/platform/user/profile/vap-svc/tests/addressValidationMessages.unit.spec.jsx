import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  ADDRESS_VALIDATION_MESSAGES,
  ADDRESS_VALIDATION_TYPES,
} from '../constants/addressValidationMessages';

describe('ADDRESS_VALIDATION_MESSAGES object', () => {
  it('has a valid data object for each ADDRESS_VALIDATION_TYPE', () => {
    const validationTypes = Object.values(ADDRESS_VALIDATION_TYPES);
    validationTypes.forEach(type => {
      const messageData = ADDRESS_VALIDATION_MESSAGES[type];
      const editSpy = sinon.spy();
      expect(typeof messageData).to.equal('object');
      expect(typeof messageData.headline).to.equal('string');
      const modalTextComponent = mount(
        <messageData.ModalText editFunction={editSpy} />,
      );
      const button = modalTextComponent.find('button');
      if (button?.length > 0) {
        button.simulate('click');
        expect(editSpy.called).to.be.true;
      }
      modalTextComponent.unmount();
    });
  });
});
