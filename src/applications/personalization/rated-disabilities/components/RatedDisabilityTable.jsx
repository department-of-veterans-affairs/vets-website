import React from 'react';
import PropTypes from 'prop-types';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import _ from 'lodash';
import moment from 'moment';

class RatedDisabilityTable extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  componentDidMount() {
    this.props.fetchRatedDisabilities();
  }

  noDisabilityRatingContent = errorCode => {
    let headline;
    let content;
    let status;
    switch (errorCode) {
      case '500':
        headline = 'Rated disabilities error';
        status = 'error';
        content = (
          <>
            <p>
              We're sorry. An error occurred when accessing your disability
              rating information.
            </p>
            <h4>What you can do</h4>
            <p>
              Sign out of VA.gov, then log back in to try this page again. If
              the error continues, please call the VA.gov Help Desk at
              1-855-574-7286 (TTY:1-800-829-4833). We're here Monday-Friday,
              8:00 a.m. - 8:00 p.m. (ET).
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
              We sorry. We can't find a disability rating matched with the name,
              date of birth, and social secuity number you provided in our
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
  };

  // Need to transform date string into a meaningful format and extract any special issues.
  formalizeData = data => {
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
  };

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
      <div className="vads-u-width--full">
        <h2 className="vads-u-font-family--sans vads-u-font-size--h3 vads-u-margin-y--1">
          Your rated disabilities
        </h2>
        <SortableTable
          className="va-table"
          currentSort={{ value: 'String', order: 'ASC' }}
          fields={[
            { label: 'Disability', value: 'name' },
            { label: 'Rating', value: 'ratingPercentage' },
            { label: 'Decision', value: 'decisionText' },
            { label: 'Related To', value: 'relatedTo' },
            { label: 'Effective Date', value: 'effectiveDate' },
          ]}
          data={[...formattedDisabilities]}
        />
      </div>
    );
  }
}

export default RatedDisabilityTable;
