import React from 'react';
import RadioButtons from '../RadioButtons';
import PropTypes from 'prop-types';
import { renderLearnMoreLabel } from '../../utils/render';

class OnlineClassesFilter extends React.Component {
  static propTypes = {
    onlineClasses: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    showModal: PropTypes.func.isRequired,
  };

  render() {
    return (
      <RadioButtons
        label={renderLearnMoreLabel({
          text: 'How do you want to take classes?',
          modal: 'onlineOnlyDistanceLearning',
          showModal: this.props.showModal,
          component: this,
        })}
        name="onlineClasses"
        options={[
          { value: 'yes', label: 'Online only' },
          { value: 'no', label: 'In person only' },
          { value: 'both', label: 'In person and online' },
        ]}
        value={this.props.onlineClasses}
        onChange={this.props.onChange}
      />
    );
  }
}

export default OnlineClassesFilter;
