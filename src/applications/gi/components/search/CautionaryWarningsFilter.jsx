import React from 'react';
import Checkbox from '../Checkbox';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

class CautionaryWarningsFilter extends React.Component {
  static propTypes = {
    excludeCautionFlags: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    showModal: PropTypes.func.isRequired,
  };

  renderProfileCautionFlagModal = () =>
    renderLearnMoreLabel({
      modal: 'cautionaryWarnings',
      showModal: this.props.showModal,
      ariaLabel: ariaLabels.learnMore.cautionaryWarning,
      component: this,
    });

  render() {
    return (
      <div>
        <p>
          Cautionary warnings
          {this.renderProfileCautionFlagModal()}
        </p>
        <Checkbox
          checked={this.props.excludeCautionFlags}
          name="excludeCautionFlags"
          label="Exclude institutions with warnings"
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default CautionaryWarningsFilter;
