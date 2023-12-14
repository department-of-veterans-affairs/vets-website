import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { checkForDiscrepancies } from '../actions';
import TotalRatedDisabilities from './TotalRatedDisabilities';
import OnThisPage from './OnThisPage';
import RatedDisabilityList from './RatedDisabilityList';

const RatedDisabilityView = ({
  detectDiscrepancies,
  error,
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
  loading,
  ratedDisabilities,
  sortToggle,
  totalDisabilityRating,
}) => {
  useEffect(() => {
    fetchTotalDisabilityRating();

    if (detectDiscrepancies) {
      checkForDiscrepancies();
    }
  }, []);

  const hasRatedDisabilities = ratedDisabilities?.ratedDisabilities?.length > 0;

  // Total Disability Calculation and Pending Disabilities should go here.
  return (
    <div className="vads-l-grid-container">
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--12">
          <div className="vads-l-row">
            <div className="vads-l-col--12">
              <h1>View your VA disability ratings</h1>
            </div>
            {hasRatedDisabilities && <OnThisPage />}
          </div>
          <h2 id="combined-rating" className="vads-u-margin-y--1p5">
            Your combined disability rating
          </h2>
          <TotalRatedDisabilities
            totalDisabilityRating={totalDisabilityRating}
            loading={loading}
            error={error}
          />
          <h2 id="individual-ratings" className="vads-u-margin-y--2">
            Your individual ratings
          </h2>
          <RatedDisabilityList
            fetchRatedDisabilities={fetchRatedDisabilities}
            ratedDisabilities={ratedDisabilities}
            sortToggle={sortToggle}
          />
          <h2
            id="learn"
            className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary vads-u-font-size--h3 vads-u-margin-top--2"
          >
            Learn about VA disability ratings
          </h2>
          <p>
            To learn how we determined your VA combined disability rating, use
            our disability rating calculator and ratings table.
          </p>
          <a href="/disability/about-disability-ratings/">
            About VA disability ratings
          </a>
          <h3 className="vads-u-margin-top--3 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
            Need help?
          </h3>
          <p className="vads-u-padding-bottom--3">
            You can call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />.
            We’re here Monday through Friday, 8:00 a.m to 9:00 p.m. ET.
          </p>
        </div>
      </div>
    </div>
  );
};

RatedDisabilityView.propTypes = {
  fetchRatedDisabilities: PropTypes.func.isRequired,
  detectDiscrepancies: PropTypes.bool,
  error: PropTypes.object,
  fetchTotalDisabilityRating: PropTypes.func,
  loading: PropTypes.bool,
  ratedDisabilities: PropTypes.shape({
    ratedDisabilities: PropTypes.array,
  }),
  sortToggle: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
};

export default RatedDisabilityView;
