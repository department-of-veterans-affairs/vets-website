import React from 'react';

class ProfileCalculator extends React.Component {

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

ProfileCalculator.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileCalculator.defaultProps = {
  expanded: true
};

export default ProfileCalculator;
