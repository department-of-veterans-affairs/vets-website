import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Marital Status Pattern Library"
          subTitle="Pattern standards and examples for the Marital Status pattern"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start application"
        >
          Please complete the Marital Status Patterns form to apply for Marital
          Status Pattern.
        </SaveInProgressIntro>
        <div className="vads-u-margin-bottom--3">
          <h2 className="vads-u-font-size--h3">Pages</h2>
          <ul>
            <li>
              <Link to={`${formConfig.urlPrefix}current-marital-status`}>
                Current marital status
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}spouse-personal-information`}>
                Spouse's personal information
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}spouse-military-history`}>
                Spouse's military history
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}living-situation`}>
                Living Situation
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}additional-living-situation`}>
                Additional Living Situation Information
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}spouse-contact-information`}>
                Spouse's address and phone number
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}marriage-date-location`}>
                Place and date of marriage
              </Link>
            </li>
          </ul>
        </div>
        <va-omb-info
          res-burden="10"
          omb-number="MARITAL_STATUS_PATTERNS"
          exp-date="6/20/2025"
        />
      </article>
    );
  }
}

IntroductionPage.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      downtime: PropTypes.shape({}),
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      rootUrl: PropTypes.string,
      savedFormMessages: PropTypes.shape({}),
      subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      urlPrefix: PropTypes.string,
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
