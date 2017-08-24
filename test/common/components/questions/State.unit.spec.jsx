import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { assert, expect } from 'chai';

import State from
  '../../../../src/js/common/components/questions/State';

describe('<State>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <State value="CA"/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });
});
