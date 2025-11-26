import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { within } from '@testing-library/react';

import ClaimPhaseStepper from '../../../components/claim-overview-tab/ClaimPhaseStepper';
import { renderWithRouter } from '../../utils';

describe('<ClaimPhaseStepper>', () => {
  const claimDate = '2024-01-16';
  const currentClaimPhaseDate = '2024-03-07';

  it('should render a ClaimPhaseStepper section where there is accessibility text', () => {
    const { container } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={3}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const phaseCurrent = $('#phase3 va-icon.phase-current', container);
    expect(phaseCurrent).to.have.attr('srtext', 'Current');

    const phase2Complete = $('#phase2 va-icon.phase-complete', container);
    expect(phase2Complete).to.have.attr('srtext', 'Completed');
  });

  it('should render a ClaimPhaseStepper section where step 1 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={1}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase1 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase1 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    getByText('We started working on your claim on January 16, 2024');
  });

  it('should render a ClaimPhaseStepper section where step 2 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={2}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase2 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase2 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    getByText(
      'We’ll check your claim for basic information we need, like your name and Social Security number.',
    );
    getByText('If information is missing, we’ll contact you.');
  });

  it('should render a ClaimPhaseStepper section where step 3 is the current step', () => {
    const { container, getByText, getByTestId } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={3}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase3 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase3 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    const phaseRepeats = $('#phase3 .repeat-phase', container);
    expect(phaseRepeats).to.exist;

    getByText(
      'We’ll review your claim and make sure we have all the evidence and information we need. If we need more evidence to decide your claim, we may gather it in these ways:',
    );
    getByText('This is usually the longest step in the process.');
    getByText(
      'Note: You can submit evidence at any time. But if you submit evidence after this step, your claim will go back to this step for review.',
    );
    expect(getByTestId('upload-evidence-link').textContent).to.equal(
      'Upload your evidence here',
    );
    expect(
      getByTestId('learn-more-about-va-claim-exams-link').getAttribute('text'),
    ).to.equal('Learn more about VA claim exams');
  });

  it('should render a ClaimPhaseStepper section where step 4 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={4}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase4 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase4 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    const phaseRepeats = $('#phase4 .repeat-phase', container);
    expect(phaseRepeats).to.exist;

    getByText('We’ll review all the evidence for your claim.');
    const phaseText = $('#phase4, container');
    expect(
      within(phaseText).getByText(
        'If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
      ),
    ).to.exist;
  });

  it('should render a ClaimPhaseStepper section where step 5 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={5}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase5 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase5 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    const phaseRepeats = $('#phase5 .repeat-phase', container);
    expect(phaseRepeats).to.exist;

    getByText('We’ll decide your claim and determine your disability rating.');
    const phaseText = $('#phase6, container');
    expect(
      within(phaseText).getByText(
        'If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
      ),
    ).to.exist;
  });

  it('should render a va-alert when currentPhaseBack is true for the current phase', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={3}
        currentPhaseBack
      />,
    );

    expect($('.claim-phase-stepper', container)).to.exist;

    const alert = container.querySelector('.optional-alert');
    expect(alert).to.exist;

    getByText(
      'We moved your claim back to this step because we needed to find or review more evidence',
    );

    const phaseRepeats = $('#phase3 .repeat-phase', container);
    expect(phaseRepeats).to.not.exist;
  });

  it('should render the "Step may repeat" message for other phases when currentPhaseBack is true', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={4}
        currentPhaseBack
      />,
    );

    expect($('.claim-phase-stepper', container)).to.exist;

    getByText(
      'We moved your claim back to this step because we needed to find or review more evidence',
    );

    const phase3Repeat = $('#phase3 .repeat-phase', container);
    expect(phase3Repeat).to.exist;
    const phase5Repeat = $('#phase5 .repeat-phase', container);
    expect(phase5Repeat).to.exist;
    const phase6Repeat = $('#phase6 .repeat-phase', container);
    expect(phase6Repeat).to.exist;
  });

  it('should render a ClaimPhaseStepper section where step 6 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={6}
      />,
    );
    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase6 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase6 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    const phaseRepeats = $('#phase6 .repeat-phase', container);
    expect(phaseRepeats).to.exist;

    getByText('We’ll prepare your decision letter.');
    getByText(
      'If you’re eligible for disability benefits, this letter will include your disability rating, the amount of your monthly payments, and the date your payments will start.',
    );
    const phaseText = $('#phase6, container');
    expect(
      within(phaseText).getByText(
        'If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
      ),
    ).to.exist;
  });

  it('should render a ClaimPhaseStepper section where step 7 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={7}
      />,
    );

    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase7 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    const phaseComplete = $('#phase7 va-icon.phase-current', container);
    expect(phaseComplete).to.exist;

    const phaseRepeats = $('#phase7 .repeat-phase', container);
    expect(phaseRepeats).to.not.exist;

    getByText(
      'A senior reviewer will do a final review of your claim and the decision letter.',
    );
  });

  it('should render a ClaimPhaseStepper section where step 8 is the current step', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimPhaseStepper
        claimDate={claimDate}
        currentClaimPhaseDate={currentClaimPhaseDate}
        currentPhase={8}
      />,
    );

    expect($('.claim-phase-stepper', container)).to.exist;

    const currentPhase = $('#phase8 .current-phase', container);
    expect(
      within(currentPhase).getByText(
        'Your claim is in this step as of March 7, 2024.',
      ),
    ).to.exist;

    expect(within($('#phase8', container)).getByRole('link')).to.have.text(
      'Go to the claim letters page',
    );

    const phaseComplete = $('#phase8 va-icon.phase-complete', container);
    expect(phaseComplete).to.exist;

    const phaseRepeats = $('#phase8 .repeat-phase', container);
    expect(phaseRepeats).to.not.exist;

    getByText(
      'You’ll be able to view and download your decision letter on the status page for this claim.',
    );
    getByText(
      'We’ll also send you a copy of your decision letter by mail. It should arrive within 10 business days, but it may take longer.',
    );
  });
});
