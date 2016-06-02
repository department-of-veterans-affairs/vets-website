import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class FinancialDisclosureSection extends React.Component {
  render() {
    let notRequiredMessage;
    let content;
    let editButton;

    if (this.props.receivesVaPension === true) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Do you want to provide your financial information so the VA can determine your
         eligibility for other services and enrollment and if you will be charged copays for care
          and medication?:
            </td>
            <td>{`${this.props.data.provideFinancialInfo ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>I understand VA is not enrolling new applicants who decline to provide their financial information:</td>
            <td>{`${this.props.data.understandsFinancialDisclosure ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div className="input-section">
        {notRequiredMessage}

        <p>
          Disclosure allows VA to accurately determine whether certain Veterans
          will be charged copays for care and medications, their eligibility for
          other services and enrollment. Veterans are not required to disclose
          their financial information; however, VA is not currently enrolling new
          applicants who decline to provide their financial information unless they
          have other qualifying eligibility factors (i.e., a former Prisoner of
          War, in <strong>receipt of a Purple Heart, discharged for a disability incurred or
          aggravated in the line of duty, receiving VA service-connected disability
          compensation, receiving VA pension, in receipt of Medicaid benefits, or a
          recently discharged Combat Veteran (e.g., OEF/OIF/OND), who was
          discharged within the past 5 years are eligible for enrollment without
          disclosing their financial information)</strong> but like other Veterans may
          provide their financial information to establish their eligibility for
          travel assistance, cost-free medications and/or medical care for services
          unrelated to military experience.
        </p>

        <div className="input-section">
          <ErrorableCheckbox
              label="Do you want to provide your financial information so the VA can determine your eligibility for
                  other services and enrollment and if you will be charged copays for care and medication?"
              checked={this.props.data.provideFinancialInfo}
              onValueChange={(update) => {this.props.onStateChange('provideFinancialInfo', update);}}/>

          <ErrorableCheckbox
              label="I understand VA is not enrolling new applicants who decline to provide their financial information
                  unless they have other qualifying criteria as outlined above."
              checked={this.props.data.understandsFinancialDisclosure}
              onValueChange={(update) => {this.props.onStateChange('understandsFinancialDisclosure', update);}}/>
        </div>

        <div className="input-section">
          <a target="_blank" href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp">Click here</a> to view more information about the income thresholds and copayments.
        </div>

      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.isSectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.isSectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onUIStateChange(update);}}/>
      );
    }

    return (
      <div>
        <h4>Financial Disclosure</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.financialDisclosure,
    receivesVaPension: state.veteran.vaInformation.receivesVaPension,
    isSectionComplete: state.uiState.completedSections['/financial-assessment/financial-disclosure']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['financialDisclosure', field], update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/financial-assessment/financial-disclosure'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(FinancialDisclosureSection);
export { FinancialDisclosureSection };
