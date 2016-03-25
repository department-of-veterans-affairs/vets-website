import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Address from
    '../../../../../_health-care/_js/components/questions/Address';

describe('<Address>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <Address/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  xit('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputs).to.have.length(1);
  });
});
