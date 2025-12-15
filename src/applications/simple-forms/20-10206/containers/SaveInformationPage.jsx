import React from 'react';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import GetFormHelp from '../components/GetFormHelp';

const SaveInformationPage = props => {
  const { goBack, goForward, NavButtons = FormNavButtons } = props;

  return (
    <>
      <div className="row">
        <div className="usa-width-two-thirds columns print-full-width vads-u-padding-left--2">
          <div className="progress-box progress-box-schemaform">
            <div className="form-panel preparer-type-page">
              <h1>
                We’ll save your information automatically after every change you
                make
              </h1>
              <p>
                If you want to take a break from filling out this form, select
                the Finish later button anytime to stop.
              </p>
              <p>
                When you’re ready to resume the form, reopen it from My VA or
                visit the form introduction page.
              </p>

              <div>
                <va-link
                  href={`${environment.BASE_URL}/my-va/?loggedIn=true`}
                  text="My VA"
                  external="true"
                />
              </div>
              <div className="vads-u-margin-top--1">
                <va-link
                  href={`${
                    environment.BASE_URL
                  }/records/request-personal-records-form-20-10206`}
                  text="VA Form 20-10206 Introduction"
                  external="true"
                />
              </div>
              <NavButtons goBack={goBack} goForward={goForward} />
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
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  NavButtons: PropTypes.elementType,
};

export default SaveInformationPage;
