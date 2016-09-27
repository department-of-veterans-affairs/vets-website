import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import EducationHistoryFields from '../../../src/js/edu-benefits/components/education-history/EducationHistoryFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

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
    expect(tree.everySubTree('DateInput').length).to.equal(1);
  });
});
