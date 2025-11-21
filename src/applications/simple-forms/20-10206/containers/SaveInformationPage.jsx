import React from 'react';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import GetFormHelp from '../components/GetFormHelp';

const SaveInformationPage = props => {
  const { formData, router, route, location } = props;

  const handleGoBack = () => {
    router.push('/introduction');
  };

  const handleGoForward = () => {
    const { pathname } = location;
    const { pageList } = route;
    const nextPagePath = getNextPagePath(pageList, formData, pathname);
    router.push(nextPagePath);
  };

  return (
    <>
      <div className="row">
        <div className="usa-width-two-thirds columns print-full-width vads-u-padding-left--2">
          <div className="progress-box progress-box-schemaform">
            <div className="form-panel preparer-type-page">
              <h1>
                Your information will be saved automatically after every change
                you make.
              </h1>
              <p>
                If you want to take a break from filling out this form, you can
                stop anytime using the "Finish later" button.
              </p>
              <p>
                When you’re ready to resume the form, reopen it from My VA or
                visit the form introduction page.
              </p>

              <div>
                <va-link
                  href={`${environment.BASE_URL}/my-va`}
                  text="Find out how to change your address in your VA.gov profile"
                />
              </div>
              <div className="vads-u-margin-top--1">
                <va-link
                  href={`${
                    environment.BASE_URL
                  }/records/request-personal-records-form-20-10206`}
                  text="VA Form 20-10206 Introduction (opens in a new window)"
                />
              </div>
              <FormNavButtons
                goBack={handleGoBack}
                goForward={handleGoForward}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row vads-u-padding-left--2">
        <h2 className="vads-u-margin-bottom--0 vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
          Need help?
        </h2>
        <GetFormHelp />
      </div>
    </>
  );
};

SaveInformationPage.propTypes = {
  formData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.shape({
    pageList: PropTypes.array,
  }),
  router: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(SaveInformationPage);
