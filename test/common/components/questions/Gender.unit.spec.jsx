import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { assert, expect } from 'chai';

import Gender from
  '../../../../src/js/common/components/questions/Gender';

describe('<Gender>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <Gender value="F"/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });
});
