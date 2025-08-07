import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import NeedsMissingInfoAlert, {
  heading,
} from '../../components/NeedsMissingInfoAlert';

describe('<NeedsMissingInfoAlert>', () => {
  const setup = (missing, formId) => {
    return (
      <div>
        <NeedsMissingInfoAlert missing={missing} formId={formId} />
      </div>
    );
  };
  it('should render', () => {
    const { container } = render(setup('date of birth'));
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.eq(heading);
    expect($('p', container).textContent).to.contain(
      'make sure we have your date of birth.',
    );
  });

  it('should render with default form name when no formId provided', () => {
    const { container } = render(setup('date of birth'));
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.eq(heading);
    expect($('p', container).textContent).to.contain(
      'make sure we have your date of birth.',
    );
    expect($('p', container).textContent).to.contain(
      'fill out a appeal request.', // Default fallback
    );
  });

  it('should render with Board Appeal form name for formId 10182', () => {
    const { container } = render(setup('date of birth', '10182'));
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.eq(heading);
    expect($('p', container).textContent).to.contain(
      'make sure we have your date of birth.',
    );
    expect($('p', container).textContent).to.contain(
      'fill out a Board Appeal request.',
    );
  });

  it('should render with Supplemental Claim form name for formId 20-0995', () => {
    const { container } = render(setup('Social Security number', '20-0995'));
    expect($('va-alert', container)).to.exist;
    expect($('p', container).textContent).to.contain(
      'fill out a Supplemental Claim request.',
    );
  });

  it('should render with Higher-Level Review form name for formId 20-0996', () => {
    const { container } = render(setup('full name', '20-0996'));
    expect($('va-alert', container)).to.exist;
    expect($('p', container).textContent).to.contain(
      'fill out a Higher-Level Review request.',
    );
  });

  it('should capture google analytics', async () => {
    global.window.dataLayer = [];
    render(setup('date of birth, fullname, and Social Security number'));

    await waitFor(() => {
      const event = global.window.dataLayer.slice(-1)[0];
      expect(event).to.deep.equal({
        event: 'visible-alert-box',
        'alert-box-type': 'warning',
        'alert-box-heading': heading,
        'error-key': 'missing_ssn_or_dob',
        'alert-box-full-width': false,
        'alert-box-background-only': false,
        'alert-box-closeable': false,
        'reason-for-alert':
          'Missing date of birth, fullname, and Social Security number',
      });
    });
  });
});
