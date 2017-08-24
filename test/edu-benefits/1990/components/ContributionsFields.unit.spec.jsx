import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import ContributionsFields from '../../../../src/js/edu-benefits/1990/components/military-history/ContributionsFields';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

function testGroup(conditions, index, result) {
  const veteran = createVeteran();
  const data = _.merge(veteran, conditions);
  const onStateChange = sinon.spy();
  const tree = SkinDeep.shallowRender(
    <ContributionsFields
      data={data}
      initializeFields={f => f}
      onStateChange={onStateChange}/>
  );
  expect(tree.everySubTree('ExpandingGroup')[index].props.open).to.be[result];
}

describe('<ContributionsFields>', () => {
  it('active duty kicker\'s ExpandingGroup should be closed if conditions are not met', () => {
    testGroup({ activeDutyKicker: false }, 0, 'false');
  });
  it('active duty kicker\'s ExpandingGroup should be open if conditions are met', () => {
    testGroup({
      activeDutyKicker: true,
      benefitsRelinquished: { value: 'chapter1606' }
    }, 0, 'true');
  });

  it('reserve kicker\'s ExpandingGroup should be closed if conditions are not met', () => {
    testGroup({ activeDutyKicker: false }, 1, 'false');
  });
  it('reserve kicker\'s ExpandingGroup should be open if conditions are met', () => {
    testGroup({
      reserveKicker: true,
      benefitsRelinquished: { value: 'chapter30' }
    }, 1, 'true');
  });

  it('activeDutyRepaying\'s ExpandingGroup should be closed if unchecked', () => {
    testGroup({ activeDutyRepaying: false }, 2, 'false');
  });
  it('activeDutyRepaying\'s ExpandingGroup should be open if checked', () => {
    testGroup({ activeDutyRepaying: true }, 2, 'true');
  });
});
