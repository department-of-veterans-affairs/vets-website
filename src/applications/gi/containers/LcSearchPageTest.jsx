// LicenseCertificationSearchPage.js
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  VaLoadingIndicator,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { fetchLicenseCertificationResults } from '../actions';
import LcFormTest from '../components/LcFormTest';
import { useSearchState } from '../utils/helpers';

function LcSearchPageTest({
  dispatchFetchLicenseCertificationResults,
  lcResults,
  fetchingLc,
  hasFetchedOnce,
}) {
  const { resetSearch } = useSearchState();
  const [modal, setModal] = useState({
    visible: false,
    changedField: '',
    message: '',
  });

  useEffect(
    () => {
      if (!hasFetchedOnce) {
        dispatchFetchLicenseCertificationResults();
      }
    },
    [hasFetchedOnce, dispatchFetchLicenseCertificationResults],
  );

  // Why this no work?
  useEffect(() => {
    window.addEventListener('beforeunload', resetSearch);

    return () => window.removeEventListener('beforeunload', resetSearch);
  }, []);

  const handleShowModal = (changedField, message) => {
    setModal({
      visible: true,
      changedField,
      message,
    });
  };

  const handleReset = callback => {
    resetSearch();
    callback?.();
  };

  const toggleModal = () => {
    setModal(current => ({ ...current, visible: false }));
  };

  return (
    <div>
      {fetchingLc && <VaLoadingIndicator message="Loading..." />}
      {!fetchingLc &&
        hasFetchedOnce &&
        lcResults.length !== 0 && (
          <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
            <div className="row">
              <h1 className="mobile-lg:vads-u-text-align--left">
                Licenses and Certifications
              </h1>
              <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
                Licenses and certifications search page
              </p>
            </div>

            <div className="form-wrapper row">
              <LcFormTest
                suggestions={lcResults}
                handleShowModal={handleShowModal}
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
              onCloseEvent={toggleModal}
              onPrimaryButtonClick={() => handleReset(toggleModal)}
              primaryButtonText="Continue to change"
              onSecondaryButtonClick={toggleModal}
              secondaryButtonText="Go Back"
              visible={modal.visible}
            >
              <p>{modal.message}</p>
            </VaModal>
          </section>
        )}
    </div>
  );
}

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
)(LcSearchPageTest);
