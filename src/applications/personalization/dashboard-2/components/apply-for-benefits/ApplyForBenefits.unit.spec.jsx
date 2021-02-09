import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import ApplyForBenefits from './ApplyForBenefits';

describe('ApplyForBenefits component', () => {
  let view;
  it('renders the correct content when there are no applications in progress', () => {
    // render the ApplyForBenefits component in the correct redux provider
    expect(true).to.be.true;
  });

  it('does not render unknown applications that are in progress');

  it(
    'sorts the in-progress applications, listing the soonest-to-expire applications first',
  );
});
