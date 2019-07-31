import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

class LandingPageTypeOfInstitutionFilter extends React.Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displayVetTecOption: false,
  };

  render() {
    const options = [
      { value: 'school', label: 'Schools' },
      {
        value: 'employer',
        label: 'Employers (On-the-job training [OJT], apprenticeships)',
      },
    ];
    if (this.props.displayVetTecOption) {
      const vetTecLabel = (
        <span>
          VET TEC training providers only &nbsp;
          <button
            aria-label="VET TEC training providers only learn more"
            type="button"
            className="va-button-link learn-more-button"
            onClick={() => this.props.showModal('vetTec')}
          >
            (Learn more)
          </button>
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

export default LandingPageTypeOfInstitutionFilter;
