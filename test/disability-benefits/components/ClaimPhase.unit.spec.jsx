import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimPhase from '../../../src/js/disability-benefits/components/ClaimPhase';

describe('<ClaimPhase>', () => {
  it('should render activity when on current phase', () => {
    const activity = {
      1: [
        {
          type: 'filed',
          date: '2010-05-04'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <ClaimPhase
          id={2}
          current={1}
          phase={1}
          activity={activity}/>
    );
    expect(tree.everySubTree('.claims-evidence').length).to.equal(1);
  });
  it('should not render activity when on current phase', () => {
    const activity = {
      1: [
        {
          type: 'filed',
          date: '2010-05-04'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <ClaimPhase
          id={2}
          current={1}
          phase={3}
          activity={activity}/>
    );
    expect(tree.everySubTree('.claims-evidence').length).to.equal(0);
  });
  it('should display filed message', () => {
    const activity = {
      1: [
        {
          type: 'filed',
          date: '2010-05-04'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <ClaimPhase
          id={2}
          current={1}
          phase={1}
          activity={activity}/>
    );
    expect(tree.everySubTree('.claims-evidence-item')[0].text()).to.equal('Thank you. VA received your claim');
  });
  it('should display requested message', () => {
    const activity = {
      1: [
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <ClaimPhase
          id={2}
          current={1}
          phase={1}
          activity={activity}/>
    );
    expect(tree.everySubTree('.claims-evidence-item')[0].text()).to.equal('We added a notice for: <Link />');
  });
  it('should display show older updates button', () => {
    const activity = {
      1: [
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        },
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        },
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        },
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        },
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        },
        {
          type: 'still_need_from_you_list',
          date: '2010-05-04',
          displayName: 'Needed file'
        }
      ]
    };

    const tree = SkinDeep.shallowRender(
      <ClaimPhase
          id={2}
          current={1}
          phase={1}
          activity={activity}/>
    );
    expect(tree.everySubTree('button').length).to.equal(1);
  });
});
