import React from 'react';
import PropTypes from 'prop-types';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';

class RatedDisabilityView extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  componentDidMount() {
    console.log('fetching disabilities');
    this.props.fetchRatedDisabilities();
  }

  noDisabilityRatingContent = () => (
    <>
      <p>
        We can't find a disability rating matched with the name, date of birth,
        and social secuity number you provided in our Veteran records.
      </p>
      <h4>What you can do</h4>
      <p>
        If you feel your information is correct, please call the VA.gov
        1-855-574-7286. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m.
        (ET).
      </p>
    </>
  );

  // Need to transform date string into a meaningful format and extract any special issues.
  formalizeData = data => {
    const formalizedDisabilityData = data.map(d => {
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
      return <h1>Loading!</h1>;
    }

    if (this.props.ratedDisabilities.error) {
      return (
        <>
          <h2 className="va-profile-heading">Rated disabilities</h2>
          <div className="usa-width-one-whole">
            <AlertBox
              headline="No disability rating found"
              content={this.noDisabilityRatingContent()}
              status="info"
              isVisible
            />
          </div>
        </>
      );
    }
    const formattedDisabilities = this.formalizeData(
      this.props.ratedDisabilities.ratedDisabilities,
    );

    return (
      <>
        <h2 className="va-profile-heading">Rated disabilities</h2>
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
      </>
    );
  }
}

export default RatedDisabilityView;
