import React from 'react';
import PropTypes from 'prop-types';

/**
 * This renderless-component is used to register events with Google Analytics
 * by tying into a US Form System's uiSchema['ui:description'] property. When
 * the data on the form page changes, this component's `componentDidUpdate()`
 * method fires and registers an event with Google Analytics (via `recordEvent`)
 * if the property the component cares about (`selectedValue`) has changed.
 *
 * @export
 * @class UserInteractionRecorder
 * @extends {React.Component}
 */
export default class UserInteractionRecorder extends React.Component {
  componentDidUpdate(prevProps) {
    const { trackingEventMap, selectedValue, eventRecorder } = this.props;
    const { selectedValue: oldSelectedValue } = prevProps;
    if (selectedValue === oldSelectedValue) {
      return;
    }
    if (trackingEventMap[selectedValue]) {
      eventRecorder(trackingEventMap[selectedValue]);
    }
  }

  render() {
    return null;
  }
}

UserInteractionRecorder.propTypes = {
  trackingEventMap: PropTypes.objectOf(PropTypes.object),
  selectedValue: PropTypes.string,
  eventRecorder: PropTypes.func,
};
