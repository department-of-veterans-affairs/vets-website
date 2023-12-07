import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import * as actions from '../../actions';
import AppContent from '../../components/AppContent';

describe('<AppContent>', () => {
  it('should render a loading indicator when requests are not done', async () => {
    const stub = sinon.stub(actions, 'getRatedDisabilities');

    const { container } = render(<AppContent />);

    expect($('va-loading-indicator', container)).to.exist;

    stub.resolves({ combinedDisabilityRating: 30, individualRatings: [] });

    await Promise.resolve();

    expect($('va-loading-indicator', container)).not.to.exist;
  });
});
