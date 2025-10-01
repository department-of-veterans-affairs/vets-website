import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import SinglePageForm526EZ from '../components/Forms/SinglePageForm526EZ';

/*
 * Container responsible for:
 *  - Simple authenticated context (user info pulled from redux state)
 *  - Submitting transformed payload to the existing 526EZ submit endpoint
 *  - Leveraging platform save-in-progress (no custom draft endpoint needed)
 *  - Minimal optimistic UX + navigation to a placeholder confirmation route
 *
 * NOTE: This prototype does NOT yet integrate the full transformation logic
 * from the all-claims app. For now we submit a simplified subset which will
 * be adapted to the 526 backend shape once mapping is defined for rep
 * submissions. The existing all-claims transformer returns
 * JSON.stringify({ form526: transformedData }). We mimic that envelope.
 */

const SUBMIT_URL = `${
  environment.API_URL
}/v0/disability_compensation_form/submit_all_claim`;

const SinglePageForm526EZContainer = ({ user }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');

  const handleSubmit = useCallback(
    async formData => {
      setStatus('submitting');
      try {
        // Basic mimic of submit-transformer envelope. In future import / adapt.
        const payload = JSON.stringify({ form526: formData });
        const response = await fetch(SUBMIT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Key-Inflection': 'camel',
          },
          body: payload,
          credentials: 'include',
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Submit failed (${response.status}): ${text}`);
        }
        const json = await response.json().catch(() => ({}));
        // Navigate to a placeholder confirmation; TODO create dedicated page
        navigate('/representative/submissions');
        setStatus('submitted');
        return json;
      } catch (e) {
        setStatus('error');
        throw e;
      }
    },
    [navigate],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-y--3">
      <SinglePageForm526EZ
        onSubmit={handleSubmit}
        veteranInfo={{ name: user?.preferredName || user?.name, id: user?.id }}
      />
      {status === 'submitted' && (
        <va-alert status="success" uswds visible>
          <h2 slot="headline" className="vads-u-font-size--h4 vads-u-margin--0">
            Form submitted
          </h2>
          <p className="vads-u-margin-y--0">
            We received the form. You can track the submission in the list
            below.
          </p>
        </va-alert>
      )}
      {status === 'error' && (
        <va-alert status="error" uswds visible>
          <h2 slot="headline" className="vads-u-font-size--h4 vads-u-margin--0">
            We couldn’t submit the form
          </h2>
          <p className="vads-u-margin-y--0">Please try again later.</p>
        </va-alert>
      )}
    </div>
  );
};

SinglePageForm526EZContainer.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user?.profile || {},
});

export default connect(mapStateToProps)(SinglePageForm526EZContainer);
