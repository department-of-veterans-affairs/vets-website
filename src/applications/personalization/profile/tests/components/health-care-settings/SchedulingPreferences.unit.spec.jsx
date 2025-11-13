import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import SchedulingPreferences from '../../../components/health-care-settings/SchedulingPreferences';
import { PROFILE_PATH_NAMES } from '../../../constants';

describe('SchedulingPreferences', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    expect(() => render(<SchedulingPreferences />)).to.not.throw();
  });

  it('renders the headline with correct title', () => {
    const { getByTestId } = render(<SchedulingPreferences />);

    const headline = getByTestId('scheduling-preferences-page-headline');
    expect(headline).to.have.text(PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES);
  });

  it('renders the description paragraph when there is no error', () => {
    const { getByText } = render(<SchedulingPreferences />);

    const description = getByText(
      /Manage your scheduling preferences for health care appointments/i,
    );
    expect(description).to.exist;
  });
});
