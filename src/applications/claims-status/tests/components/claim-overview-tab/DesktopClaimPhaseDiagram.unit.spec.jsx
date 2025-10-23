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
});
