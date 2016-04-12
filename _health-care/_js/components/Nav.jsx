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
    const completedSections = this.props.data.completedSections;
    const currentUrl = this.props.currentUrl;

    function determinePanelStyles(currentPath, completePath) {
      let classes = '';
      if (currentUrl.startsWith(currentPath)) {
        classes += ' section-current';
      }
      if (completedSections[completePath] === true) {
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
        <li className={`one ${subnavStyles}
         ${determinePanelStyles('/introduction', '/introduction')}`}>
          <div>
            <h5>Introduction</h5>
          </div>
        </li>
        <li role="presentation" className={`two ${subnavStyles}
         ${determinePanelStyles('/personal-information', '/personal-information/veteran-address')}`}>
          <div>
            <h5>Personal Information</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/personal-information/name-and-general-information')}`}>
                Name and General
              </li>
              <li className={`${determineSectionStyles('/personal-information/va-information')}`}>
                VA-Specific
              </li>
              <li className={`${determineSectionStyles('/personal-information/additional-information')}`}>
                Additional
              </li>
              <li className={`${determineSectionStyles('/personal-information/demographic-information')}`}>
                Demographic
              </li>
              <li className={`${determineSectionStyles('/personal-information/veteran-address')}`}>
                Veteran Address
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`three ${subnavStyles}
         ${determinePanelStyles('/insurance-information', '/insurance-information/medicare-medicaid')}`}>
          <div>
            <h5>Insurance Information</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/insurance-information/general')}`}>
                General Insurance
              </li>
              <li className={`${determineSectionStyles('/insurance-information/medicare-medicaid')}`}>
                Medicare/Medicaid
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`four ${subnavStyles}
         ${determinePanelStyles('/military-service', '/military-service/additional-information')}`}>
          <div>
            <h5>Military Service</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/military-service/service-information')}`}>
                Service
              </li>
              <li className={`${determineSectionStyles('/military-service/additional-information')}`}>
                Additional Military
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`five ${subnavStyles}
         ${determinePanelStyles('/financial-assessment', '/financial-assessment/deductible-expenses')}`}>
          <div>
            <h5>Financial Assessment</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/financial-assessment/financial-disclosure')}`}>
                Financial Disclosure
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/spouse-information')}`}>
                Spouse
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/child-information')}`}>
                Child
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/annual-income')}`}>
                Annual Income
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/deductible-expenses')}`}>
                Deductible Expenses
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`six last ${subnavStyles}
         ${determinePanelStyles('/review-and-submit', '/review-and-submit')}`}>
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
