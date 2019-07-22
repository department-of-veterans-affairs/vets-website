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
    options.push({
      value: 'employer',
      label: 'Employers (On-the-job training [OJT], apprenticeships)',
    });

    if (this.props.displayVetTecOption) {
      const vetTecLabel = (
        <span>
          VET TEC training providers only &nbsp;(
          <a onClick={() => this.props.showModal('vetTecModal')}>
            Learn More)
            <br />
          </a>
          {this.props.category === 'vettec' && (
            <span className="vads-u-margin-x--neg5">
              {' '}
              <img
                className="vads-u-padding-top--3"
                src="/img/logo/vet-tec-logo.png"
                alt="Vet Tec Logo"
                width="179px"
                height="85px"
              />
            </span>
          )}
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
