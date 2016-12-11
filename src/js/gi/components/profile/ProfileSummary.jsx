import React from 'react';

class ProfileSummary extends React.Component {

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

ProfileSummary.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileSummary.defaultProps = {
  expanded: true
};

export default ProfileSummary;
