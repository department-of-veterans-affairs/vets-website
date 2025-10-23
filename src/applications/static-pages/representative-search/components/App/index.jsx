import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

const renderNewLandingContent = () => {
  return (
    <>
      <p>
        Use our online tool to search for an accredited attorney, claims agent,
        or VSO.
      </p>
      <a
        className="vads-c-action-link--green"
        href="/get-help-from-accredited-representative/find-rep"
      >
        Find an accredited representative
      </a>
    </>
  );
};

const renderOldLandingContent = () => {
  return (
    <>
      <p>
        You can find an accredited attorney, claims agent, or VSO in 1 of these
        2 ways:
      </p>
      <ul>
        <li>
          Go to eBenefits to find an accredited representative by name, state,
          territory, or zip code. <br />
          <va-link
            href="https://www.ebenefits.va.gov/ebenefits/vso-search"
            text="Go to eBenefits"
          />
        </li>
        <li>
          Search the VA Office of the General Counsel’s list to find an
          accredited representative by name, city, state, or zip code. <br />
          <va-link
            href="https://www.va.gov/ogc/apps/accreditation/index.asp"
            text="Search the VA Office of the General Counsel’s list"
          />
        </li>
      </ul>
    </>
  );
};

export const App = ({ show }) => {
  const {
    // useToggleValue,
    useToggleLoadingValue,
    // TOGGLE_NAMES,
  } = useFeatureToggle();

  // const appEnabled = useToggleValue(TOGGLE_NAMES.findARepresentative);

  const togglesLoading = useToggleLoadingValue();

  if (togglesLoading) {
    return null;
  }

  return (
    <>
      {show && renderNewLandingContent()}
      {!show && renderOldLandingContent()}
    </>
  );
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.findARepresentativeEnableFrontend,
});

export default connect(
  mapStateToProps,
  null,
)(App);
