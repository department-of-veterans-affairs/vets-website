import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import MilitaryServiceFields from '../../../../src/js/edu-benefits/1990/components/military-history/MilitaryServiceFields';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<MilitaryServiceFields>', () => {
  it('should render active duty section', () => {
    const veteran = createVeteran();
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
  });
});
