import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '~/platform/forms-system/src/js/utilities/ui';
import * as focusUtils from '~/platform/utilities/ui/focus';

import {
  focusIssue,
  focusFileCard,
  focusRadioH3,
  focusAlertH3,
} from '../../utils/focus';
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

describe('focusFileCard', () => {
  let focusElementSpy;
  beforeEach(() => {
    focusElementSpy = sinon.spy(focusUtils, 'focusElement');
  });

  afterEach(() => {
    focusElementSpy.restore();
  });

  const renderPage = () =>
    render(
      <div id="main">
        <ul className="schemaform-file-list">
          <li id="root_file_0" className="va-growable-background">
            <strong id="root_file_name_0">Test1.pdf</strong>
            <div>32KB</div>
            <div>
              <va-button
                secondary
                class="delete-upload vads-u-width--auto"
                label="Delete Test1.pdf"
                text="Delete file"
                uswds
              />
            </div>
          </li>
          <li id="root_file_1" className="va-growable-background">
            <strong id="root_file_name_1">Test2.pdf</strong>
            <div>35KB</div>
            <div>
              <va-button
                secondary
                class="delete-upload vads-u-width--auto"
                label="Delete Test2.pdf"
                text="Delete file"
                uswds
              />
            </div>
          </li>
          <li id="root_file_2" className="va-growable-background">
            <strong id="root_file_name_2">Test3.pdf</strong>
            <div>35KB</div>
            <div className="schemaform-file-attachment review">
              <va-select
                id="third-card-select"
                class="rjsf-web-component-field"
                label="Document type"
                name="root_additionalDocuments_0_attachmentId"
                required
                uswds
              >
                <option value="L015">Buddy/Lay Statement</option>
                <option value="L018">Civilian Police Reports</option>
              </va-select>
            </div>
            <div>
              <va-button
                secondary
                class="delete-upload vads-u-width--auto"
                label="Delete Test2.pdf"
                text="Delete file"
                uswds
              />
            </div>
          </li>
        </ul>
      </div>,
    );

  it('should focus on first card', async () => {
    const { container } = await renderPage();

    await focusFileCard('Test1.pdf', container);
    await waitFor(() => {
      expect(focusElementSpy.args[0][0].id).to.eq('root_file_0');
    });
  });
  it('should focus on second card', async () => {
    const { container } = await renderPage();

    await focusFileCard('Test2.pdf', container);
    await waitFor(() => {
      expect(focusElementSpy.args[0][0].id).to.eq('root_file_1');
    });
  });
  it('should focus on third card select', async () => {
    const { container } = await renderPage();

    await focusFileCard('Test3.pdf', container);
    await waitFor(() => {
      expect(focusElementSpy.args[0][0]).to.contain('select');
    });
  });
  it('should focus document', async () => {
    const { container } = await renderPage();

    await focusFileCard('Test4.pdf', container);
    await waitFor(() => {
      expect(focusElementSpy.notCalled).to.be.true;
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
    await renderPage();

    await focusRadioH3();
    await waitFor(() => {
      expect(focusSpy.args[0][0]).to.eq('h3');
      focusSpy.restore();
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
