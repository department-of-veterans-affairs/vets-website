import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { COE_ELIGIBILITY_STATUS } from '../../../shared/constants';
import COEIntroPageBox from '../../content/COEIntroPageBox';

describe('COEIntroPageBox', () => {
  const props = {
    referenceNumber: '1234567',
    requestDate: new Date().getTime(),
  };
  it('should render available status', () => {
    const { container } = render(
      <COEIntroPageBox {...props} status={COE_ELIGIBILITY_STATUS.available} />,
    );
    expect($('h2', container).textContent).to.contain('You already have a COE');
  });
  it('should render denied status', () => {
    const { container } = render(
      <COEIntroPageBox {...props} status={COE_ELIGIBILITY_STATUS.denied} />,
    );
    expect($('h2', container).textContent).to.contain(
      'We denied your request for a COE',
    );
  });
  it('should render eligible status', () => {
    const { container } = render(
      <COEIntroPageBox {...props} status={COE_ELIGIBILITY_STATUS.eligible} />,
    );
    expect($('h2', container).textContent).to.contain(
      'Congratulations on your automatic COE',
    );
  });
  it('should render ineligible status', () => {
    const { container } = render(
      <COEIntroPageBox
        {...props}
        status={COE_ELIGIBILITY_STATUS.unableToDetermine}
      />,
    );
    expect($('h2', container).textContent).to.contain(
      'You didn’t automatically receive a COE',
    );
  });
  it('should render pending status', () => {
    const { container } = render(
      <COEIntroPageBox {...props} status={COE_ELIGIBILITY_STATUS.pending} />,
    );
    expect($('h2', container).textContent).to.contain(
      'We’re reviewing your request',
    );
  });
});
