import React from 'react';
import { connect } from 'react-redux';

class RxAlert extends React.Component {
  constructor(props) {
    super(props);
    this.toggleHidden = this.toggleHidden.bind(this);
    this.state = {
      isHidden: true
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  render() {
    let stuff1;
    let stuff2;
    if (typeof x === 'undefined') {
      stuff1 = (<p onClick={this.toggleHidden}><i className="error fa fa-exclamation-triangle"></i> Refill Your Prescription</p>);
      stuff2 = (
        <div className="va-callout grey row">
          <div className="medium-8 columns">
            <p>We can not find any prescription information for you. Have you already applied for VA Healthcare? If not please do so.</p>
          </div>
          <div className="medium-3 columns">
            <button>Apply for Healthcare</button>
          </div>
        </div>
      );
    } else {
      stuff1 = (<p><a href="/rx"><i className="success fa fa-check-circle"></i> Refill Your Prescription</a></p>);
    }
    return (
      <div>
        {stuff1}
        {!this.state.isHidden && stuff2}
      </div>
    );
  }
}

class ClaimsAlert extends React.Component {
  constructor(props) {
    super(props);
    this.toggleHidden = this.toggleHidden.bind(this);
    this.state = {
      isHidden: true
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  render() {
    let stuff1;
    let stuff2;
    if (typeof x === 'undefined') {
      stuff1 = (<p onClick={this.toggleHidden}><i className="error fa fa-exclamation-triangle"></i> Check Your Claim Status</p>);
      stuff2 = (
        <div className="va-callout grey row">
          <div className="medium-8 columns">
            <p>We can not find any benefit claims information for you. Have you already submitted a claim for VA Benfits? If not please do so.</p>
          </div>
          <div className="medium-3 columns">
            <button>Submit VA Claim</button>
          </div>
        </div>
      );
    } else {
      stuff1 = (<p><a href="/disability-benefits/track-claims"><i className="success fa fa-check-circle"></i> Check Your Claim Status</a></p>);
    }
    return (
      <div>
        {stuff1}
        {!this.state.isHidden && stuff2}
      </div>
    );
  }
}

class AuthApplicationSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Authorized Applications</h4>
        <div className="info-conatiner medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/healthcare/apply"><i className="success fa fa-check-circle"></i> Apply for Healthcare</a></p>
          <p><a href="/education/apply-for-education-benefits"><i className="success fa fa-check-circle"></i> Apply for Education Benefits</a></p>
          <RxAlert/>
          <ClaimsAlert/>
        </div>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(AuthApplicationSection);
export { AuthApplicationSection };
