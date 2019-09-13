import React from 'react';
import PropTypes from 'prop-types';

import featureFlags from '../featureFlags';

import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import moment from 'moment';

class RatedDisabilities extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  componentDidMount() {
    this.props.fetchRatedDisabilities();
  }

  formalizeData = data => {
    data.map(d => {
      const effectiveDate = {
        effectiveDate: moment(d.effectiveDate).format('DD/MM/YYYY'),
      };
      const relatedTo = {
        relatedTo: d.specialsIssues.length > 0 ? d.specialIssues[0].name : '',
      };
      const disability = Object.assign({}, d, effectiveDate, relatedTo);
      return disability;
    });
  };

  render() {
    if (!featureFlags.ratedDisabilities) {
      return null;
    }

    if (!this.props.ratedDisabilities) {
      return <h1>Loading!</h1>;
    }

    if (this.props.ratedDisabilities?.error) {
      return (
        <h1>
          We're having trouble accessing your rated disabilities at this time.
        </h1>
      );
    }
    // Format date strings
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

export default RatedDisabilities;
