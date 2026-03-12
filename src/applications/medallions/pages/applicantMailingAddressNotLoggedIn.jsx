import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';

const ApplicantMailingAddressNotLoggedIn = ({
  data,
  editPage,
  onReviewPage,
  title,
  goToPath,
  setEditState,
}) => {
  const dispatch = useDispatch();

  // Clear the edit flag when returning to this page
  useEffect(
    () => {
      if (data?.['view:notLoggedInEditAddress'] === true) {
        const updatedFormData = {
          ...data,
          'view:notLoggedInEditAddress': false,
        };
        dispatch(setData(updatedFormData));
      }
    },
    [data, dispatch],
  );

  const handleEdit = () => {
    // Set the custom field to trigger the edit flow
    const updatedFormData = {
      ...data,
      'view:notLoggedInEditAddress': true,
    };
    dispatch(setData(updatedFormData));

    // Store edit state if setEditState is available (for review page)
    if (setEditState) {
      setEditState({
        editing: true,
        returnUrl: '/review-and-submit',
      });
    }

    // If on review page, store the return path
    if (onReviewPage) {
      sessionStorage.setItem('addressEditReturnPath', '/review-and-submit');
    }

    // Navigate to edit page
    if (goToPath) {
      goToPath('/applicant-mailing-address/edit', {
        force: true,
      });
    }
  };

  // Only render on review page
  if (!(onReviewPage || editPage)) {
    return null;
  }

  if (onReviewPage || editPage) {
    const { applicantMailingAddress } = data || {};
    const addr = applicantMailingAddress || {};

    return (
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title || 'Mailing address'}
          </h4>
          <va-button
            secondary
            text="Edit"
            onClick={handleEdit}
            label="Edit mailing address"
          />
        </div>
        <dl className="review">
          {addr.country && (
            <div className="review-row">
              <dt>Country</dt>
              <dd>{addr.country}</dd>
            </div>
          )}
          {addr.street && (
            <div className="review-row">
              <dt>Street address</dt>
              <dd>{addr.street}</dd>
            </div>
          )}
          {addr.street2 && (
            <div className="review-row">
              <dt>Street address line 2</dt>
              <dd>{addr.street2}</dd>
            </div>
          )}
          {addr.city && (
            <div className="review-row">
              <dt>City</dt>
              <dd>{addr.city}</dd>
            </div>
          )}
          {addr.state && (
            <div className="review-row">
              <dt>State</dt>
              <dd>{addr.state}</dd>
            </div>
          )}
          {addr.postalCode && (
            <div className="review-row">
              <dt>Postal code</dt>
              <dd>{addr.postalCode}</dd>
            </div>
          )}
        </dl>
      </div>
    );
  }

  return null;
};

ApplicantMailingAddressNotLoggedIn.propTypes = {
  data: PropTypes.shape({
    applicantMailingAddress: PropTypes.object,
    'view:notLoggedInEditAddress': PropTypes.bool,
  }),
  editPage: PropTypes.bool,
  goToPath: PropTypes.func,
  onReviewPage: PropTypes.bool,
  setEditState: PropTypes.func,
  title: PropTypes.string,
};

export default ApplicantMailingAddressNotLoggedIn;
