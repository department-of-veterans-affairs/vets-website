import React from 'react';
import PropTypes from 'prop-types';

class SectionItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.required,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    title: PropTypes.string.required,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: this.props.expanded || false,
    };
  }

  toggleSection = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { id, className, title } = this.props;
    const { expanded } = this.state;
    return (
      <div aria-live="off" id={id} className={className}>
        <button
          aria-expanded={expanded}
          onClick={this.toggleSection}
          className="usa-button-secondary"
        >
          {title}
        </button>
        <div>{expanded ? this.props.children : null}</div>
      </div>
    );
  }
}

export default SectionItem;
