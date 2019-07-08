import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

class TypeOfInstitutionFilter extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displayVetTecOption: true,
  };

  render() {
    const options = [
      { value: 'ALL', label: 'All' },
      { value: 'school', label: 'Schools only' },
      { value: 'employer', label: 'Employers only' },
    ];
    if (this.props.displayVetTecOption) {
      options.push({
        value: 'vettec',
        label: 'VET TEC training providers only',
      });
    }

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

export default TypeOfInstitutionFilter;
