import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import ClaimTimeline from '../../components/ClaimTimeline';

describe('<ClaimTimeline>', () => {
  it('should render 5 phases', () => {
    const events = [];

    const tree = SkinDeep.shallowRender(
      <ClaimTimeline events={events} phase={6} />,
    );

    expect(tree.everySubTree('ClaimPhase').length).to.equal(5);
  });

  it('should render phase back warning box for phase 6', () => {
    const events = [];

    const tree = SkinDeep.shallowRender(
      <ClaimTimeline events={events} currentPhaseBack phase={6} />,
    );

    expect(tree.subTree('PhaseBackWarning')).not.to.be.false;
  });

  it('should not render phase back warning box if not in phase 6', () => {
    const events = [];

    const tree = SkinDeep.shallowRender(
      <ClaimTimeline events={events} currentPhaseBack phase={4} />,
    );

    expect(tree.subTree('PhaseBackWarning')).to.be.false;
  });
});
