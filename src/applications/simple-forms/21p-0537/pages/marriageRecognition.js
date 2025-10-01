import React from 'react';

const MarriageRecognitionInfo = () => (
  <va-alert status="warning" uswds>
    <h3 slot="headline">Important information about marriage recognition</h3>
    <p>
      If you are certifying that you are married for the purpose of VA benefits,
      your marriage must be recognized by the place where you and/or your spouse
      resided at the time of marriage, or where you and/or your spouse resided
      when you filed your claim (or a later date when you became eligible for
      benefits) (38 U.S.C. § 103(c)).
    </p>
    <p>
      <a
        href="http://www.va.gov/opa/marriage/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Additional guidance on when VA recognizes marriages (opens in new tab)
      </a>
    </p>
  </va-alert>
);

export default {
  uiSchema: {
    hideFormTitle: true,
    'ui:description': MarriageRecognitionInfo,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
