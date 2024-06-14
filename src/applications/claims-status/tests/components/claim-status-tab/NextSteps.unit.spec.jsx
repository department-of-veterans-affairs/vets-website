import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import NextSteps from '../../../components/claim-status-tab/NextSteps';

describe('<NextSteps>', () => {
  it('should render next steps section with 4 links', () => {
    const { container, queryByText } = render(<NextSteps />);

    const links = $$('a', container);
    expect(links.length).to.eq(4);
    expect(queryByText('Next steps')).to.exist;
  });
});
