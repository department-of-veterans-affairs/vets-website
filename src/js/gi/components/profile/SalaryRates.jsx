import React from 'react';

class SalaryRates extends React.Component {

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

SalaryRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

SalaryRates.defaultProps = {
  expanded: true
};

export default SalaryRates;
