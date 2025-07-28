import React from 'react';
import { Link } from 'react-router-dom';
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
          title="Marital Information Pattern Library"
          subTitle="Pattern standards and examples for the Marital Information pattern"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start application"
        >
          Please complete the Marital Information Patterns form to apply for
          Marital Information Pattern.
        </SaveInProgressIntro>
        <div className="vads-u-margin-bottom--3">
          <h2 className="vads-u-font-size--h3">Pages</h2>
          <ul>
            <li>
              <Link to={`${formConfig.urlPrefix}current-marital-status`}>
                Current marital status (standard)
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}current-marital-status-simple`}>
                Current marital status (simple)
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}spouse-personal-information`}>
                Spouse's personal information
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}spouse-identity`}>
                Spouse's identification information
              </Link>
            </li>
            <li>
              <Link
                to={`${formConfig.urlPrefix}spouse-military-identification`}
              >
                Spouse's military identification information
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
            <li>
              <Link to={`${formConfig.urlPrefix}marriage-type`}>
                How did you get married?
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}marriage-documents`}>
                Marriage documents
              </Link>
            </li>
            <li>
              <Link
                to={`${formConfig.urlPrefix}current-spouse-marriage-history`}
              >
                Spouse Previous Marriages
              </Link>
            </li>
            <li>
              <Link to={`${formConfig.urlPrefix}veteran-marriage-history`}>
                Veteran Previous Marriages
              </Link>
            </li>
          </ul>
        </div>

        <div className="vads-u-margin-top--2">
          <h2 className="vads-u-font-size--h3">
            Spouse previous marriages pages
          </h2>
          <ul>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }current-spouse-marriage-history/0/former-spouse-information?add=true`}
              >
                Spouse Former Marriage Personal Info
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }current-spouse-marriage-history/0/former-marriage-date-location?add=true`}
              >
                Spouse Former Marriage Place and Date
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }current-spouse-marriage-history/0/reason-former-marriage-ended?add=true`}
              >
                Reason former marriage ended
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }current-spouse-marriage-history/0/former-marriage-end-date-location?add=true`}
              >
                Place and date the former marriage ended
              </Link>
            </li>
          </ul>
        </div>

        <div className="vads-u-margin-top--2">
          <h2 className="vads-u-font-size--h3">
            Veteran previous marriages pages
          </h2>
          <ul>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/former-spouse-information?add=true`}
              >
                Previous Spouse Personal Info
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/previous-spouse-identity?add=true`}
              >
                Previous spouse's identification information
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/previous-spouse-contact-information?add=true`}
              >
                Previous spouse's address and phone number
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/previous-marriage-date-location?add=true`}
              >
                Place and date of previous marriage
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/previous-marriage-type?add=true`}
              >
                Type of marriage-How did you get married?
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/reason-previous-marriage-ended?add=true`}
              >
                Reason previous marriage ended
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/former-marriage-end-date-location?add=true`}
              >
                Place and date the previous marriage ended
              </Link>
            </li>
          </ul>
        </div>

        <div className="vads-u-margin-top--2">
          <h2 className="vads-u-font-size--h3">Divorced flow specific pages</h2>
          <ul>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/former-marriage-end-date-location?add=true`}
              >
                Place and date of marriage termination
              </Link>
            </li>
            <li>
              <Link
                to={`${
                  formConfig.urlPrefix
                }veteran-marriage-history/0/divorce-documents?add=true`}
              >
                Divorce documents
              </Link>
            </li>
          </ul>
        </div>

        <div className="vads-u-margin-top--2 vads-u-margin-bottom--6">
          <h2 className="vads-u-font-size--h3">Widowed flow specific pages</h2>
          <ul>
            <li>
              <Link to={`${formConfig.urlPrefix}spouse-death-information`}>
                Place and date of spouse death
              </Link>
            </li>
          </ul>
        </div>
        {/* <va-omb-info
          res-burden="10"
          omb-number="MARITAL_INFORMATION_PATTERNS"
          exp-date="6/20/2025"
        /> */}
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
