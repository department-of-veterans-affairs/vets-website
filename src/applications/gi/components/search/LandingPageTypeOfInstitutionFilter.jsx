import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { renderVetTecLogo } from '../../utils/render';
import { ariaLabels } from '../../constants';

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
            aria-label={ariaLabels.learnMore.vetTecProgram}
            type="button"
            className="va-button-link learn-more-button"
            onClick={() => this.props.showModal('vetTec')}
          >
            (Learn more)
          </button>{' '}
        </span>
      );

      const imgClass = classNames(
        'vettec-logo',
        'vads-u-padding-top--0p5',
        'vads-u-margin-bottom--neg1',
      );
      const vetTecLogo = (
        <span className="vads-u-margin-x--neg1 small-screen:vads-u-display--block">
          {renderVetTecLogo(imgClass)}
        </span>
      );
      options.push({
        value: 'vettec',
        label: 'VET TEC training providers only',
        learnMore: vetTecLabel,
        additional: vetTecLogo,
      });
    }

    return (
      <div className="type-of-institution-filter">
        <RadioButtons
          label="Type of institution"
          name="category"
          options={options}
          value={this.props.category}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default LandingPageTypeOfInstitutionFilter;
