import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import {
  // focusRadioH3,
  focusH3,
  focusIssue,
  focusEvidence,
  focusUploads,
} from '../../utils/focus';
import { LAST_ISSUE } from '../../../shared/constants';

// Skipping focusRadioH3 because testing library doesn't support shadow DOM
/* describe('focusRadioH3', () => {
     it('should focus on H3 inside va-radio shadow DOM', () => {
       render(
         <div>
           <va-radio label="Label H3" label-header-level="3" />
         </div>,
       );
     });
  }); */

describe('focusH3', () => {
  it('should focus on H3 inside alert', async () => {
    const { container } = render(
      <div>
        <va-alert status="error">
          <h3 slot="headline">H3 text</h3>
        </va-alert>
      </div>,
    );

    focusH3();

    await waitFor(() => {
      const h3 = $('h3', container);
      expect(document.activeElement).to.eq(h3);
    });
  });
});

describe('focusIssue', () => {
  afterEach(() => {
    window.sessionStorage.removeItem(LAST_ISSUE);
  });
  const renderPage = () =>
    render(
      <div id="main">
        <h3>Title</h3>
        <ul>
          <li id="issue-0">
            <input />
            <a href="#0" className="edit-issue-link">
              Edit
            </a>
          </li>
          <li id="issue-1">
            <input />
            <a href="#1" className="edit-issue-link">
              Edit
            </a>
          </li>
        </ul>
        <a href="#new" className="add-new-issue">
          Add
        </a>
      </div>,
    );

  it('should focus on header', async () => {
    window.sessionStorage.removeItem(LAST_ISSUE);
    const { container } = await renderPage();

    await focusIssue(0, container);
    await waitFor(() => {
      const target = $('h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on add new issue link', async () => {
    window.sessionStorage.setItem(LAST_ISSUE, -1);
    const { container } = await renderPage();

    await focusIssue(0, container);
    await waitFor(() => {
      const target = $('.add-new-issue', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on second input', async () => {
    window.sessionStorage.setItem(LAST_ISSUE, '1,updated');
    const { container } = await renderPage();

    await focusIssue(0, container);
    await waitFor(() => {
      const target = $('#issue-1 input', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on second edit link', async () => {
    window.sessionStorage.setItem(LAST_ISSUE, '1,cancel');
    const { container } = await renderPage();

    await focusIssue(0, container);
    await waitFor(() => {
      const target = $('#issue-1 .edit-issue-link', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});

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
