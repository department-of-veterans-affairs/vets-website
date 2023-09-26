import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { focusEvidence, focusUploads } from '../../utils/focus';

import { LAST_ISSUE } from '../../../shared/constants';

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

describe('focusUploads', () => {
  afterEach(() => {
    window.sessionStorage.removeItem(LAST_ISSUE);
  });
  const renderPage = () =>
    render(
      <div id="main">
        <h3>Title</h3>
        <ul>
          <li id="root_additionalDocuments_file_0">
            <select id="root_additionalDocuments_0_attachmentId">
              <option> </option>
            </select>
          </li>
          <li id="root_additionalDocuments_file_1">
            <select id="root_additionalDocuments_1_attachmentId">
              <option> </option>
            </select>
          </li>
        </ul>
      </div>,
    );

  it('should focus on header', async () => {
    window.location.hash = '';
    const { container } = await renderPage();

    await focusUploads(0, container);
    await waitFor(() => {
      const target = $('h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on second file select', async () => {
    window.location.hash = '#1';
    const { container } = await renderPage();

    await focusUploads(0, container);
    await waitFor(() => {
      const target = $('#root_additionalDocuments_1_attachmentId', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});
