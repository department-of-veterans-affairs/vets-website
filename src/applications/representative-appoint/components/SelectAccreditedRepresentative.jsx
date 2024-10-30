import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { fetchRepresentatives } from '../api/fetchRepresentatives';
import { fetchRepStatus } from '../api/fetchRepStatus';
import SearchResult from './SearchResult';
import SearchInput from './SearchInput';
import { useReviewPage } from '../hooks/useReviewPage';

const SelectAccreditedRepresentative = props => {
  const { setFormData, formData, goBack, goForward, goToPath } = props;
  const [loadingReps, setLoadingReps] = useState(false);
  const [loadingPOA, setLoadingPOA] = useState(false);
  const [error, setError] = useState(null);
  const representativeResults =
    formData?.['view:representativeSearchResults'] || null;

  const currentSelectedRep = useRef(
    formData?.['view:representativeSearchResults'],
  );

  const isReviewPage = useReviewPage();

  const getRepStatus = async () => {
    setLoadingPOA(true);
    try {
      const res = await fetchRepStatus();
      setLoadingPOA(false);
      return res.data;
    } catch {
      setLoadingPOA(false);
      return null;
    }
  };

  const handleGoBack = () => {
    if (isReviewPage) {
      goToPath('/review-and-submit');
    } else {
      goBack(formData);
    }
  };

  const handleGoForward = () => {
    if (!formData['view:selectedRepresentative']) {
      // set unselected rep error
    }
    if (isReviewPage) {
      if (formData['view:selectedRepresentative'] === currentSelectedRep) {
        goToPath('/review-and-submit');
      } else {
        goToPath('/representative-contact?review=true');
      }
    } else {
      goForward(formData);
    }
  };

  const handleSearch = async () => {
    const query = formData['view:representativeQuery'];

    if (!query.trim()) {
      setError(
        'Enter the name of the accredited representative or VSO you’d like to appoint',
      );
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
    if (selectedRepResult === currentSelectedRep) {
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

      handleGoForward();
    }
  };

  // const continueError = () => {
  //   return (
  //     <span
  //       className="usa-input-error-message vads-u-margin-bottom--0p5"
  //       role="alert"
  //     >
  //       <span className="sr-only">Error</span>
  //       {}
  //     </span>
  //   );
  // };

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
        text="Find an accredited representative or VSO"
      />
      <FormNavButtons goBack={handleGoBack} goForward={handleGoForward} />
    </div>
  );
};

SelectAccreditedRepresentative.propTypes = {
  fetchRepresentatives: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SelectAccreditedRepresentative),
);
