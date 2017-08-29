import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import EducationHistoryFields from '../../../../src/js/edu-benefits/1990/components/education-history/EducationHistoryFields';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

const makeTree = (_veteran) => {
  const veteran = _veteran || createVeteran();
  const onStateChange = sinon.spy();
  const initializeFields = sinon.spy();

  return SkinDeep.shallowRender(
    <EducationHistoryFields
      data={veteran}
      onStateChange={onStateChange}
      initializeFields={initializeFields}/>
  );
};

describe('<EducationHistoryFields>', () => {
  it('should render question', () => {
    const tree = makeTree();
    expect(tree.everySubTree('ErrorableMonthYear').length).to.equal(1);
  });
});
