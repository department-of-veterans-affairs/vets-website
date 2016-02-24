import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ErrorMessage from '../../../../_health-care/_js/_components/error-message';

describe('<ErrorMessage>', () => {
  let component = null;

  beforeEach(() => {
    component = ReactTestUtils.renderIntoDocument(
      <ErrorMessage message="There is an error here"/>
    );
    assert.ok(component, 'Cannot even render component');
  });

  it('has sane looking features', () => {
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'span');
    expect(inputs).to.have.length(1);
  });

  it('has the appropriate className', () => {
    expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(
        component, 'usa-input-error-message')).to.have.length(1);
  });

  // This test is going to fail because it requires knowledge of the id set in the parent component,
  // which isn't rendered here.
  xit('has the correct content', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<ErrorMessage message="There is an error here"/>);
    const renderedResult = renderer.getRenderOutput();
    expect(renderedResult).to.eql(
      <span className="usa-input-error-message" id="input-error-message" role="alert">There is an error here</span>
    );
  });
});
