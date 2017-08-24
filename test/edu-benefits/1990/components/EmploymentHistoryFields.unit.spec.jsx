import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import EmploymentHistoryFields from '../../../../src/js/edu-benefits/1990/components/employment-history/EmploymentHistoryFields';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<EmploymentHistoryFields>', () => {
  it('should render question', () => {
    const veteran = createVeteran();
    const onStateChange = sinon.spy();
    const initializeFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <EmploymentHistoryFields
        data={veteran}
        onStateChange={onStateChange}
        onEdit={f => f}
        initializeFields={initializeFields}/>
    );
    expect(tree.everySubTree('ErrorableRadioButtons').some(buttons => buttons.props.name === 'hasNonMilitaryJobs')).to.be.true;
  });
  it('should render GrowableTable', () => {
    const veteran = createVeteran();
    veteran.hasNonMilitaryJobs.value = 'Y';
    const onStateChange = sinon.spy();
    const initializeFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <EmploymentHistoryFields
        data={veteran}
        onEdit={f => f}
        onStateChange={onStateChange}
        initializeFields={initializeFields}/>
    );
    expect(tree.everySubTree('GrowableTable').length).to.equal(1);
  });
});
