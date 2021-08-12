import React from 'react';
import { connect } from 'react-redux';
import { locationSelector } from '../../../shared/utils/selectors';

import { selectCurrentLocation } from '../../../shared/redux-selectors';

const BreadCrumbs = props => {
  const { location } = props;
  const appointmentTypeText = locationSelector.getType(location)?.toLowerCase();

  return (
    <nav
      aria-label="Breadcrumb"
      aria-live="polite"
      className="va-nav-breadcrumbs  "
      id="va-breadcrumbs"
    >
      <ul
        className="row va-nav-breadcrumbs-list columns"
        id="va-breadcrumbs-list"
      >
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/health-care/">Health care</a>
        </li>
        <li>
          <a href="/health-care/health-questionnaires/questionnaires/">
            Your health questionnaires
          </a>
        </li>
        <li>
          <a
            aria-current="page"
            href="/health-care/health-questionnaires/questionnaires"
            data-testid="current-location-text"
          >
            Answer {appointmentTypeText || 'health'} questionnaire
          </a>
        </li>
      </ul>
    </nav>
  );
};

const mapStateToProps = state => ({
  location: selectCurrentLocation(state),
});

export default connect(
  mapStateToProps,
  null,
)(BreadCrumbs);
