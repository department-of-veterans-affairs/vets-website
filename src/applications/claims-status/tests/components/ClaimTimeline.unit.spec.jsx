import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ClaimTimeline from '../../components/ClaimTimeline';

const phases = [
  { phase: 1 },
  { phase: 2 },
  { phase: 3 },
  { phase: 4 },
  { phase: 5 },
];

describe('<ClaimTimeline>', () => {
  const subject = (phase, currentPhaseBack = false) => {
    const { container, getByRole, queryByTestId } = render(
      <ClaimTimeline currentPhaseBack={currentPhaseBack} phase={phase} />,
    );
    const h3Element = getByRole('heading', { level: 3 });

    const selectors = () => ({
      title: h3Element.textContent,
      vaProcessList: container.querySelector('va-process-list'),
      vaProcessListItems: container.querySelectorAll(
        'va-process-list-item[active="true"]',
      ),
      warning: queryByTestId('phase-back-warning'),
    });
    return { selectors };
  };
  phases.forEach(({ phase }) => {
    it(`should render ${phase} phase(s) and no <PhaseBackWarning/>`, () => {
      const { selectors } = subject(phase);
      const { title, vaProcessList, vaProcessListItems, warning } = selectors();
      expect(title).to.exist;
      expect(vaProcessList).to.exist;
      expect(vaProcessListItems).to.have.lengthOf(1);
      expect(warning).to.not.exist;
    });
  });

  it('should render <PhaseBackWarning/> for phase 6', () => {
    const { selectors } = subject(6, true);
    const { title, vaProcessList, vaProcessListItems, warning } = selectors();
    expect(title).to.exist;
    expect(vaProcessList).to.exist;
    expect(vaProcessListItems).to.have.lengthOf(1);
    expect(warning).to.exist;
  });
});
