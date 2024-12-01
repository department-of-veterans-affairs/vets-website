import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $ } from '~/platform/forms-system/src/js/utilities/ui';
import * as focusUtils from '~/platform/utilities/ui/focus';
import * as focusReview from 'platform/forms-system/src/js/utilities/ui/focus-review';

import {
  focusFileCard,
  focusAddAnotherButton,
  focusCancelButton,
  focusOnAlert,
  focusH3AfterAlert,
} from '../../utils/focus';

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

describe('focusCancelButton', () => {
  let focusElementSpy;
  beforeEach(() => {
    focusElementSpy = sinon.spy(focusUtils, 'focusElement');
  });

  afterEach(() => {
    focusElementSpy.restore();
    focusElementSpy = null;
  });

  const renderPage = (showUpload = true) =>
    render(
      <div id="main">
        <h3>Title</h3>
        <ul className="schemaform-file-list">
          <li id="root_evidence_file_0" className="va-growable-background">
            {showUpload && (
              <div className="schemaform-file-uploading">
                <strong id="root_evidence_file_name_0">Test.pdf</strong>
                <br />
                <va-progress-bar percent="80" />
                <va-button
                  secondary
                  class="cancel-upload vads-u-width--auto"
                  label="Cancel upload of Test.pdf"
                  text="Cancel"
                />
              </div>
            )}
          </li>
        </ul>
        <div id="upload-wrap">
          <va-button
            id="upload-button"
            secondary
            class="vads-u-padding-x--0 vads-u-padding-y--1"
            label="Add another file evidence to be reviewed by the Board"
            text="Add another file"
          />
        </div>
      </div>,
    );

  it('should focus on cancel button', async () => {
    const { container } = await renderPage();

    await focusCancelButton(container);
    await waitFor(() => {
      expect(focusElementSpy.called).to.be.true;
      expect(focusElementSpy.args[0][0]).to.eq('button');
    });
  });
  it('should not call focus', async () => {
    const { container } = await renderPage(false);

    await focusCancelButton(container);
    await waitFor(() => {
      expect(focusElementSpy.notCalled).to.be.true;
    });
  });
});

describe('focusAddAnotherButton', () => {
  let focusElementSpy;
  beforeEach(() => {
    focusElementSpy = sinon.spy(focusUtils, 'focusElement');
  });

  afterEach(() => {
    focusElementSpy.restore();
    focusElementSpy = null;
  });

  const renderPage = (showButton = true) =>
    render(
      <div id="main">
        <h3>Title</h3>
        <ul className="schemaform-file-list" />
        <div id="upload-wrap">
          {showButton && (
            <va-button
              id="upload-button"
              secondary
              class="vads-u-padding-x--0 vads-u-padding-y--1"
              label="Add another file evidence to be reviewed by the Board"
              text="Add another file"
            />
          )}
        </div>
      </div>,
    );

  it('should focus on add another button', async () => {
    const { container } = await renderPage();

    await focusAddAnotherButton(container);
    await waitFor(() => {
      expect(focusElementSpy.args[0][0]).to.eq('button, #upload-button');
    });
  });
  it('should not call focus', async () => {
    const { container } = await renderPage();

    await focusAddAnotherButton(container);
    await waitFor(() => {
      expect(focusElementSpy.notCalled).to.be.true;
    });
  });
});

describe('focusOnAlert', () => {
  const renderPage = (hasErrorAlert = true) =>
    render(
      <div id="main">
        <div />
        <va-alert status="info">
          <h3>Test</h3>
        </va-alert>
        {hasErrorAlert && (
          <va-alert status="error">
            <h3>Test 2</h3>
          </va-alert>
        )}
      </div>,
    );

  it('should focus on alert', async () => {
    const { container } = await renderPage();

    await focusOnAlert();
    await waitFor(() => {
      const target = $('va-alert[status="error"] h3', container);
      expect(document.activeElement).to.eq(target);
    });
  });
  it('should not focus on alert', async () => {
    await renderPage(false);

    await focusOnAlert();
    await waitFor(() => {
      expect(document.activeElement?.tagName).to.eq('BODY');
    });
  });
});

describe('focusH3AfterAlert', () => {
  let focusElementSpy;
  let focusReviewSpy;
  beforeEach(() => {
    focusElementSpy = sinon.stub(focusUtils, 'focusElement');
    focusReviewSpy = sinon.stub(focusReview, 'focusReview');
  });
  afterEach(() => {
    focusElementSpy.restore();
    focusReviewSpy.restore();
  });

  const setup = () =>
    render(
      <div id="main">
        <div name="topContentElement" />
        <div name="testScrollElement" />
        <div>
          <va-alert status="info" visible="false">
            <h3 id="alert" slot="headline">
              Alert header
            </h3>
          </va-alert>
          <h3 id="header">Page header</h3>
        </div>
      </div>,
    );

  it('should focus on h3 outside of va-alert on review page', async () => {
    setup();

    await focusH3AfterAlert();
    await waitFor(() => {
      expect(focusElementSpy.args[0][0]).to.eq('h3#header');
    });
  });

  it('should focus on header on review page', async () => {
    setup();

    await focusH3AfterAlert(null, { name: 'test', onReviewPage: true });
    await waitFor(() => {
      expect(focusReviewSpy.args[0]).to.deep.equal(['test', true, true]);
    });
  });
});
