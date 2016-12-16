import React from 'react';

class ProfileVeteranSummary extends React.Component {

  constructor(props) {
    super(props);
    this.renderStudentVeteranGroup = this.renderStudentVeteranGroup.bind(this);
  }

  renderStudentVeteranGroup() {
    const school = this.props.institution;
    const feature = school.studentVeteran;
    const mark = feature ? <span className="programs-yes">✔</span> : <span className="programs-no">✖</span>;
    const href = school.studentVeteranLink;
    const link = () => {
      if (!feature || !href) { return null; }
      return (
        <a target="_blank" href={href} className="programs-text">
          &nbsp;Go To Site >>
        </a>
      );
    };
    return (
      <li>
        {mark}
        <a onClick={() => {this.props.toggleModalDisplay('vetgroups');}}>
          Student Veteran Group
        </a>
        {link()}
      </li>
    );
  }

  renderYellowRibbon() {
    const school = this.props.institution;
    const feature = school.yr;
    const mark = feature ? <span className="programs-yes">✔</span> : <span className="programs-no">✖</span>;
    const href = `http://www.benefits.va.gov/gibill/yellow_ribbon/2015/states/${school.state}.asp`;
    const link = () => {
      if (!feature) { return null; }
      return (
        <a target="_blank" href={href} className="programs-text">
          <span className="see-yr-rates-summary">See YR Rates</span>
        </a>
      );
    };
    return (
      <li>
        {mark}
        <a onClick={() => {this.props.toggleModalDisplay('yribbon');}}>
          Yellow Ribbon
        </a>
        {link()}
      </li>
    );
  }

  renderPrinciplesOfExcellence() {
    const school = this.props.institution;
    const feature = school.poe;
    const mark = feature ? <span className="programs-yes">✔</span> : <span className="programs-no">✖</span>;
    return (
      <li>
        {mark}
        <a onClick={() => {this.props.toggleModalDisplay('poe');}}>
          <span className="programs-text">Principles of Excellence</span>
        </a>
      </li>
    );
  }

  renderMilitaryTuitionAssistance() {
    const school = this.props.institution;
    const feature = school.dodmou;
    const mark = feature ? <span className="programs-yes">✔</span> : <span className="programs-no">✖</span>;
    return (
      <li>
        {mark}
        <a id="military-tuition-assistance-info-link" onClick={() => {this.props.toggleModalDisplay('tool');}}>
          <span className="programs-text">Military Tuition Assistance (TA)</span>
        </a>
      </li>
    );
  }

  renderVetSuccess() {
    const school = this.props.institution;
    const feature = school.vetsuccessName;
    const mark = feature ? <span className="programs-yes">✔</span> : <span className="programs-no">✖</span>;
    const email = school.vetsuccessEmail;
    const link = () => {
      if (!feature || !email) { return null; }
      return (
        <a target="_blank" href={`mailto:${email}`} className="programs-text">
          &nbsp;Email #{feature} >>
        </a>
      );
    };
    return (
      <li>
        {mark}
        <span className="programs-text">VetSuccess on Campus</span>
        {link()}
      </li>
    );
  }

  renderEightKeys() {
    const school = this.props.institution;
    const feature = school.eightKeys;
    const mark = feature ? <span className="programs-yes">✔</span> : <span className="programs-no">✖</span>;
    return (
      <li>
        {mark}
        <a id="8-keys-info-link" onClick={() => {this.props.toggleModalDisplay('eightKeys');}}>
          <span className="programs-text">8 Keys to Veteran Success</span>
        </a>
      </li>
    );
  }

  render() {
    return (
      <div className="large-12 columns accordion-vert-spacing">
        <ul className="accordion" data-accordion>
          <li className="accordion-navigation">
            <p>Veteran Summary</p>
            <div id="panel1a" className="content active">
              <div className="va-summary-card multicolumn-text">
                <ul>
                  {this.renderStudentVeteranGroup()}
                  {this.renderYellowRibbon()}
                  {this.renderPrinciplesOfExcellence()}
                  {this.renderMilitaryTuitionAssistance()}
                  {this.renderVetSuccess()}
                  {this.renderEightKeys()}
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }

}

ProfileVeteranSummary.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileVeteranSummary.defaultProps = {
  expanded: true
};

export default ProfileVeteranSummary;
