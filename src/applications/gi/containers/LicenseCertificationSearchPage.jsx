import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaLoadingIndicator,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import LicenseCertificationSearchForm from '../components/LicenseCertificationSearchForm';
import { handleLcResultsSearch, updateQueryParam } from '../utils/helpers';
import { fetchLicenseCertificationResults } from '../actions';

function LicenseCertificationSearchPage({
  dispatchFetchLicenseCertificationResults,
  lcResults,
  fetchingLc,
  hasFetchedOnce,
}) {
  const history = useHistory();
  const location = useLocation();
  const [modal, setModal] = useState({
    visible: false,
    changedfield: '',
    message: '',
  });

  const handleUpdateQueryParam = () => updateQueryParam(history, location);

  const handleReset = callback => {
    history.replace('/lc-search');
    callback?.();
  };

  useEffect(
    () => {
      if (!hasFetchedOnce) {
        dispatchFetchLicenseCertificationResults();
      }
    },
    [hasFetchedOnce, dispatchFetchLicenseCertificationResults],
  );

  const handleShowModal = (changedField, message, callback) => {
    return setModal({
      visible: true,
      changedField,
      message,
      callback,
    });
  };

  const toggleModal = () => {
    setModal(current => {
      return { ...current, visible: false };
    });
  };

  const handleSearch = (category, name, state) => {
    handleUpdateQueryParam()([
      ['state', state],
      ['category', category],
      ['name', name],
    ]);
    handleLcResultsSearch(history, category, name, state);
  };

  return (
    <div>
      {fetchingLc && (
        <VaLoadingIndicator
          // data-testid="loading-indicator"
          message="Loading..."
        />
      )}
      {!fetchingLc &&
        hasFetchedOnce &&
        lcResults.length !== 0 && (
          <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
            <div className="row">
              <h1 className=" mobile-lg:vads-u-text-align--left">
                Licenses, Certifications, and Prep courses
              </h1>
              <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
                Use the search tool to find out which tests or related prep
                courses are reimbursable. If you don’t see a test or prep course
                listed, it may be a valid test that’s not yet approved. We
                encourage you to submit an application for reimbursement. We’ll
                prorate the entitlement charges based on the actual amount of
                the fee charged for the test.
                <br />
                <br /> Tests to obtain licenses tend to be state-specific, while
                certifications are valid nationally. Be aware of the
                requirements for the specific license or certification test
                you’re trying to obtain and whether or not it is state-specific.
              </p>
            </div>
            <div className="form-wrapper row">
              <LicenseCertificationSearchForm
                suggestions={lcResults}
                handleSearch={handleSearch}
                handleUpdateQueryParam={handleUpdateQueryParam}
                handleShowModal={handleShowModal}
                location={location}
                handleReset={handleReset}
              />
            </div>
            <VaModal
              forcedModal={false}
              clickToClose
              disableAnalytics
              large
              modalTitle={`Are you sure you want to change the ${
                modal.changedField
              } field?`}
              // initialFocusSelector={initialFocusSelector}
              onCloseEvent={toggleModal}
              onPrimaryButtonClick={() => {
                modal.callback();
                toggleModal();
              }}
              primaryButtonText="Continue to change"
              onSecondaryButtonClick={toggleModal}
              secondaryButtonText="Go Back"
              // status={status}
              visible={modal.visible}
            >
              <p>{modal.message}</p>
            </VaModal>
          </section>
        )}
    </div>
  );
}

LicenseCertificationSearchPage.propTypes = {
  dispatchFetchLicenseCertificationResults: PropTypes.func.isRequired,
  fetchingLc: PropTypes.bool.isRequired,
  hasFetchedOnce: PropTypes.bool.isRequired,
  lcResults: PropTypes.array,
  // error: Proptypes // verify error Proptypes
};

const mapStateToProps = state => ({
  lcResults: state.licenseCertificationSearch.lcResults,
  fetchingLc: state.licenseCertificationSearch.fetchingLc,
  hasFetchedOnce: state.licenseCertificationSearch.hasFetchedOnce,
  // error: // create error state in redux store
});

const mapDispatchToProps = {
  dispatchFetchLicenseCertificationResults: fetchLicenseCertificationResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseCertificationSearchPage);
