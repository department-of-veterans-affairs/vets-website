import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '~/platform/forms-system/src/js/utilities/ui';
import * as focusUtils from '~/platform/utilities/ui/focus';

import {
  focusH3,
  focusRadioH3,
  focusIssue,
  focusAlertH3,
  focusEvidence,
  focusToggledHeader,
} from '../../utils/focus';
import { LAST_ISSUE } from '../../constants';

describe('focusH3', () => {
  const renderPage = () =>
    render(
      <div id="main">
        <h3>test</h3>
      </div>,
    );

  it('should focus on H3', async () => {
    const { container } = await renderPage();

    await focusH3(null, container);
    await waitFor(() => {
      const target = $('h3', container);
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

  it('should focus on H3', async () => {
    // h3 is inside shadow DOM (not supported in RTL), so test by stubbing
    // waitForRenderThenFocus
    const focusSpy = sinon.spy(focusUtils, 'waitForRenderThenFocus');
    const { container } = await renderPage();

    await focusRadioH3(null, container);
    await waitFor(() => {
      expect(focusSpy.args[0][0]).to.eq('h3');
      focusSpy.restore();
    });
  });
  it('should focus on H2', async () => {
    const { container } = await renderPage(false);

    await focusRadioH3(null, container);
    await waitFor(() => {
      const target = $('h2', container);
      expect(document.activeElement).to.eq(target);
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

describe('focusAlertH3', () => {
  const renderPage = () =>
    render(
      <div id="main">
        <h3>test</h3>
      </div>,
    );

  it('should focus on H3', async () => {
    const { container } = await renderPage();

    await focusAlertH3(null, container);
    await waitFor(() => {
      const target = $('h3', container);
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

describe('focusToggledHeader', () => {
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
            <h3>test 2</h3>
          </div>
        )}
      </div>,
    );

  it('should focus on H3 inside va-radio', async () => {
    global.sessionStorage.setItem('hlrUpdated', 'false');
    const focusSpy = sinon.spy(focusUtils, 'waitForRenderThenFocus');
    const { container } = await renderPage();

    await focusToggledHeader(null, container);
    await waitFor(() => {
      expect(focusSpy.args[0][0]).to.eq('h3');
      focusSpy.restore();
    });
  });
  it('should focus on H3', async () => {
    global.sessionStorage.setItem('hlrUpdated', 'true');
    const { container } = await renderPage(false);

    await focusToggledHeader(null, container);
    await waitFor(() => {
      const target = $('h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
});
