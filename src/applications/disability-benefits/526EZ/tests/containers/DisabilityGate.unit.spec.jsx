import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { merge } from 'lodash/fp';

import { DisabilityGate } from '../../containers/DisabilityGate';
import { PREFILL_STATUSES } from '../../../../../platform/forms/save-in-progress/actions';

describe('DisabilityGate', () => {
  it("should render the children if pre-fill hasn't returned yet", () => {
    const props = {
      prefillStatus: PREFILL_STATUSES.notAttempted,
      disabilities: [{}],
    };
    const tree = shallow(
      <DisabilityGate {...props}>
        <div className="testing">123</div>
      </DisabilityGate>,
    );
    expect(tree.find('.testing').length).to.equal(1);
    tree.setProps(merge({ prefillStatus: PREFILL_STATUSES.pending }));
    expect(tree.find('.testing').length).to.equal(1);
  });

  it('should render the children if there is at least one eligible disability', () => {
    const props = {
      prefillStatus: PREFILL_STATUSES.success,
      disabilities: [{ foo: "well, it isn't ineligible... " }],
    };
    const tree = shallow(
      <DisabilityGate {...props}>
        <div className="testing">123</div>
      </DisabilityGate>,
    );
    expect(tree.find('.testing').length).to.equal(1);
  });

  it('should render an alert if there are no eligible disabilities', () => {
    const props = {
      prefillStatus: PREFILL_STATUSES.success,
      disabilities: [], // Would have been emptied in transformDisabilities
    };
    const tree = shallow(
      <DisabilityGate {...props}>
        <div className="testing">123</div>
      </DisabilityGate>,
    );
    expect(tree.find('.testing').length).to.equal(0);
    expect(tree.find('AlertBox').length).to.equal(1);
  });

  it('should render an alert if the pre-fill call failed', () => {
    // It should render an alert because there are no eligible disabilities, but this is an extra check
    const props = {
      prefillStatus: PREFILL_STATUSES.unfilled,
    };
    const tree = shallow(
      <DisabilityGate {...props}>
        <div className="testing">123</div>
      </DisabilityGate>,
    );
    expect(tree.find('.testing').length).to.equal(0);
    expect(tree.find('AlertBox').length).to.equal(1);
  });
});
