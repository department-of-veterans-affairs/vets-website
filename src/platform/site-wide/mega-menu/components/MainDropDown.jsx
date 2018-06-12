import React from 'react';
import PropTypes from 'prop-types';

class MainDropDown extends React.Component {
  constructor() {
    super();
    this.state = {
      arias: {},
      panelOpen: false,
    };
  }

  handleOnClick() {
    if (this.state['aria-expanded']) {
      this.setState({
        arias: {},
      });
    } else {
      this.setState({
        arias: {
          'aria-expanded': true,
        },
        panelOpen: true,
      });
    }
  }

  render() {
    return (
      <li>
        <button
          {...this.state.arias}
          aria-controls="vetnav-explore"
          aria-haspopup="true"
          className="vetnav-level1"
          onClick={() => this.handleOnClick()}>{this.props.title}</button>
        {
          this.state.panelOpen && <div id="vetnav-explore" className="vetnav-panel" role="none">
            <ul role="menu" aria-label="Explore benefits">
              {this.props.children}
            </ul>
          </div>
        }
      </li>
    );
  }
}

MainDropDown.propTypes = {
  title: PropTypes.string.isRequired,
};

MainDropDown.defaultProps = {
};

export default MainDropDown;
