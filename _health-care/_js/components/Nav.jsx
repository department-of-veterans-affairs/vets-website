import React from 'react';
import { connect } from 'react-redux';

/**
 * Component for navigation, with links to each section of the form.
 * Parent links redirect to first section link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 */
class Nav extends React.Component {
  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const completedSections = this.props.data.completedSections;
    const currentUrl = this.props.currentUrl;
    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ol className="process hca-process">
        <li className={`one ${subnavStyles} ${currentUrl.startsWith('/introduction') ? ' section-current' : ''}
          ${(completedSections.introduction === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Introduction</h5>
          </div>
        </li>
        <li role="presentation" className={`two
          ${subnavStyles} ${currentUrl.startsWith('/personal-information') ? ' section-current' : ''}
          ${(completedSections.veteranAddress === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Personal Information</h5>
            <ul className="usa-unstyled-list">
              <li className={currentUrl === '/personal-information/name-and-general-information' ? ' sub-section-current' : ''}>
                Name and General
              </li>
              <li className={currentUrl === '/personal-information/va-information' ? ' sub-section-current' : ''}>
                VA-Specific
              </li>
              <li className={currentUrl === '/personal-information/additional-information' ? ' sub-section-current' : ''}>
                Additional
              </li>
              <li className={currentUrl === '/personal-information/demographic-information' ? ' sub-section-current' : ''}>
                Demographic
              </li>
              <li className={currentUrl === '/personal-information/veteran-address' ? ' sub-section-current' : ''}>
                Veteran Address
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`three
          ${subnavStyles} ${currentUrl.startsWith('/insurance-information') ? ' section-current' : ''}
          ${(completedSections.medicareMedicaid === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Insurance Information</h5>
            <ul className="usa-unstyled-list">
              <li className={currentUrl === '/insurance-information/general' ? ' sub-section-current' : ''}>
                General Insurance
              </li>
              <li className={currentUrl === '/insurance-information/medicare-medicaid' ? ' sub-section-current' : ''}>
                Medicare/Medicaid
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`four
          ${subnavStyles} ${currentUrl.startsWith('/military-service') ? ' section-current' : ''}
          ${(completedSections.militaryAdditionalInfo === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Military Service</h5>
            <ul className="usa-unstyled-list">
              <li className={currentUrl === '/military-service/service-information' ? ' sub-section-current' : ''}>
                Service
              </li>
              <li className={currentUrl === '/military-service/additional-information' ? ' sub-section-current' : ''}>
                Additional Military
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`five
          ${subnavStyles} ${currentUrl.startsWith('/financial-assessment') ? ' section-current' : ''}
          ${(completedSections.deductibleExpenses === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Financial Assessment</h5>
            <ul className="usa-unstyled-list">
              <li className={currentUrl === '/financial-assessment/financial-disclosure' ? ' sub-section-current' : ''}>
                Financial Disclosure
              </li>
              <li className={currentUrl === '/financial-assessment/spouse-information' ? ' sub-section-current' : ''}>
                Spouse
              </li>
              <li className={currentUrl === '/financial-assessment/child-information' ? ' sub-section-current' : ''}>
                Child
              </li>
              <li className={currentUrl === '/financial-assessment/annual-income' ? ' sub-section-current' : ''}>
                Annual Income
              </li>
              <li className={currentUrl === '/financial-assessment/deductible-expenses' ? ' sub-section-current' : ''}>
                Deductible Expenses
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`six last ${subnavStyles} ${currentUrl.startsWith('/review-and-submit') ? ' section-current' : ''}`}>
          <div>
            <h5>Review and Submit</h5>
          </div>
        </li>
      </ol>
    );
  }
}

Nav.propTypes = {
  currentUrl: React.PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    data: state.uiState
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(Nav);
export { Nav };
