import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { focusIssue, focusRadioH3, focusAlertH3 } from '../../utils/focus';
import { LAST_ISSUE } from '../../constants';

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

describe('focusRadioH3', () => {
  const renderPage = (hasRadio = true) =>
    render(
      <div id="main">
        {hasRadio ? (
          <va-radio label-header-level="3" label="test">
            <va-radio-option label="1" name="test" value="1" />
            <va-radio-option label="2" name="test" value="2" />
          </va-radio>
        ) : (
          <div className="nav-header">
            <h2>test 2</h2>
          </div>
        )}
      </div>,
    );

  // h3 is inside shadow DOM, so test isn't working properly with RTL
  it.skip('should focus on H3', async () => {
    const { container } = await renderPage();

    await focusRadioH3();
    await waitFor(() => {
      const target = $('va-radio', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should focus on H2', async () => {
    const { container } = await renderPage(false);

    await focusRadioH3();
    await waitFor(() => {
      const target = $('h2', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});

describe('focusAlertH3', () => {
  const renderPage = () =>
    render(
      <div id="main">
        <h3>test</h3>
      </div>,
    );

  it('should focus on H3', async () => {
    const { container } = await renderPage();

    await focusAlertH3();
    await waitFor(() => {
      const target = $('h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});
