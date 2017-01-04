import React from 'react';
import If from '../If';

class ProfileSummary extends React.Component {

  constructor(props) {
    super(props);
    this.renderAccredited = this.renderAccredited.bind(this);
  }

  renderAccredited() {
    const school = this.props.institution;
    const id = school.cross;
    const link = <td><a href={`http://nces.ed.gov/collegenavigator/?id=${id}#accred`} target="_blank">See Accreditors</a></td>;
    return (id ? <span>Yes {link}</span> : <span>No</span>);
  }

  render() {
    const school = this.props.institution;
    const yesNoOrNoData = (cond) => {
      if (cond) { return (cond ? 'Yes' : 'No'); }
      return 'No Data';
    };
    return (
      <div className="usa-width-one-whole">
        <table className="profile-school-summary">
          <tbody>
            <tr>
              <td>Accredited&nbsp;<a onClick={this.props.toggleModalDisplay.bind(this, 'accredited')} className="info-icons"><i id="acreditied-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>
                <If condition={!!school.cross}>{this.renderAccredited()}</If>
              </td>
            </tr>
            <If condition={!!school.accredited}>
              <tr>
                <td>Type of Accreditation:&nbsp;<a onClick={this.props.toggleModalDisplay.bind(this, 'typeAccredited')} className="info-icons"><i id="type-of-accreditation-info" className="fa fa-info-circle info-icons"></i></a></td>
                <td>{school.accreditationType}</td>
                <td></td>
              </tr>
            </If>
            <If condition={!!school.vetTuitionPolicyUrl}>
              <tr>
                <td>Link to Veterans Tuition Policy:&nbsp;<a onClick={this.props.toggleModalDisplay.bind(this, 'tuitionPolicy')} className="info-icons"><i id="link-to-tuition-policy-info" className="fa fa-info-circle info-icons"></i></a></td>
                <td><a target="_blank" href={`http://${school.vetTuitionPolicyUrl}`}>View Policy</a></td>
                <td></td>
              </tr>
            </If>
            <tr>
              <td>Single Point of Contact For Veterans:&nbsp;<a onClick={this.props.toggleModalDisplay.bind(this, 'singleContact')} className="info-icons"><i id="single-point-of-contact-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{yesNoOrNoData(!!school.vetPoc)}</td>
              <td></td>
            </tr>
            <tr>
              <td>Credit for Military Training:&nbsp;<a onClick={this.props.toggleModalDisplay.bind(this, 'creditTraining')} className="info-icons"><i id="credit-for-military-training-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{yesNoOrNoData(!!school.creditForMilTraining)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

ProfileSummary.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileSummary.defaultProps = {
  expanded: true
};

export default ProfileSummary;
