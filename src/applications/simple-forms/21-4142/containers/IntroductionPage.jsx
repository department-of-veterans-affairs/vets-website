import React from 'react';

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
          title="Authorize the release of non-VA medical information to VA"
          subTitle="Authorization to disclose information to the Department of Veterans Affairs (VA Forms 21-4142 and 21-4142a)"
        />
        <p>
          Complete this form if you want to give us permission to request your
          medical records and information from non-VA sources to support your
          benefit claim. You can use this form to authorize the release of
          information on behalf of a Veteran you support.
        </p>
        <h2 className="vads-u-font-size--h3">
          Non-VA sources we may request your medical records and information
          from
        </h2>
        <ul className="vads-u-margin-bottom--4">
          <li>
            All sources of medical information (like hospitals, clinics, labs,
            physicians, and psychologists)
          </li>
          <li>Social workers and rehabilitation counselors</li>
          <li>Health care providers who conduct claim exams for us</li>
          <li>
            Employers, insurance companies, or workers’ compensation programs
          </li>
          <li>
            People who may know about your condition (like family, neighbors,
            friends, and public officials)
          </li>
        </ul>

        <h2 className="vads-u-font-size--h3">
          What to know before you fill out this form
        </h2>
        <ul className="vads-u-margin-bottom--4">
          <li>
            If you already provided your private, non-VA medical records to us,
            or if you intended to get them yourself, you don't need to submit
            this form. Submitting the form in this case will add time to your
            claim process.
          </li>
          <li>
            You don't need to submit this form to request VA medical records.
          </li>
          <li>
            By law, we can't pay any fees that a source may charge to release
            your medical records. If a source charges a fee, we'll contact you
            to tell you how to get the records.
          </li>
        </ul>

        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the medical records authorization"
          displayNonVeteranMessaging
        >
          Please complete the 21-4142 form to authorize the release of non-VA
          medical records to VA.
        </SaveInProgressIntro>

        <p />
        <va-omb-info
          res-burden="10"
          omb-number="2900-0858"
          exp-date="07/31/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
