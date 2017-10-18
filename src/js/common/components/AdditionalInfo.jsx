import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';
import ExpandingGroup from './form-elements/ExpandingGroup';

export default class AdditionalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.expandedContentId = _.uniqueId('tooltip-');
    this.state = { open: false };
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { triggerText, children } = this.props;

    const trigger = (
      <button
        type="button"
        className="va-button-link"
        aria-expanded={this.state.open ? 'true' : 'false'}
        aria-controls={this.expandedContentId}
        onClick={this.toggle}>
        {triggerText}
      </button>
    );

    return (
      <ExpandingGroup open={this.state.open} expandedContentId={this.expandedContentId}>
        {trigger}
        <div>
          <div className="additional-info-content">{children}</div>
          <button
            className="va-button-link"
            aria-expanded={this.state.open ? 'true' : 'false'}
            aria-controls={this.expandedContentId}
            onClick={this.toggle}>
            Close
          </button>
        </div>
      </ExpandingGroup>
    );
  }
}

AdditionalInfo.propTypes = {
  triggerText: PropTypes.string
};
