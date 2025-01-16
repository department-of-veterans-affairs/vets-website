import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaAccordion,
  VaAccordionItem,
  VaLink,
  VaLoadingIndicator,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import LicenseCertificationSearchForm from '../components/LicenseCertificationSearchForm';
import { handleLcResultsSearch, updateQueryParam } from '../utils/helpers';
import { fetchLicenseCertificationResults } from '../actions';

const faqs = [
  {
    question: 'What is the difference between a license and certification?',
    answer: (
      <p className="faq-answer">
        A license is granted by the state or a governing authority; whereas, a
        certification is granted by professional organizations or associations.
      </p>
    ),
  },
  {
    question: 'What will my benefits cover?',
    answer: (
      <p className="faq-answer">
        Part of your entitlement can be used to cover the costs of tests, up to
        \$2000, for a job that requires a license or certification—even if
        you’re already receiving other education benefits. Your benefits will
        only cover tests approved for the GI Bill.
      </p>
    ),
  },
  {
    question:
      'How do I get reimbursed for the licenses, certifications, and prep courses?',
    answer: (
      <>
        <VaLink
          text="Find out how to get reimbursed for licenses, certifications and prep courses"
          href="../about-gi-bill-benefits/how-to-use-benefits/licensing-and-certification-tests/"
        />
        <br />
        <br />
        <p className="faq-answer">
          Print and fill out form Request for Reimbursement of Licensing or
          Certification Test Fees. Send the completed application to the
          Regional Processing Office for your region listed in the form.
        </p>
        <br />
        <br />
        <VaLink
          text="Get VA Form22-0803 to download"
          href="../find-forms/about-form-22-0803/"
        />
      </>
    ),
  },
  {
    question: 'What is a prep course?',
    answer: (
      <p className="faq-answer">
        A preparatory course (prep course) is a course that prepares students
        for success tied to a specific license or certification.
      </p>
    ),
  },
  {
    question: 'Can I get paid to take a test more than once?',
    answer: (
      <p className="faq-answer">
        If you fail a license or certification test, we will pay again. If the
        license or certification expires, you can take it again and we’ll pay
        for the renewal.
      </p>
    ),
  },
];

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
    <div className="lc-page-wrapper">
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
              <h1 className="mobile-lg:vads-u-text-align--left">
                Licenses, certifications, and prep courses
              </h1>
              <p className="vads-u-color--gray-dark">
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
            <div className="lc-form-wrapper row">
              <LicenseCertificationSearchForm
                suggestions={lcResults}
                handleSearch={handleSearch}
                handleUpdateQueryParam={handleUpdateQueryParam}
                handleShowModal={handleShowModal}
                location={location}
                handleReset={handleReset}
              />
            </div>
            <div className="row">
              <h2 className="vads-u-margin-y--0">FAQs</h2>
              <VaAccordion>
                {faqs.map((faq, index) => {
                  return (
                    <VaAccordionItem header={faq.question} key={index}>
                      {faq.answer}
                    </VaAccordionItem>
                  );
                })}
              </VaAccordion>
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
