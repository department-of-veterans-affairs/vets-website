import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

import OmbInfo from '../components/OmbInfo';

const IntroductionPage = ({ router }) => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  const startForm = event => {
    event.preventDefault();
    router.push('/applicant/information');
  };

  return (
    <article className="schemaform-intro vads-u-padding-bottom--3 mobile-lg:vads-u-padding-bottom--6">
      <FormTitle title="Apply for the IBM SkillsBuild program" />
      <div className="schemaform-title vads-u-display--inline">
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--4 schemaform-subtitle">
          IBM SkillsBuild Training Program Intake Application (VA Form 22-10282)
        </p>
      </div>
      <p>
        The IBM SkillsBuild program is a free online training program that helps
        you develop skills to start or advance your career in technology.
      </p>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        What to know before you fill out this form
      </h2>
      <ul>
        <li>
          You may be eligible for this program if you’re a Veteran; service
          member; or the spouse, child, or caregiver of a Veteran.
        </li>
        <li>
          After you submit your form, you can print the confirmation page for
          your records.
        </li>
        <li>
          After we review your form, we’ll email you a decision. If we need more
          information from you before we make a decision, we’ll email you.
        </li>
      </ul>

      <div className="vads-u-margin-y--2 mobile-lg:vads-u-margin-y--3">
        <va-link-action
          href="#"
          onClick={startForm}
          text="Start your application"
        />
      </div>

      <OmbInfo />
    </article>
  );
};

IntroductionPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default IntroductionPage;
