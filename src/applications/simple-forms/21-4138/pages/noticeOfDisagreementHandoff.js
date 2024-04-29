import React from 'react';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const nodOldHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way for you to ask for a decision review",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:noticeOfDisagreementContent': {
      'ui:description': (
        <div>
          <p>
            Since it’s been more than 1 year since we made a decision, you
            should file a <strong>Supplemental claim.</strong>
          </p>
          <p>
            We can help you gather any new evidence you identify (such as
            medical records) to support your claim.
          </p>
          <p>
            A reviewer will decide if this new evidence changes the decision.
          </p>
          <div
            className="usa-button-primary"
            style={{
              padding: '12px',
            }}
          >
            <a
              className="vads-c-action-link--white"
              href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start"
            >
              File a Supplemental Claim online
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <a
              href="/decision-reviews/supplemental-claim/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about supplemental claims (opens in new tab)
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            If you’d like to use VA Form 21-4138 for your statement without
            selecting an answer here, you can{' '}
            <a href="/supporting-forms-for-claims/support-statement-21-4138/name-and-date-of-birth">
              go to VA Form 21-4138 now.
            </a>
          </div>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const nodSupplementalHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way for you to ask for a decision review",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:noticeOfDisagreementContent': {
      'ui:description': (
        <div>
          <p>
            Based on your answer, you may want to file a{' '}
            <strong>Supplemental claim.</strong>
          </p>
          <p>
            We can help you gather any new evidence you identify (such as
            medical records) to support your claim.
          </p>
          <p>
            A reviewer will decide if this new evidence changes the decision.
          </p>
          <div
            className="usa-button-primary"
            style={{
              padding: '12px',
            }}
          >
            <a
              className="vads-c-action-link--white"
              href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start"
            >
              File a Supplemental Claim online
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <a
              href="/decision-reviews/supplemental-claim/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about supplemental claims (opens in new tab)
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            If you’d like to use VA Form 21-4138 for your statement without
            selecting an answer here, you can{' '}
            <a href="/supporting-forms-for-claims/support-statement-21-4138/name-and-date-of-birth">
              go to VA Form 21-4138 now.
            </a>
          </div>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const nodHLRHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way for you to ask for a decision review",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:noticeOfDisagreementContent': {
      'ui:description': (
        <div>
          <p>
            Based on your answer, you may want to request a{' '}
            <strong>Higher-Level Review.</strong> A higher-level reviewer can
            review the case again and determine whether an error or a difference
            of opinion changes the decision.
          </p>
          <p>
            This is not the right option for you if you would like to submit new
            evidence.
          </p>
          <p>
            For disability compensation claims, you can request a Higher-Level
            Review online.
          </p>
          <div
            className="usa-button-primary"
            style={{
              padding: '12px',
            }}
          >
            <a
              className="vads-c-action-link--white"
              href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start"
            >
              Request a High-Level Review online
            </a>
          </div>
          <p>
            <strong>Note:</strong> At this time, you can use our online
            Higher-Level Review form for only disability compensation claims.
            For other types of claims, you’ll need to request a Higher-Level
            Review either by mail or in person.
          </p>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <a
              href="/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996"
              target="_blank"
              rel="noopener noreferrer"
            >
              <va-icon
                size={4}
                icon="see Storybook for icon names: https://design.va.gov/storybook/?path=/docs/uswds-va-icon--default"
                className="vads-u-margin-right--1"
                aria-hidden="true"
              />
              <span className="vads-u-margin-left--0p25 vads-u-font-weight--bold">
                Get VA Form 20-0996 to download
              </span>
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <a
              href="/decision-reviews/higher-level-review/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about Higher-Level Reviews and how to request one
              (opens in new tab)
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            If you’d like to use VA Form 21-4138 for your statement without
            selecting an answer here, you can{' '}
            <a href="/supporting-forms-for-claims/support-statement-21-4138/name-and-date-of-birth">
              go to VA Form 21-4138 now.
            </a>
          </div>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const nodBAHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way for you to ask for a decision review",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:noticeOfDisagreementContent': {
      'ui:description': (
        <div>
          <p>
            Based on your answer, you may want to request a{' '}
            <strong>Board Appeal.</strong> That means a Veterans Law Judge at
            the Board of Veterans’ Appeals will review your case.
          </p>
          <p>
            When you fill out the form, you’ll need to request the type of
            review you want from the Board:
          </p>
          <ul style={{ margin: '6px' }}>
            <li>
              <strong>Direct review</strong>, if you don’t want to submit
              evidence or have a hearing
            </li>
            <li>
              <strong>Evidence submission</strong>, if you want to submit
              additional evidence without a hearing
            </li>
            <li>
              <strong>Hearing</strong>, if you want to have a hearing with a
              Veterans Law Judge (with or without new evidence)
            </li>
          </ul>
          <div
            className="usa-button-primary"
            style={{
              padding: '12px',
            }}
          >
            <a
              className="vads-c-action-link--white"
              href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start"
            >
              Request a Board Appeal online
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <a
              href="/decision-reviews/higher-level-review/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about Board Appeals and how to request one (opens in
              new tab)
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            If you’d like to use VA Form 21-4138 for your statement without
            selecting an answer here, you can{' '}
            <a href="/supporting-forms-for-claims/support-statement-21-4138/name-and-date-of-birth">
              go to VA Form 21-4138 now.
            </a>
          </div>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
