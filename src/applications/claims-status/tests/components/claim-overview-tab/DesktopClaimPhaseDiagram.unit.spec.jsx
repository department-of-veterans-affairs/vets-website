import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import DesktopClaimPhaseDiagram from '../../../components/claim-overview-tab/DesktopClaimPhaseDiagram';

describe('<DesktopClaimPhaseDiagram>', () => {
  it('should render a DesktopClaimPhaseDiagram section', () => {
    const { container } = render(<DesktopClaimPhaseDiagram currentPhase={1} />);
    expect($('.desktop', container)).to.exist;
  });
});
