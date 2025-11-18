import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import SinglePageForm526EZ from '../components/Forms/SinglePageForm526EZ';
import { buildRepresentativeForm526 } from 'platform/forms/disability-benefits/526ez/transformer';
import api from '../utilities/api';

/*
 * Container responsible for:
 *  - Simple authenticated context (user info pulled from redux state)
 *  - Submitting transformed payload to the existing 526EZ submit endpoint
 *  - Leveraging platform save-in-progress (no custom draft endpoint needed)
 *  - Minimal optimistic UX + navigation to a placeholder confirmation route
 *
 */

const SinglePageForm526EZContainer = ({ user }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');

  const handleSubmit = useCallback(
    async formData => {
      setStatus('submitting');
      try {
        const payloadObject = buildRepresentativeForm526(formData);
        const payload = JSON.stringify(payloadObject);
        const response = await api.submitDisabilityCompensationClaim(payload);

        if (!response) {
          setStatus('idle');
          return null;
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Submit failed (${response.status}): ${text}`);
        }
        const json = await response.json().catch(() => ({}));
        // Navigate to confirmation page with submission context
        navigate('confirmation', {
          replace: true,
          state: {
            submission: json,
            payload: payloadObject,
          },
        });
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
