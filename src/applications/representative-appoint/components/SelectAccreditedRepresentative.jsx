import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { fetchRepresentatives } from '../api/fetchRepresentatives';
import { fetchRepStatus } from '../api/fetchRepStatus';
import SearchResult from './SearchResult';
import SearchInput from './SearchInput';
import { useReviewPage } from '../hooks/useReviewPage';

const SelectAccreditedRepresentative = props => {
  const {
    loggedIn,
    setFormData,
    formData,
    goBack,
    goForward,
    goToPath,
  } = props;
  const [loadingReps, setLoadingReps] = useState(false);
  const [loadingPOA, setLoadingPOA] = useState(false);
  const [error, setError] = useState(null);
  const representativeResults =
    formData?.['view:representativeSearchResults'] || null;

  const currentSelectedRep = useRef(formData?.['view:selectedRepresentative']);

  const query = formData['view:representativeQuery'];
  const invalidQuery = query === undefined || !query.trim();

  const noSearchError =
    'Enter the name of the accredited representative or VSO you’d like to appoint';

  const noSelectionError =
    'Select the accredited representative or VSO you’d like to appoint below.';

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

  const handleGoForward = ({ selectionMade = false }) => {
    const selection = formData['view:selectedRepresentative'];
    const noSelectionExists = !selection && !selectionMade;

    if (noSelectionExists && !invalidQuery) {
      setError(noSelectionError);
      scrollToFirstError({ focusOnAlertRole: true });
    } else if (noSelectionExists && invalidQuery) {
      setError(noSearchError);
      scrollToFirstError({ focusOnAlertRole: true });
    } else if (isReviewPage) {
      if (selection === currentSelectedRep) {
        goToPath('/review-and-submit');
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
      const res = await fetchRepresentatives({ query });
      setFormData({
        ...formData,
        'view:representativeSearchResults': res,
      });
    } catch (err) {
      setError(err.errorMessage);
    } finally {
      setLoadingReps(false);
    }
  };

  const handleSelectRepresentative = async selectedRepResult => {
    if (selectedRepResult === currentSelectedRep && isReviewPage) {
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
      };

      setFormData({
        ...tempData,
      });

      // similar to the tempData trick above with async state variables,
      //  we need to trick our routing logic to know that a selection has
      //  been made before that selection is reflected in formData.
      //  Otherwise, one would have to double click the select
      //  representative button to register that a selection was made.
      handleGoForward({ selectionMade: true });
    }
  };

  if (loadingPOA) {
    return <va-loading-indicator set-focus />;
  }

  return (
    <div>
      <h3 className="vads-u-margin-y--5 ">
        Select the accredited representative or VSO you’d like to appoint
      </h3>
      <p className="vads-u-margin-bottom--0">
        Enter the name of the accredited representative or Veterans Service
        Organization (VSO) you’d like to appoint
      </p>
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
  formData: state.form?.data || {},
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export { SelectAccreditedRepresentative }; // Named export for testing

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SelectAccreditedRepresentative),
);
