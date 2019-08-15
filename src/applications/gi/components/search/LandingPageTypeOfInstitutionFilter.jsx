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
        <span className="vads-u-padding-top--1 vads-u-margin-left--0p5 learnMoreLabel">
          {' '}
          <button
            aria-label="VET TEC training providers only learn more"
            type="button"
            className="va-button-link learn-more-button"
            onClick={() => this.props.showModal('vetTec')}
          >
            (Learn more)
          </button>{' '}
        </span>
      );

      options.push({
        value: 'vettec',
        label: 'VET TEC training providers only',
        learnMore: vetTecLabel,
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
