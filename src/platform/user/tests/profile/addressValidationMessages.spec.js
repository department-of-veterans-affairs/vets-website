import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  ADDRESS_VALIDATION_MESSAGES,
  ADDRESS_VALIDATION_TYPES,
} from '../../profile/constants/addressValidationMessages';

describe('ADDRESS_VALIDATION_MESSAGES object', () => {
  test('has a valid data object for each validation type', () => {
    const validationTypes = Object.values(ADDRESS_VALIDATION_TYPES);
    validationTypes.forEach(type => {
      const messageData = ADDRESS_VALIDATION_MESSAGES[type];
      const editSpy = sinon.spy();
      expect(typeof messageData).toBe('object');
      expect(typeof messageData.headline).toBe('string');
      expect(typeof messageData.ModalText).toBe('function');
      const modalTextComponent = shallow(
        <messageData.ModalText editFunction={editSpy} />,
      );
      modalTextComponent.find('a').simulate('click');
      expect(editSpy.called).toBe(true);
      modalTextComponent.unmount();
    });
  });
});
