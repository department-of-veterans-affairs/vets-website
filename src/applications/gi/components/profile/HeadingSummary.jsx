import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import AdditionalResources from '../content/AdditionalResources';
import { formatNumber, locationInfo } from '../../utils/helpers';
import { ariaLabels } from '../../constants';
import CautionFlagHeading from './CautionFlagHeading';
import SchoolClosingHeading from './SchoolClosingHeading';

const IconWithInfo = ({ icon, children, present }) => {
  if (!present) return null;
  return (
    <p className="icon-with-info">
      <i className={`fa fa-${icon}`} />
      &nbsp;
      {children}
    </p>
  );
};

class HeadingSummary extends React.Component {
  render() {
    const it = this.props.institution;
    it.type = it.type && it.type.toLowerCase();
    const formattedAddress = locationInfo(it.city, it.state, it.country);
    const addressPresent = formattedAddress !== ''; // if locationInfo returns a blank string, icon should not show

    const schoolSize = enrollment => {
      if (!enrollment) return 'Unknown';
      if (enrollment <= 2000) {
        return 'Small';
      } else if (enrollment <= 15000) {
        return 'Medium';
      }
      return 'Large';
    };

    return (
      <div className="heading row">
        <div className="usa-width-two-thirds medium-8 small-12 column">
          <h1 tabIndex={-1}>{it.name}</h1>
          <SchoolClosingHeading
            schoolClosing={it.schoolClosing}
            schoolClosingOn={it.schoolClosingOn}
          />
          <div className="caution-flag">
            <CautionFlagHeading
              cautionFlags={it.cautionFlags}
              onViewWarnings={this.props.onViewWarnings}
            />
          </div>
          <div className="column">
            <p>
              <strong>{formatNumber(it.studentCount)}</strong> GI Bill students
              (
              <button
                type="button"
                className="va-button-link learn-more-button"
                onClick={this.props.onLearnMore}
                aria-label={ariaLabels.learnMore.numberOfStudents}
              >
                Learn more
              </button>
              )
            </p>
          </div>
          <div>
            <div className="usa-width-one-half medium-6 small-12 column">
              <IconWithInfo icon="map-marker" present={addressPresent}>
                {'  '}
                {formattedAddress}
              </IconWithInfo>
              <IconWithInfo icon="globe" present={it.website}>
                <a href={it.website} target="_blank" rel="noopener noreferrer">
                  {'  '}
                  {it.website}
                </a>
              </IconWithInfo>
              <IconWithInfo
                icon="calendar"
                present={it.type !== 'ojt' && it.highestDegree}
              >
                {'  '}
                {_.isFinite(it.highestDegree)
                  ? `${it.highestDegree} year`
                  : it.highestDegree}{' '}
                program
              </IconWithInfo>
            </div>

            <div className="usa-width-one-half medium-6 small-12 column">
              <IconWithInfo icon="briefcase" present={it.type === 'ojt'}>
                {'   '}
                On-the-job training
              </IconWithInfo>
              <IconWithInfo
                icon="university"
                present={it.type && it.type !== 'ojt'}
              >
                {'   '}
                {_.capitalize(it.type)} school
              </IconWithInfo>
              <IconWithInfo
                icon="map"
                present={it.localeType && it.type && it.type !== 'ojt'}
              >
                {'   '}
                {_.capitalize(it.localeType)} locale
              </IconWithInfo>
              <IconWithInfo icon="users" present={it.type && it.type !== 'ojt'}>
                {'   '}
                {schoolSize(it.undergradEnrollment)} size
              </IconWithInfo>
            </div>
          </div>
        </div>
        <AdditionalResources />
      </div>
    );
  }
}

HeadingSummary.propTypes = {
  institution: PropTypes.object,
  onLearnMore: PropTypes.func,
  onViewWarnings: PropTypes.func,
};

export default HeadingSummary;
