import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import { assert, expect } from 'chai';

import VaMedicalFacility from '../../../../src/js/hca/components/insurance-information/VaMedicalFacility';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<VaMedicalFacility>', () => {
  xit('has sane looking features', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')}/>
    );
    assert.ok(component, 'Cannot even render component');

    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });

  // TODO(crew): Once options are refactored to build blank option with data, fix these tests.
  it('has no options if facilityState is NOT specified', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')} facilityState={makeField('')}/>
    );

    const options = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'option');
    expect(options.length).to.equal(1);
  });

  it('has options if facilityState is specified', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')} facilityState={makeField('AK')}/>
    );

    const options = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'option');
    expect(options.length).to.be.above(1);
  });

  it('has sorted options if facilityState is specified', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')} facilityState={makeField('DC')}/>
    );

    const options = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'option');
    const optionsText = options.map((option) => {
      return option.text;
    });
    expect(optionsText).to.eql(['', 'FRANKLIN STREET VA CLINIC', 'SOUTHEAST WASHINGTON VA CLINIC', 'WASHINGTON VA MEDICAL CENTER']);
  });
});
