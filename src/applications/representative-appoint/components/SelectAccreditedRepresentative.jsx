import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError, focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { fetchRepresentatives } from '../api/fetchRepresentatives';
import { fetchRepStatus } from '../api/fetchRepStatus';
import SearchResult from './SearchResult';
import SearchInput from './SearchInput';
import { useReviewPage } from '../hooks/useReviewPage';
import { SearchResultsHeader } from './SearchResultsHeader';
import { formIs2122 } from '../utilities/helpers';

const SelectAccreditedRepresentative = props => {
  const {
    loggedIn,
    setFormData,
    formData,
    goBack,
    goForward,
    goToPath,
  } = props;

  const representativeResults =
    formData?.['view:representativeSearchResults'] || null;

  const queryInput = formData['view:representativeQueryInput'];
  const querySubmission = formData['view:representativeQuerySubmission'];
  const invalidQuery = queryInput === undefined || !queryInput.trim();

  const noSearchError =
    'Enter the name of the accredited representative or VSO you’d like to appoint';

  const noSelectionError =
    'Select the accredited representative or VSO you’d like to appoint below.';

  const [loadingReps, setLoadingReps] = useState(false);
  const [loadingPOA, setLoadingPOA] = useState(false);
  const [error, setError] = useState(null);

  const currentSelectedRep = useRef(formData?.['view:selectedRepresentative']);

  const isReviewPage = useReviewPage();

  const getRepStatus = async () => {
    if (loggedIn) {
      setLoadingPOA(true);

      try {
        const res = await fetchRepStatus();
        setLoadingPOA(false);
        return res.data;
      } catch {
        setLoadingPOA(false);
      }
    }

    return null;
  };

  const handleGoBack = () => {
    if (isReviewPage) {
      goToPath('/claimant-type');
    } else {
      goBack(formData);
    }
  };

  const handleGoForward = ({ selectionMade = false, newSelection = null }) => {
    const selection = formData['view:selectedRepresentative'];

    const repTypeChanged =
      formIs2122(currentSelectedRep.current) !== formIs2122(newSelection);

    const noSelectionExists = !selection && !selectionMade;
    const noNewSelection =
      !newSelection || newSelection === currentSelectedRep.current;

    if (noSelectionExists && !invalidQuery) {
      setError(noSelectionError);
      scrollToFirstError({ focusOnAlertRole: true });
    } else if (noSelectionExists && invalidQuery) {
      setError(noSearchError);
      scrollToFirstError({ focusOnAlertRole: true });
    } else if (isReviewPage) {
      if (noNewSelection) {
        goToPath('/review-and-submit');
      } else if (repTypeChanged) {
        goToPath('/representative-contact');
      } else {
        goToPath('/representative-contact?review=true');
      }
    } else {
      goForward(formData);
    }
  };

  const handleSearch = async () => {
    if (invalidQuery) {
      setError(noSearchError);
      scrollToFirstError({ focusOnAlertRole: true });
      return;
    }

    setLoadingReps(true);
    setError(null);

    try {
      const res = await fetchRepresentatives({ query: queryInput });
      setFormData({
        ...formData,
        'view:representativeQuerySubmission': queryInput,
        'view:representativeSearchResults': res,
      });
    } catch (err) {
      setError(err.errorMessage);
    } finally {
      setLoadingReps(false);
    }
  };

  const handleSelectRepresentative = async selectedRepResult => {
    if (selectedRepResult === currentSelectedRep.current && isReviewPage) {
      goToPath('/review-and-submit');
    } else {
      const repStatus = await getRepStatus();

      const tempData = {
        ...formData,
        'view:selectedRepresentative': selectedRepResult,
        'view:representativeStatus': repStatus,
        // when a new representative is selected, we want to nil out the
        //   selected organization to prevent weird states. For example,
        //   we wouldn't want a user to select a representative, an organization,
        //   go backwards to select an attorney, and then our state variables
        //   say an attorney was selected with a non-null organization id
        selectedAccreditedOrganizationId: null,
        representativeSubmissionMethod: null,
      };

      setFormData({
        ...tempData,
      });

      // similar to the tempData trick above with async state variables,
      //  we need to trick our routing logic to know that a selection has
      //  been made before that selection is reflected in formData.
      //
      // selectionMade: prevents users from needing to double click the select
      //  representative button to register that a selection was made.
      //
      // newSelection: prevents issue with routing from the review page
      //   where selecting a new representative is treated as the original
      //   representative due to formData not updating synchronously.
      handleGoForward({ selectionMade: true, newSelection: selectedRepResult });
    }
  };

  useEffect(() => {
    const searchHeader = document.querySelector('.search-header');

    if (searchHeader) {
      focusElement('.search-header');
    }
  }, [loadingReps, representativeResults?.length]);

  if (loadingPOA) {
    return <va-loading-indicator set-focus />;
  }

  return (
    <div>
      <h3>Select the accredited representative or VSO you’d like to appoint</h3>

      <SearchInput
        error={error}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSearch}
      />
      {loadingReps ? (
        <va-loading-indicator
          message="Finding accredited representatives..."
          set-focus
        />
      ) : null}
      <SearchResultsHeader
        inProgress={loadingReps}
        query={querySubmission}
        resultCount={representativeResults?.length}
      />
      {representativeResults &&
        representativeResults.map((rep, index) => (
          <SearchResult
            key={index}
            representative={rep}
            formData={formData}
            setFormData={setFormData}
            currentSelectedRep={currentSelectedRep.current}
            goToPath={goToPath}
            handleSelectRepresentative={handleSelectRepresentative}
            userIsDigitalSubmitEligible={
              formData?.userIsDigitalSubmitEligible &&
              formData?.['view:v2IsEnabled']
            }
          />
        ))}
      <p className="vads-u-margin-y--4">
        <strong>Note:</strong> If you don’t know who you’d like to appoint, you
        can use our online tool to search for an accredited attorney, claims
        agent, or VSO representative.
      </p>
      <va-link
        href="/get-help-from-accredited-representative/find-rep"
        text="Find a VA accredited representative or VSO"
        external
      />
      <FormNavButtons goBack={handleGoBack} goForward={handleGoForward} />
    </div>
  );
};

SelectAccreditedRepresentative.propTypes = {
  fetchRepresentatives: PropTypes.func,
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  loggedIn: PropTypes.bool,
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export { SelectAccreditedRepresentative }; // Named export for testing

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SelectAccreditedRepresentative),
);
