import React from 'react';

class ProfileHistory extends React.Component {

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

ProfileHistory.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileHistory.defaultProps = {
  expanded: true
};

export default ProfileHistory;
