import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import ClaimPhase from '../../components/ClaimPhase';

describe('<ClaimPhase>', () => {
  it('should be pending when "current" is less than "phase"', () => {
    const { container } = render(<ClaimPhase current={1} phase={2} />);
    expect(
      $('va-process-list-item', container).getAttribute('pending'),
    ).to.equal('true');
  });

  it('should have a checkmark when "current" is greater than "phase"', () => {
    const { container } = render(<ClaimPhase current={2} phase={1} />);
    expect(
      $('va-process-list-item', container).getAttribute('checkmark'),
    ).to.equal('true');
  });

  it('should be active when "current" is equal to "phase"', () => {
    const { container } = render(<ClaimPhase current={1} phase={1} />);
    expect(
      $('va-process-list-item', container).getAttribute('active'),
    ).to.equal('true');
  });

  it('should show the correct title for phase 1', () => {
    const { container } = render(<ClaimPhase current={1} phase={1} />);
    expect(
      $('va-process-list-item', container).getAttribute('header'),
    ).to.equal('Claim received');
  });

  it('should show the correct title for phase 2', () => {
    const { container } = render(<ClaimPhase current={1} phase={2} />);
    expect(
      $('va-process-list-item', container).getAttribute('header'),
    ).to.equal('Initial review');
  });

  it('should show the correct title for phase 3', () => {
    const { container } = render(<ClaimPhase current={1} phase={3} />);
    expect(
      $('va-process-list-item', container).getAttribute('header'),
    ).to.equal('Evidence gathering, review, and decision');
  });

  it('should show the correct title for phase 4', () => {
    const { container } = render(<ClaimPhase current={1} phase={4} />);
    expect(
      $('va-process-list-item', container).getAttribute('header'),
    ).to.equal('Preparation for notification');
  });

  it('should show the correct title for phase 5', () => {
    const { container } = render(<ClaimPhase current={1} phase={5} />);
    expect(
      $('va-process-list-item', container).getAttribute('header'),
    ).to.equal('Complete');
  });

  it('should show children elements', () => {
    const { container } = render(
      <ClaimPhase current={1} phase={5}>
        <p>Test</p>
      </ClaimPhase>,
    );
    expect($('va-process-list-item > p', container)).to.exist;
  });
});
