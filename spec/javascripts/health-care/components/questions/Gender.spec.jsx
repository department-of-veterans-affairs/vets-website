import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Gender from
    '../../../../../_health-care/_js/components/questions/Gender';

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
