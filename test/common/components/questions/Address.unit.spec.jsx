import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { assert, expect } from 'chai';
import sinon from 'sinon';

import Address from
  '../../../../src/js/common/components/questions/Address';
import { makeField } from '../../../../src/js/common/model/fields';

function makeAddressField() {
  return {
    street: makeField(''),
    city: makeField(''),
    country: makeField('USA'),
    state: makeField(''),
    postalCode: makeField(''),
  };
}

describe('<Address>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <Address
        value={makeAddressField()}
        onUserInput={sinon.spy()}/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(3);
  });
});
