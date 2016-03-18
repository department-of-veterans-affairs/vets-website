import React from 'react';

import Address from '../questions/Address';
import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import Phone from '../questions/Phone';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';

import { suffixes } from '../../utils/options-for-select';

// TODO: Refactor name to use FullName once that can be abstracted more

class SpouseInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h4>Spouse's Information</h4>
          {this.props.external.receivesVaPension === true &&
            <p>
              <strong>
              You are not required to enter financial information because you
              indicated you are receiving a VA pension.
              </strong>
            </p>
          }
          {this.props.external.neverMarried === true &&
            <p>
              <strong>
              You are not required to enter financial information because you
              indicated you've never had a spouse.
              </strong>
            </p>
          }
        </div>
        {this.props.external.neverMarried === false &&
          <div>
            <div>
              <div className="row">
                <div className="small-3 columns">
                  <ErrorableTextInput
                      label="First Name"
                      value={this.props.data.spouseFirstName}
                      onValueChange={(update) => {this.props.onStateChange('spouseFirstName', update);}}/>
                </div>
                <div className="small-3 columns">
                  <ErrorableTextInput
                      label="Middle Name"
                      value={this.props.data.spouseMiddleName}
                      onValueChange={(update) => {this.props.onStateChange('spouseMiddleName', update);}}/>
                </div>
                <div className="small-3 columns">
                  <ErrorableTextInput
                      label="Last Name"
                      value={this.props.data.spouseLastName}
                      onValueChange={(update) => {this.props.onStateChange('spouseLastName', update);}}/>
                </div>
                <div className="small-3 columns">
                  <ErrorableSelect
                      label="Suffix"
                      options={suffixes}
                      value={this.props.data.spouseSuffix}
                      onValueChange={(update) => {this.props.onStateChange('spouseSuffix', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-9 columns">
                  <SocialSecurityNumber label="Spouse’s Social Security Number"
                      required={false}
                      ssn={this.props.data.spouseSocialSecurityNumber}
                      onValueChange={(update) => {this.props.onStateChange('spouseSocialSecurityNumber', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-9 columns">
                  <h5>Spouse’s Date of Birth</h5>
                  <span className="usa-form-hint usa-datefield-hint" id="dobHint">For example: 04 28 1986</span>
                  <DateInput
                      day={this.props.data.spouseDateOfBirth.day}
                      month={this.props.data.spouseDateOfBirth.month}
                      year={this.props.data.spouseDateOfBirth.year}
                      onValueChange={(update) => {this.props.onStateChange('spouseDateOfBirth', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-9 columns">
                  <h5>Date of Marriage</h5>
                  <span className="usa-form-hint usa-datefield-hint" id="dobHint">For example: 04 28 1986</span>
                  <DateInput
                      day={this.props.data.dateOfMarriage.day}
                      month={this.props.data.dateOfMarriage.month}
                      year={this.props.data.dateOfMarriage.year}
                      onValueChange={(update) => {this.props.onStateChange('dateOfMarriage', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns">
                  <ErrorableCheckbox
                      label="Do you have the same address as your spouse?"
                      checked={this.props.data.sameAddress}
                      onValueChange={(update) => {this.props.onStateChange('sameAddress', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns">
                  <ErrorableCheckbox
                      label="Did your spouse live with you last year?"
                      checked={this.props.data.cohabitedLastYear}
                      onValueChange={(update) => {this.props.onStateChange('cohabitedLastYear', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns">
                  <hr/>
                  You may count your spouse as your dependent even if you did not live
                  together, as long as you contributed support last calendar year.
                  <hr/>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns">
                  <ErrorableCheckbox
                      label="If your spouse did not live with you last year, did you provide support?"
                      checked={this.props.data.provideSupportLastYear}
                      onValueChange={(update) => {this.props.onStateChange('provideSupportLastYear', update);}}/>
                </div>
              </div>
            </div>

            <div>
              <div className="row">
                <div className="small-12 columns">
                  <h4>Spouse's Address and Telephone Number</h4>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns">
                  <Address value={this.props.data.spouseAddress}
                      onUserInput={(update) => {this.props.onStateChange('spouseAddress', update);}}/>
                </div>
              </div>

              <div className="row">
                <div className="small-12 columns">
                  <Phone
                      label="Phone"
                      value={this.props.data.spousePhone}
                      onValueChange={(update) => {this.props.onStateChange('spousePhone', update);}}/>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SpouseInformationSection;
