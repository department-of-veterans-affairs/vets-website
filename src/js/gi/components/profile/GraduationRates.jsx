import React from 'react';

class GraduationRates extends React.Component {

  constructor(props) {
    super(props);
    // this.renderHeader = this.renderHeader.bind(this);
  }

  render() {
    return (
      <div>
        <ul className="accordion">
          <li className="accordion-navigation">
            <p>{this.constructor.name}</p>
          </li>
        </ul>
      </div>
    );
  }

}

GraduationRates.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

GraduationRates.defaultProps = {
  expanded: true
};

export default GraduationRates;
