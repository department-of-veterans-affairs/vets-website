import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import PhoneNumberWidget from '../../../src/js/review/PhoneNumberWidget';

describe('Schemaform review <PhoneNumberWidget>', () => {
  it('should format phone number', () => {
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget value="1234567890"/>
    );

    expect(tree.text()).to.equal('(123) 456-7890');
  });
  it('should render empty value', () => {
    const tree = SkinDeep.shallowRender(
      <PhoneNumberWidget/>
    );

    expect(tree.text()).to.equal('');
  });
});
