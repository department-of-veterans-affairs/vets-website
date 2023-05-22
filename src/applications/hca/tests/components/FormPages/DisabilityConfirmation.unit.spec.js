import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DisabilityConfirmation from '../../../components/FormPages/DisabilityConfirmation';

describe('hca DisabilityConfirmation', () => {
  const props = { data: {}, goBack: () => {}, goForward: () => {} };

  it('should render', () => {
    const view = render(<DisabilityConfirmation {...props} />);
    const selector = view.container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.contain.text(
      'Confirm that you receive service-connected pay for a 50% or higher disability rating',
    );
  });

  it('should render progress buttons', () => {
    const view = render(<DisabilityConfirmation {...props} />);
    expect(
      view.container.querySelectorAll('.hca-progress-button'),
    ).to.have.lengthOf(2);
  });
});
