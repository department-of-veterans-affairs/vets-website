import { expect } from 'chai';

import { customFieldSchemaUI } from '../../../definitions/UIDefinitions/sharedUI';

describe('customFieldSchemaUI', () => {
  it('should extend the specified field with the given UI key-value pair', () => {
    const originalUI = {
      first: { 'ui:title': 'First Name' },
      last: { 'ui:title': 'Last Name' },
    };

    const extendedUI = customFieldSchemaUI(
      originalUI,
      'first',
      'ui:description',
      'Enter your first name',
    );

    expect(extendedUI.first).to.have.property('ui:title', 'First Name');
    expect(extendedUI.first).to.have.property(
      'ui:description',
      'Enter your first name',
    );
    expect(extendedUI.last).to.have.property('ui:title', 'Last Name');
  });

  it('should return the original UI if the field name does not exist', () => {
    const originalUI = {
      first: { 'ui:title': 'First Name' },
    };

    const extendedUI = customFieldSchemaUI(
      originalUI,
      'somethingElse',
      'ui:description',
      'Enter your middle name',
    );

    expect(extendedUI).to.deep.equal(originalUI);
  });
});
