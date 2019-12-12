import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import moment from 'moment';
import RatedDisabilityListItem from './RatedDisabilityListItem';
import { isServerError } from '../util';

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
    let status;
    let content;
    if (isServerError(errorCode)) {
      status = 'error';
      content = (
        <>
          <h2 className="vads-u-margin-y--0 vads-u-font-size--lg">
            We’re sorry. Something went wrong on our end
          </h2>
          <p>
            Please refresh this page or check back later. You can also sign out
            of VA.gov and try signing back into this page.
          </p>
          <p>
            If you get this error again, please call VA.gov help desk at{' '}
            <a
              href="tel:18555747286"
              aria-label="1. 8 5 5. 5 7 4. 7 2 8 6."
              title="Dial the telephone number 1-855-574-7286"
            >
              1-855-574-7286
            </a>{' '}
            (TTY:711). We’re here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.
          </p>
        </>
      );
    } else {
      status = 'info';
      content = (
        <>
          <h2 className="vads-u-margin-y--0 vads-u-font-size--lg">
            We don’t have rated disabilities on file for you
          </h2>
          <p>
            We’re sorry. We can’t find any rated disabilities for you. If you
            have a disability that was caused by or got worse because of your
            service, you can file a claim for disability benefits.
          </p>
          <a
            href="/disability/how-to-file-claim/"
            className="usa-link"
            aria-label="Learn how to file a claim for disability compensation"
          >
            Learn how to file a claim for disability compensation
          </a>
        </>
      );
    }
    return (
      <div className="vads-u-margin-y--5">
        <AlertBox content={content} status={status} isVisible />
      </div>
    );
  }

  // Need to transform date string into a meaningful format and extract any special issues.
  formalizeData(data) {
    const formalizedDisabilityData = data.map(d => {
      const effectiveDate = {
        effectiveDate: d.effectiveDate
          ? moment(d.effectiveDate).format('DD/MM/YYYY')
          : null,
      };
      const relatedTo = {
        // Right now we only take the first value...but what if there is more than one?
        relatedTo:
          Array.isArray(d.specialIssues) && d.specialIssues.length > 0
            ? d.specialIssues[0].name
            : null,
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
    if (
      this.props?.ratedDisabilities?.errors ||
      this.props?.ratedDisabilities?.ratedDisabilities.length === 0
    ) {
      // There are instances when a 200 response is received but evss sends an empty array.
      // In this scenario errorCode is explicitly set to 404 to ensure a defined value is passed to noDisabilityRatingContent
      const errorCode = this.props?.ratedDisabilities?.errors?.[0]?.code || 404;
      return (
        <div className="usa-width-one-whole">
          {this.noDisabilityRatingContent(errorCode)}
        </div>
      );
    }

    const formattedDisabilities = this.formalizeData(
      this.props?.ratedDisabilities?.ratedDisabilities,
    );

    return (
      <div className="vads-l-row">
        <h2 className="vads-u-margin-y--1p5 vads-u-font-size--lg">
          Individual disabilities
        </h2>
        <div className="vads-l-row">
          {formattedDisabilities.map((disability, index) => (
            <RatedDisabilityListItem ratedDisability={disability} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

export default RatedDisabilityList;
