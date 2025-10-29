import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const Description = () => (
  <div>
    <p>
      Based on your answer, you’ll need to submit an Income and Asset Statement
      in Support of Claim for Pension or Parents’ Dependency and Indemnity
      Compensation (VA Form 21P-0969).
    </p>

    <p>
      <a
        href="https://www.va.gov/find-forms/about-form-21p-0969/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get VA Form 21P-0969 to download (opens in new tab)
      </a>
    </p>

    <p>
      We’ll give you instructions for submitting your documents at the end of
      this application.
    </p>
  </div>
);

const uiSchema = {
  ...titleUI('Submit supporting documents', Description),
};

const schema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema,
  schema,
};
