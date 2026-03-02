import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import DesktopClaimPhaseDiagram from '../../../components/claim-overview-tab/DesktopClaimPhaseDiagram';

describe('<DesktopClaimPhaseDiagram>', () => {
  it('should render a DesktopClaimPhaseDiagram section', () => {
    const { container, getByTitle } = render(
      <DesktopClaimPhaseDiagram currentPhase={1} />,
    );
    expect($('.desktop', container)).to.exist;
    expect(
      getByTitle(
        'Your current step is 1 of 8 in the claims process. Steps 3 through 6 can be repeated.',
      ),
    );
  });

  it('should have proper accessibility attributes for iOS VoiceOver', () => {
    const { container } = render(<DesktopClaimPhaseDiagram currentPhase={5} />);
    const svg = $('svg', container);

    expect(svg).to.exist;
    expect(svg.getAttribute('role')).to.equal('img');
    expect(svg.getAttribute('aria-labelledby')).to.equal(
      'desktopClaimPhaseDiagramTitle',
    );

    const title = $('title#desktopClaimPhaseDiagramTitle', container);
    expect(title).to.exist;
    expect(title.textContent).to.equal(
      'Your current step is 5 of 8 in the claims process. Steps 3 through 6 can be repeated.',
    );
  });
});
