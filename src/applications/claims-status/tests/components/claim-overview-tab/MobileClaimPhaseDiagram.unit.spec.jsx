import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import MobileClaimPhaseDiagram from '../../../components/claim-overview-tab/MobileClaimPhaseDiagram';

describe('<MobileClaimPhaseDiagram>', () => {
  it('should render a MobileClaimPhaseDiagram section', () => {
    const { container, getByTitle } = render(
      <MobileClaimPhaseDiagram currentPhase={1} />,
    );
    expect($('.mobile', container)).to.exist;
    expect(
      getByTitle(
        'Your current step is 1 of 8 in the claims process. Steps 3 through 6 can be repeated.',
      ),
    );
  });
});
