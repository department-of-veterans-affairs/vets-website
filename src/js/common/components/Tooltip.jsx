import React from 'react';
import ExpandingGroup from './form-elements/ExpandingGroup';

export default class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { text, children } = this.props;

    const trigger = <button type="button" className="va-button-link" onClick={this.toggle}>{text}</button>;

    return (
      <ExpandingGroup open={this.state.open}>
        {trigger}
        <div>
          <div className="tooltip-content">{children}</div>
          <button className="va-button-link" onClick={this.toggle}>Close</button>
        </div>
      </ExpandingGroup>
    );
  }
}
