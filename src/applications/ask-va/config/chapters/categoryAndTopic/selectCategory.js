import React, { useState } from 'react';
import CategorySelect from '../../../components/FormFields/CategorySelect';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_1 } from '../../../constants';

const SignInMayBeRequired = form => {
  // TODO - fix alert dismiss state and show only when not authenticated
  const [visibleAlert, setVisibleAlert] = useState(true);

  return (
    <>
      {form && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="continue"
          visible={visibleAlert}
          uswds
          closeable
          onCloseEvent={() => setVisibleAlert(false)}
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            Sign in may be required
          </h2>
          <p className="vads-u-margin-y--0">
            If your question is about <b> Education benefits and work study </b>
            or <b>Debt for benefit overpayments and health care copay bill </b>
            you need to sign in.
          </p>
        </va-alert>
      )}
      <h3>{CHAPTER_1.PAGE_1.PAGE_DESCRIPTION}</h3>
    </>
  );
};

const selectCategoryPage = {
  uiSchema: {
    'ui:title': form => SignInMayBeRequired(form),
    'ui:objectViewField': PageFieldSummary,
    selectCategory: {
      'ui:title': CHAPTER_1.PAGE_1.QUESTION_1,
      'ui:widget': CategorySelect,
    },
  },
  schema: {
    type: 'object',
    required: ['selectCategory'],
    properties: {
      selectCategory: {
        type: 'string',
      },
    },
  },
};

export default selectCategoryPage;
