import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { claimantSearch, extractClaimantData } from '../utilities/mviLookup';

/**
 * VeteranLookupButton - Component to perform MVI lookup after veteran info is entered
 *
 * This component is displayed after the veteran identification fields and allows
 * the representative to verify the veteran's identity through MVI lookup.
 *
 * On successful lookup, stores:
 * - claimantId: UUID used to identify the veteran in subsequent API calls
 *   (the backend resolves this to the actual ICN when submitting to EVSS/Lighthouse)
 * - claimantData: Additional verified information about the veteran
 */
const VeteranLookupButton = ({ formData, setFormData }) => {
  const [lookupState, setLookupState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const { fullName, ssn, dateOfBirth } = formData || {};

  const canLookup =
    fullName?.first &&
    fullName?.last &&
    ssn &&
    dateOfBirth &&
    !lookupState.loading;

  const handleLookup = async () => {
    setLookupState({ loading: true, error: null, success: false });

    try {
      const response = await claimantSearch({ fullName, ssn, dateOfBirth });
      const claimantData = extractClaimantData(response);

      if (claimantData) {
        setFormData({
          ...formData,
          // Store the claimant UUID - backend will resolve to ICN when needed
          claimantId: claimantData.claimantId,
          // Store verified claimant data for display/confirmation
          'view:claimantData': claimantData,
          'view:mviLookupComplete': true,
        });
        setLookupState({ loading: false, error: null, success: true });
      } else {
        setLookupState({
          loading: false,
          error:
            'Veteran not found in VA records. Please verify the information.',
          success: false,
        });
      }
    } catch (error) {
      setLookupState({
        loading: false,
        error: error.message || 'An error occurred during veteran lookup.',
        success: false,
      });
    }
  };

  return (
    <div className="vads-u-margin-top--3">
      {lookupState.error && (
        <va-alert status="error" slim uswds>
          <p className="vads-u-margin-y--0">{lookupState.error}</p>
        </va-alert>
      )}

      {lookupState.success && (
        <va-alert status="success" slim uswds>
          <p className="vads-u-margin-y--0">
            Veteran identity verified successfully.
          </p>
        </va-alert>
      )}

      {!lookupState.success && (
        <va-button
          text={
            lookupState.loading ? 'Verifying...' : 'Verify veteran identity'
          }
          onClick={handleLookup}
          disabled={!canLookup || lookupState.loading}
        />
      )}

      {!canLookup &&
        !lookupState.loading && (
          <p className="vads-u-margin-top--1 vads-u-color--gray-medium">
            Please complete all required fields above to verify the veteran's
            identity.
          </p>
        )}
    </div>
  );
};

VeteranLookupButton.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
    ssn: PropTypes.string,
    dateOfBirth: PropTypes.string,
    claimantId: PropTypes.string,
  }),
  setFormData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export { VeteranLookupButton };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranLookupButton);
