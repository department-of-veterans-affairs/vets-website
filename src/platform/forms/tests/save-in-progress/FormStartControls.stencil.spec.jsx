// eslint-disable-next-line no-unused-vars
import React from 'react';
import { expect } from 'chai';
import { newSpecPage } from '@stencil/core/testing';

import { WIZARD_STATUS_RESTARTING } from 'platform/site-wide/wizard';
import { FormStartControls } from '../../save-in-progress/FormStartControls';

describe('Schemaform <FormStartControls>', () => {
  const wizardStorageKey = 'testKey';
  const restartDestination = '/test-page';
  const oldDataLayer = global.window.dataLayer;

  afterEach(() => {
    global.window.dataLayer = oldDataLayer;
    global.window.sessionStorage.removeItem(wizardStorageKey);
  });

  it('should show modal and remove form when starting over', async () => {
    const routerSpy = {
      push: () => {},
    };
    const fetchSpy = () => {};

    const page = await newSpecPage({
      components: [FormStartControls],
      html: `<FormStartControls
        formId="1010ez"
        migrations={[]}
        router='${JSON.stringify(routerSpy)}'
        formSaved
        removeInProgressForm='${JSON.stringify(fetchSpy)}'
        prefillAvailable
        routes='${JSON.stringify([
          {},
          {
            formConfig: {
              wizardStorageKey,
              saveInProgress: {
                restartFormCallback: () => restartDestination,
              },
            },
          },
        ])}'
      />`,
      supportsShadowDom: true,
    });

    const startButton = page.root.shadowRoot.querySelector(
      'button[value="Start a new application"]',
    );
    startButton.click();
    await page.waitForChanges();

    const modalPrimaryButton = page.root.shadowRoot.querySelector(
      'button:contains("Start Over")',
    );
    modalPrimaryButton.click();
    await page.waitForChanges();

    expect(fetchSpy).toHaveBeenCalled();
    expect(global.window.sessionStorage.getItem(wizardStorageKey)).toBe(
      WIZARD_STATUS_RESTARTING,
    );
  });
});
