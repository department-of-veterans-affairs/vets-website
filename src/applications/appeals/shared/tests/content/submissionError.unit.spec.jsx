import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import SubmissionError from '../../content/submissionError';

describe('SubmissionError', () => {
  it('should render', async () => {
    global.window.dataLayer = [];
    const form = { inProgressFormId: '1234' };
    const heading = 'Your decision review request didn’t go through';

    const { container, rerender } = render(
      <div>
        <SubmissionError form={form} />
      </div>,
    );

    expect($('va-alert[status="error"]', container)).to.exist;
    expect($$('va-telephone', container).length).to.eq(2);

    const h3 = $('h3', container);
    expect(h3.textContent).to.eq(heading);

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'visible-alert-box',
      'alert-box-type': 'error',
      'alert-box-heading': heading,
      'error-key': 'submission_failure',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'Submission failure',
    });

    // rerendering to test alertRef scroll & focus branch (not working?)
    await rerender(
      <div>
        <SubmissionError form={form} />
      </div>,
    );

    await waitFor(() => {
      expect(document.activeElement).to.eq(h3);
    });
  });
});
