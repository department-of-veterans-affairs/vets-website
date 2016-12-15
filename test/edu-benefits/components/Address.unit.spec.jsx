import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { assert, expect } from 'chai';
import sinon from 'sinon';

import Address from
    '../../../src/js/edu-benefits/components/Address';
import { makeAddressField } from '../../../src/js/edu-benefits/utils/veteran';

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
