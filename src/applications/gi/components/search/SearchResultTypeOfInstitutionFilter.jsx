import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

class SearchResultTypeOfInstitutionFilter extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const options = [
      {
        value: 'ALL',
        label: 'All',
      },
      {
        value: 'school',
        label: 'Schools only',
      },
      {
        value: 'employer',
        label: 'Employers only (OJT, apprenticeships)',
      },
    ];

    return (
      <RadioButtons
        label="Type of institution"
        name="category"
        options={options}
        value={this.props.category}
        onChange={this.props.onChange}
      />
    );
  }
}

export default SearchResultTypeOfInstitutionFilter;
