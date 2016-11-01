import React from 'react';
import { connect } from 'react-redux';

/**
 * Component for navigation, with links to each section of the form.
 * Parent links redirect to first section link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 * `completedSections` - boolean. Section has been validated and completed.
 */
class Nav extends React.Component {

  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const sections = this.props.data.sections;
    const currentUrl = this.props.currentUrl;

    function determinePanelStyles(currentPath, completePath) {
      let classes = '';
      if (currentUrl.startsWith(currentPath)) {
        classes += ' section-current';
      }
      if (sections[completePath].complete === true) {
        classes += ' section-complete';
      }
      return classes;
    }

    function determineSectionStyles(currentPath) {
      let classes = '';
      if (currentUrl === currentPath) {
        classes += ' sub-section-current';
      }
      return classes;
    }

    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ol className="process hca-process">
        <li role="presentation" className={`one ${subnavStyles}
         ${determinePanelStyles('/veteran-information', '/veteran-information/contact-information')}`}>
          <div>
            <h5>Veteran Information</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/veteran-information/personal-information')}`}>
                Personal Information
              </li>
              <li className={`${determineSectionStyles('/veteran-information/birth-information')}`}>
                Birth Information
              </li>
              <li className={`${determineSectionStyles('/veteran-information/demographic-information')}`}>
                Demographic Information
              </li>
              <li className={`${determineSectionStyles('/veteran-information/veteran-address')}`}>
                Address
              </li>
              <li className={`${determineSectionStyles('/veteran-information/contact-information')}`}>
                Contact Information
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`two ${subnavStyles}
         ${determinePanelStyles('/military-service', '/military-service/additional-information')}`}>
          <div>
            <h5>Military Service</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/military-service/service-information')}`}>
                Basic Information
              </li>
              <li className={`${determineSectionStyles('/military-service/additional-information')}`}>
                Service History
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`three ${subnavStyles}
         ${determinePanelStyles('/va-benefits', '/va-benefits/basic-information')}`}>
          <div>
            <h5>VA Benefits</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/va-benefits/basic-information')}`}>
                Basic Information
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`four ${subnavStyles}
         ${determinePanelStyles('/household-information', '/household-information/deductible-expenses')}`}>
          <div>
            <h5>Household Information</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/household-information/financial-disclosure')}`}>
                Financial Disclosure
              </li>
              <li className={`${determineSectionStyles('/household-information/spouse-information')}`}>
                Spouse
              </li>
              <li className={`${determineSectionStyles('/household-information/child-information')}`}>
                Children
              </li>
              <li className={`${determineSectionStyles('/household-information/annual-income')}`}>
                Annual Income
              </li>
              <li className={`${determineSectionStyles('/household-information/deductible-expenses')}`}>
                Deductible Expenses
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`five ${subnavStyles}
         ${determinePanelStyles('/insurance-information', '/insurance-information/va-facility')}`}>
          <div>
            <h5>Insurance Information</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/insurance-information/medicare')}`}>
                Medicare/Medicaid
              </li>
              <li className={`${determineSectionStyles('/insurance-information/general')}`}>
                General Insurance
              </li>
              <li className={`${determineSectionStyles('/insurance-information/va-facility')}`}>
                VA Medical Facility
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`six last ${subnavStyles}
         ${determinePanelStyles('/review-and-submit', '/review-and-submit')}`}>
          <div>
            <h5>Review</h5>
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
