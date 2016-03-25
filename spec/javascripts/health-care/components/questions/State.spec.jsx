import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import State from
    '../../../../../_health-care/_js/components/questions/State';

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
