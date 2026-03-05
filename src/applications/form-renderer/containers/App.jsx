import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import FormRenderer from 'platform/form-renderer/FormRenderer';
import { apiRequest } from '~/platform/utilities/api';

export default function App({ params }) {
  const { id } = params;
  const [response, setResponse] = useState(null);
  const [isError, setIsError] = useState(false);

  const {
    TOGGLE_NAMES: { dependentsEnableFormViewerMFE: appToggleKey },
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isAppToggleLoading = useToggleLoadingValue(appToggleKey);

  function getSubmission(submissionId) {
    return apiRequest(`/submissions/${submissionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(submission => setResponse(submission))
      .catch(() => setIsError(true));
  }

  useEffect(
    () => {
      getSubmission(id);
    },
    [id],
  );

  return (
    <div>
      {response &&
        !isAppToggleLoading && (
          <Toggler
            toggleName={Toggler.TOGGLE_NAMES.dependentsEnableFormViewerMFE}
          >
            <Toggler.Enabled>
              {!isError ? (
                <FormRenderer
                  config={response.template}
                  data={response.submission}
                />
              ) : (
                <div>Could not load submission.</div>
              )}
            </Toggler.Enabled>
            <Toggler.Disabled>
              {/* If the feature flag is off, redirect user to /my-va */}
              <RedirectHandler />
            </Toggler.Disabled>
          </Toggler>
        )}
    </div>
  );
}

const RedirectHandler = () => {
  window.location.href = '/my-va';

  return (
    <div>
      <va-loading-indicator label="Loading" message="Redirecting..." />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
