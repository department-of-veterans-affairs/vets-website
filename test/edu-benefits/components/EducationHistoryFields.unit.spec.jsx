import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import EducationHistoryFields from '../../../src/js/edu-benefits/components/education-history/EducationHistoryFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';
import { makeField } from '../../../src/js/common/model/fields';

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
  it('should not render GrowableTable when there is no valid date', () => {
    const tree = makeTree();
    expect(tree.everySubTree('GrowableTable').length).to.equal(0);
  });
  it('should render GrowableTable when there is a valid date', () => {
    const veteran = createVeteran();
    veteran.highSchoolOrGedCompletionDate = {
      day: makeField('2'),
      month: makeField('5'),
      year: makeField('1994')
    };
    const tree = makeTree(veteran);
    expect(tree.everySubTree('GrowableTable').length).to.equal(1);
  });
});
