import React from 'react';
import Checkbox from '../Checkbox';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';
import environment from 'platform/utilities/environment';

class CautionaryWarningsFilter extends React.Component {
  static propTypes = {
    excludeWarnings: PropTypes.bool.isRequired,
    excludeCautionFlags: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    showModal: PropTypes.func.isRequired,
    handleInputFocus: PropTypes.func,
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
          Warnings and school closings
          {this.renderProfileCautionFlagModal()}
        </p>
        <Checkbox
          checked={this.props.excludeWarnings}
          name="excludeWarnings"
          label="Exclude results with warnings or closings"
          onChange={this.props.onChange}
          onFocus={this.props.handleInputFocus}
        />
      </div>
    );
  }
}

export default CautionaryWarningsFilter;
