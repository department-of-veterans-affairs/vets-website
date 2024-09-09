import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { focusEvidence } from '../../utils/focus';

describe('focusEvidence', () => {
  const renderPage = hasError =>
    render(
      <div id="main">
        <h3>Title</h3>
        {hasError ? <div error="true" /> : <div />}
      </div>,
    );

  it('should focus on header', async () => {
    const { container } = await renderPage();

    await focusEvidence(null, container);
    await waitFor(() => {
      const target = $('h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on error', async () => {
    const { container } = await renderPage(true);

    await focusEvidence(null, container);
    await waitFor(() => {
      const target = $('[error]', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});
