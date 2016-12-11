import React from 'react';

class RepaymentRates extends React.Component {

  constructor(props) {
    super(props);
    // this.renderHeader = this.renderHeader.bind(this);
  }

  render() {
    return (
      <div>
        <ul className="accordion">
          <li className="accordion-navigation">
            <a href="#">{this.constructor.name}</a>
          </li>
        </ul>
      </div>
    );
  }

}

RepaymentRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

RepaymentRates.defaultProps = {
  expanded: true
};

export default RepaymentRates;
