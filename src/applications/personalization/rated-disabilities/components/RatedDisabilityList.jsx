import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import _ from 'lodash';
import moment from 'moment';
import RatedDisabilityListItem from './RatedDisabilityListItem';

class RatedDisabilityList extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  componentDidMount() {
    this.props.fetchRatedDisabilities();
  }

  noDisabilityRatingContent(errorCode) {
    let headline;
    let content;
    let status;
    switch (errorCode) {
      case '500':
        headline = "We're sorry, something went wrong on our end";
        status = 'error';
        content = (
          <>
            <p>
              Please refresh this page or check back later. You can also sign
              out of VA.gov and try signing back into this page.
            </p>
            <p>
              If you get this error again, please call VA.gov help desk at{' '}
              <a
                href="tel"
                aria-label="Dial the telephone number 800-827-1000"
                title="Dial the telephone number 800-827-1000"
              >
                855-574-7286
              </a>{' '}
              (TTY:711). We're here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.
            </p>
          </>
        );
        break;
      default:
        headline = 'No disability rating found';
        status = 'info';
        content = (
          <>
            <p>
              We are sorry. We can't find a disability rating matched with the
              name, date of birth, and social secuity number you provided in our
              Veteran records.
            </p>
            <h4>What you can do</h4>
            <p>
              If you feel your information is correct, please call the VA.gov
              1-855-574-7286. We're here Monday through Friday, 8:00 a.m. to
              8:00 p.m. (ET).
            </p>
          </>
        );
        break;
    }

    return (
      <div className="vads-u-margin-y--5">
        <AlertBox
          headline={headline}
          content={content}
          status={status}
          isVisible
        />
      </div>
    );
  }

  // Need to transform date string into a meaningful format and extract any special issues.
  formalizeData(data) {
    const formalizedDisabilityData = _.map(data, d => {
      const effectiveDate = {
        effectiveDate: moment(d.effectiveDate).format('DD/MM/YYYY'),
      };
      const relatedTo = {
        // Right now we only take the first value...but what if there is more than one?
        relatedTo: d.specialIssues.length > 0 ? d.specialIssues[0].name : '',
      };
      const disability = Object.assign({}, d, effectiveDate, relatedTo);
      return disability;
    });

    return formalizedDisabilityData;
  }

  render() {
    if (!this.props.ratedDisabilities) {
      return <LoadingIndicator message="Loading your information..." />;
    }
    // Display error message based on error type.
    if (this.props.ratedDisabilities.errors) {
      const code = this.props.ratedDisabilities.errors[0].code;
      return (
        <div className="usa-width-one-whole">
          {this.noDisabilityRatingContent(code)}
        </div>
      );
    }

    const formattedDisabilities = this.formalizeData(
      this.props?.ratedDisabilities?.ratedDisabilities,
    );

    return (
      <div className="vads-l-row">
        <h3 className="vads-u-font-family--sans vads-u-margin-y--1">
          Individual disability ratings
        </h3>
        <div className="vads-u-border-top--1px vads-l-row">
          {formattedDisabilities.map((disability, index) => (
            <RatedDisabilityListItem ratedDisability={disability} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

export default RatedDisabilityList;
