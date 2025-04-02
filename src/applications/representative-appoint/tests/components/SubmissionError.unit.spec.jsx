import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import SubmissionError from '../../components/SubmissionError';

describe('SubmissionError', () => {
  it('should render', async () => {
    global.window.dataLayer = [];
    const form = { inProgressFormId: '1234' };
    const heading = 'We couldn’t generate your form';

    const { container, rerender } = render(
      <div>
        <SubmissionError form={form} />
      </div>,
    );

    expect($('va-alert[status="error"]', container)).to.exist;

    const h3 = $('h3', container);
    expect(h3.textContent).to.eq(heading);

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
