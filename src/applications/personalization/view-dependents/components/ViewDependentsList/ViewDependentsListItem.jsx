import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ViewDependentsListItem extends Component {
  render() {
    var onAward,
        relationship;

    // If this person is on award, add the 'onAward' content
    if(this.props.awardIndicator == 'Y') {
      onAward = (
        <p className="vads-u-margin-right--2 vads-u-margin-top--0">
          <i className="fas fa-medal vads-u-margin-right--0p5" />
          <span className="vads-u-font-weight--bold">On Award</span>{' '}
        </p>
      );
    }

    // if this person is a child, add content for child. Otherwise add content for spouse
    if(this.props.relationship == 'Child') {
      relationship = (
        <div className="vads-l-col--3">
          <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
            Child
          </p>
        </div>
      )
    } else {
      relationship = (
        <div className="vads-l-col--3">
          <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
            Spouse
          </p>
        </div>
      )
    }

    return (
      <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
        <div className="vads-l-row">
          <div className="vads-l-col--9">
            <p className="vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0 vads-u-font-size--lg">
              {this.props.firstName + ' ' + this.props.lastName}
            </p>
          </div>
          {relationship}
        </div>
        <div className="vads-l-row vads-u-margin-y--0p5">
          <div className="vads-l-col--12 vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
            {onAward}
            {this.props.ssn
              ? <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                  SSN: <strong>{this.props.ssn}</strong>
                </p>
              : null}

            {this.props.dateOfBirth
              ? <p className="vads-u-margin-left--2 vads-u-margin-top--0 vads-u-margin-bottom--0">
                  Date of birth: <strong>{this.props.dateOfBirth}</strong>
                </p>
              : null}
          </div>
        </div>
      </div>
    );
  }
};

ViewDependentsListItem.propTypes = {
  first_name: PropTypes.string,
  spouse: PropTypes.bool,
  social: PropTypes.string,
  birthdate: PropTypes.string,
  age: PropTypes.number,
};

export default ViewDependentsListItem;
