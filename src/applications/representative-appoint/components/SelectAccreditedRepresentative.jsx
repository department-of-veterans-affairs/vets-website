import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchRepresentatives } from '../api/fetchRepresentatives';
import SearchResult from './SearchResult';

const SelectAccreditedRepresentative = props => {
  const { setFormData, formData, router, routes, location, goToPath } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const representativeResults =
    formData?.['view:representativeSearchResults'] || null;

  const onInputChange = e => {
    setError(null);
    setFormData({
      ...formData,
      'view:representativeQuery': e.target.value,
    });
  };

  const onSubmit = async () => {
    const query = formData['view:representativeQuery'];
    if (!query.trim()) {
      setError(
        'Enter the name of the accredited representative or VSO you’d like to appoint',
      );
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  const searchResults = () => {
    if (loading) {
      return <va-loading-indicator message="Loading..." set-focus />;
    }
    if (representativeResults?.length) {
      return (
        <>
          {representativeResults.map((rep, index) => {
            const representative = rep.data;
            return (
              <div key={index} className="vads-u-margin-y--4">
                <SearchResult
                  representativeName={
                    representative.attributes.fullName ||
                    representative.attributes.name
                  }
                  type={representative.type}
                  addressLine1={representative.attributes.addressLine1}
                  addressLine2={representative.attributes.addressLine2}
                  addressLine3={representative.attributes.addressLine3}
                  city={representative.attributes.city}
                  stateCode={representative.attributes.stateCode}
                  zipCode={representative.attributes.zipCode}
                  phone={representative.attributes.phone}
                  email={representative.attributes.email}
                  representative={representative}
                  accreditedOrganizations={
                    representative.attributes?.accreditedOrganizations?.data
                  }
                  representativeId={representative.id}
                  formData={formData}
                  setFormData={setFormData}
                  router={router}
                  routes={routes}
                  location={location}
                  goToPath={goToPath}
                />
              </div>
            );
          })}
        </>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="vads-u-margin-y--5 ">
        Select the accredited representative or VSO you’d like to appoint
      </h3>
      <p className="vads-u-margin-bottom--0">
        Enter the name of the accredited representative or Veterans Service
        Organization (VSO) you’d like to appoint
      </p>
      <div className="vads-u-display--flex vads-u-margin-bottom--3">
        <div className="vads-u-margin-right--2 vads-u-flex--1">
          <va-text-input
            id="representative_search"
            name="representative_search"
            error={error}
            value={formData['view:representativeQuery']}
            onInput={onInputChange}
            required
            onKeyPress={e => {
              if (e.key === 'Enter') onSubmit();
            }}
          />
        </div>
        <div
          className={`vads-u-margin-top--${
            error ? '8' : '1'
          } vads-u-margin-bottom--1`}
        >
          <VaButton
            data-testid="representative-search-btn"
            text="Search"
            onClick={onSubmit}
          />
        </div>
      </div>
      {searchResults()}
    </div>
  );
};

export const AdditionalNote = () => {
  return (
    <>
      <p className="vads-u-margin-y--4">
        <strong>Note:</strong> If you don’t know who you’d like to appoint, you
        can use our online tool to search for an accredited attorney, claims
        agent, or VSO representative.
      </p>
      <va-link
        href="/get-help-from-accredited-representative/find-rep"
        text="Find an accredited representative or VSO"
      />
    </>
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
