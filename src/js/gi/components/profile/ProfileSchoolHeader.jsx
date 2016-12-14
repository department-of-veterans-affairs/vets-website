import React from 'react';
import If from '../If';

class ProfileSchoolHeader extends React.Component {

  constructor(props) {
    super(props);
    this.renderLocality = this.renderLocality.bind(this);
    this.renderInstitutionLink = this.renderInstitutionLink.bind(this);
  }

  renderLocality() {
    const school = this.props.institution;
    const domestic = <p className="search-locality">{school.city}, {school.state.toUpperCase()}</p>;
    const foreign = <p className="search-locality">{school.city}, {school.country}</p>;
    return (school.country.toLowerCase() === 'usa' ? domestic : foreign);
  }

  renderInstitutionLink() {
    const school_url = this.props.institution.insturl;
    if (!school_url) {
      return null;
    }
    return (
      <p>
        <a href="http://{school_url.toLowerCase()}" target="_blank">
          {school_url.toLowerCase()}
        </a>
      </p>
    );
  }

  render() {
    const school = this.props.institution;
    const hdo = school.highest_degree;
    return (
      <span>
        <div className="small-12 columns">
          <h4 className="profile-head">{school.institution}</h4>
        </div>

        <div className="medium-7 columns">
          <div id={school.facility_code} className="profile_overview"
            data-type={school.name  /* @school.institution_type.name */}
            data-country={school.country}
            data-bah={school.bah || 0}>

            <div>{this.renderLocality()}</div>
          </div>
        </div>

        <p>
          <span className="gi-bill-student-count">{school.gibill}&nbsp;</span>
          <a onClick={() => {this.props.toggleModalDisplay('gibillstudents')}}>
            <span className="programs-text">GI Bill Students</span>
          </a>
        </p>

        {this.renderInstitutionLink()}

        <div className="medium-5 columns border-left profile-details">
          <table className="borderless">
            <tbody>
              <tr className="profile-institute-descriptors">
                <If condition={school.institution_type.name !== 'ojt' && hdo}>
                  <td className="profile-institute-qualifier">
                    <i className="fa fa-calendar fa-profile-descriptors"></i>
                    &nbsp;Program:&nbsp;
                  </td>
                  <td className="profile-institute-value">
                    {hdo}
                    <If condition={hdo === 2 || hdo === 4}>
                      &nbsp;<span>Year</span>
                    </If>
                  </td>
                </If>
              </tr>
              <tr className="profile-institute-descriptors">
                <td className="profile-institute-qualifier">
                  <i className="fa fa-university fa-profile-descriptors"></i>
                  &nbsp;Type:&nbsp;
                </td>
                <td className="profile-institute-value">
                  {school.institution_type.display}
                </td>
              </tr>
              <tr className="profile-institute-descriptors">
                <td className="profile-institute-qualifier">
                  <i className="fa fa-map fa-profile-descriptors"></i>
                  &nbsp;Locale:
                </td>
                <td className="profile-institute-value">
                  {school.locale_name}
                </td>
              </tr>
              <tr className="profile-institute-descriptors">
                <td className="profile-institute-qualifier">
                  <i className="fa fa-users fa-profile-descriptors"></i>
                  &nbsp;Size:
                </td>
                <td className="profile-institute-value">
                  {/* to_school_size(@school.undergrad_enrollment) */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </span>
    );
  }

}

ProfileSchoolHeader.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func
};

ProfileSchoolHeader.defaultProps = {};

export default ProfileSchoolHeader;
