import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimPhaseStepper from '../../../components/claim-overview-tab/ClaimPhaseStepper';
import { renderWithRouter } from '../../utils';

describe('<ClaimPhaseStepper>', () => {
  const claimDate = '2024-01-16';
  const currentClaimPhaseDate = '2024-03-07';

  it('should render a ClaimPhaseStepper section where step 1 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhaseStep={1}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;
    const currentPhase = $('#phase1 .current-phase', container);
    expect(currentPhase).to.exist;
    getByText('We started working on your claim on January 16, 2024');
  });

  it('should render a ClaimPhaseStepper section where step 2 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhaseStep={2}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;
    const currentPhase = $('#phase2 .current-phase', container);
    expect(currentPhase).to.exist;
    getByText(
      'We’ll check your claim for basic information we need, like your name and Social Security number.',
    );
    getByText(
      'If basic information is missing, we’ll contact you to gather that information.',
    );
  });

  it('should render a ClaimPhaseStepper section where step 3 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhaseStep={3}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;
    const currentPhase = $('#phase3 .current-phase', container);
    expect(currentPhase).to.exist;

    const stepRepeats = $('#phase3 .repeat-phase', container);
    expect(stepRepeats).to.exist;

    getByText(
      'We’ll review your claim and make sure we have all the evidence and information we need. If we need more evidence to decide your claim, we may gather it in these ways:',
    );
    getByText('This is usually the longest step in the process.');
    getByText(
      'Note: You can submit evidence at any time. But if you submit evidence after this step, your claim will go back to this step for review.',
    );
  });
  it('should render a ClaimPhaseStepper section where step 4 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhaseStep={4}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;
    const currentPhase = $('#phase4 .current-phase', container);
    expect(currentPhase).to.exist;

    const stepRepeats = $('#phase4 .repeat-phase', container);
    expect(stepRepeats).to.exist;

    getByText('We’ll review all the evidence for your claim.');
    getByText(
      'If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
    );
  });
});
