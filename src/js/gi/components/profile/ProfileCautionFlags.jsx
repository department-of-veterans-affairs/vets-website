import React from 'react';

class ProfileCautionFlags extends React.Component {

  render() {
    const flagged = this.props.institution.cautionFlag;
    if (flagged) {
      return (
        <div className="caution-profile">
          <a id="jump-to-complaints" className="noback" href="#caution_jump_flag">
            <i id="caution-jump-flag-con" className="fa fa-exclamation-triangle"></i>
            &nbsp;Caution Flag (see details)
          </a>
        </div>
      );
    }
    return null;
  }

}

ProfileCautionFlags.propTypes = {
  institution: React.PropTypes.object.isRequired
};

ProfileCautionFlags.defaultProps = {};

export default ProfileCautionFlags;
