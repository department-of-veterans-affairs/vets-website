import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import MobileClaimPhaseDiagram from '../../../components/claim-overview-tab/MobileClaimPhaseDiagram';

describe('<MobileClaimPhaseDiagram>', () => {
  it('should render a MobileClaimPhaseDiagram section', () => {
    const { container } = render(<MobileClaimPhaseDiagram currentPhase={1} />);
    expect($('.mobile', container)).to.exist;
  });
});
