// @ts-check
import React from 'react';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('School closures and program suspension'),
    ...descriptionUI(
      <div>
        <va-card background>
          <h4
            className="vads-u-font-size--h3 vads-u-margin-top--0"
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex="0"
            role="alert"
            aria-live="assertive"
          >
            Based on your responses, you may not be eligible for entitlement
            restoration at this time
          </h4>
          <p>
            <strong>Your responses: </strong>
          </p>
          <p className="vads-u-display--flex">
            <va-icon icon="close" size="3" class="vads-u-margin-right--1p5" />
            You have not attended a school that suspended, closed, or withdrew
            your program.
          </p>
        </va-card>
        <p>
          <strong>
            Based on your answer, you might not qualify for education benefit
            entitlement restoration right now.
          </strong>{' '}
          You’ll need to have attended a school or program that was suspended,
          closed, or withdrawn to request and be found eligible for entitlement
          restoration.
        </p>
        <p>
          <va-link-action
            href="https://www.va.gov/"
            text="Exit request entitlement restoration"
          />
        </p>
        <p>
          If you’d still like to request education benefit entitlement
          restoration, you can continue with your request.
        </p>
      </div>,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
