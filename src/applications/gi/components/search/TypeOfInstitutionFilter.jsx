import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

class TypeOfInstitutionFilter extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displayVetTecOption: false,
    displayAllOption: false,
  };

  render() {
    const options = [];

    if (this.props.displayAllOption) {
      options.push({
        value: 'ALL',
        label: 'All',
      });
    }

    options.push({ value: 'school', label: 'Schools only' });
    options.push({ value: 'employer', label: 'Employers only' });

    if (this.props.displayVetTecOption) {
      const vetTecLabel = (
        <span>
          VET TEC training providers only &nbsp;(
          <a
            href="/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
          )
        </span>
      );
      options.push({
        value: 'vettec',
        label: vetTecLabel,
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
