import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import MilitaryServiceTour from '../../../../src/js/edu-benefits/1990/components/military-history/MilitaryServiceTour';
import { createTour } from '../../../../src/js/edu-benefits/1990/utils/veteran';

describe('<MilitaryServiceTour>', () => {
  it('should render active duty section', () => {
    const tour = createTour();
    tour.applyPeriodToSelected = false;
    const onStateChange = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <MilitaryServiceTour
        data={tour}
        view="expanded"
        onValueChange={f => f}
        onStateChange={onStateChange}/>
    );
    expect(tree.everySubTree('ErrorableTextarea').some(box => box.props.name === 'benefitsToApplyTo')).to.be.true;
  });
});
