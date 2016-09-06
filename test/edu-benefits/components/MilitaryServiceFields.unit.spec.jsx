import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import MilitaryServiceFields from '../../../src/js/edu-benefits/components/MilitaryServiceFields';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran';

describe('<MilitaryServiceFields>', () => {
  it('should render active duty section', () => {
    let veteran = createVeteran();
    veteran.currentlyActiveDuty.yes.value = 'Y';
    const onStateChange = sinon.spy();
    const initializeFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <MilitaryServiceFields
          data={veteran}
          onStateChange={onStateChange}
          initializeFields={initializeFields}/>
    );
    expect(tree.everySubTree('ErrorableRadioButtons').some(buttons => buttons.props.name === 'onTerminalLeave')).to.be.true;
    expect(tree.everySubTree('ErrorableRadioButtons').some(buttons => buttons.props.name === 'nonVaAssistance')).to.be.true;
  });
  it('should render rotc commissioned year', () => {
    let veteran = createVeteran();
    veteran.seniorRotcComissioned.value = 'Y';
    const onStateChange = sinon.spy();
    const initializeFields = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <MilitaryServiceFields
          data={veteran}
          onStateChange={onStateChange}
          initializeFields={initializeFields}/>
    );
    expect(tree.everySubTree('ErrorableTextInput').some(input => input.props.name === 'seniorRotcComissionYear')).to.be.true;
  });
});
