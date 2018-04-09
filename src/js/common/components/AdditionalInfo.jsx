import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';
import classNames from 'classnames';
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
    const iconClass = classNames({
      fa: true,
      'fa-angle-down': true,
      open: this.state.open
    });
    const trigger = (
      <button
        type="button"
        className="additional-info-button va-button-link"
        aria-expanded={this.state.open ? 'true' : 'false'}
        aria-controls={this.expandedContentId}
        onClick={this.toggle}>
        <span className={`additional-info-title ${this.props.className}`}>{triggerText}<i className={iconClass}></i></span>
      </button>
    );

    return (
      <ExpandingGroup open={this.state.open} expandedContentId={this.expandedContentId}>
        {trigger}
        <div className="additional-info-content">{children}</div>
      </ExpandingGroup>
    );
  }
}

AdditionalInfo.propTypes = {
  triggerText: PropTypes.string
};
