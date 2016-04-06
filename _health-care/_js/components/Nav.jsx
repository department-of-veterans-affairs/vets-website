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
    const appData = this.props.data;
    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ol className="process hca-process">
        <li className={`one ${subnavStyles} ${this.props.currentUrl.startsWith('/introduction') ? ' section-current' : ''}`}>
          <div>
            <h5>Introduction</h5>
          </div>
        </li>
        <li role="presentation" className={`two
          ${subnavStyles} ${this.props.currentUrl.startsWith('/personal-information') ? ' section-current' : ''}
          ${(appData.veteranAddress.sectionComplete === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Personal Information</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/personal-information/name-and-general-information' ? ' sub-section-current' : ''}>
                Name and General
              </li>
              <li className={this.props.currentUrl === '/personal-information/va-information' ? ' sub-section-current' : ''}>
                VA-Specific
              </li>
              <li className={this.props.currentUrl === '/personal-information/additional-information' ? ' sub-section-current' : ''}>
                Additional
              </li>
              <li className={this.props.currentUrl === '/personal-information/demographic-information' ? ' sub-section-current' : ''}>
                Demographic
              </li>
              <li className={this.props.currentUrl === '/personal-information/veteran-address' ? ' sub-section-current' : ''}>
                Veteran Address
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`three
          ${subnavStyles} ${this.props.currentUrl.startsWith('/insurance-information') ? ' section-current' : ''}
          ${(appData.medicareMedicaid.sectionComplete === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Insurance Information</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/insurance-information/general' ? ' sub-section-current' : ''}>
                General Insurance
              </li>
              <li className={this.props.currentUrl === '/insurance-information/medicare-medicaid' ? ' sub-section-current' : ''}>
                Medicare/Medicaid
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`four
          ${subnavStyles} ${this.props.currentUrl.startsWith('/military-service') ? ' section-current' : ''}
          ${(appData.militaryAdditionalInfo.sectionComplete === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Military Service</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/military-service/service-information' ? ' sub-section-current' : ''}>
                Service
              </li>
              <li className={this.props.currentUrl === '/military-service/additional-information' ? ' sub-section-current' : ''}>
                Additional Military
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`five
          ${subnavStyles} ${this.props.currentUrl.startsWith('/financial-assessment') ? ' section-current' : ''}
          ${(appData.deductibleExpenses.sectionComplete === true) ? ' section-complete' : ''}`}>
          <div>
            <h5>Financial Assessment</h5>
            <ul className="usa-unstyled-list">
              <li className={this.props.currentUrl === '/financial-assessment/financial-disclosure' ? ' sub-section-current' : ''}>
                Financial Disclosure
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/spouse-information' ? ' sub-section-current' : ''}>
                Spouse
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/child-information' ? ' sub-section-current' : ''}>
                Child
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/annual-income' ? ' sub-section-current' : ''}>
                Annual Income
              </li>
              <li className={this.props.currentUrl === '/financial-assessment/deductible-expenses' ? ' sub-section-current' : ''}>
                Deductible Expenses
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`six last ${subnavStyles} ${this.props.currentUrl.startsWith('/review-and-submit') ? ' section-current' : ''}`}>
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
    data: state
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(Nav);
export { Nav };
