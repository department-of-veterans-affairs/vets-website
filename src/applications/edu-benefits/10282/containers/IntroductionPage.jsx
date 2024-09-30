import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

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
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
        IBM SkillsBuild Training Program Intake Application (VA Form 22-10282)
      </p>
      <p>
        The IBM SkillsBuild program is a free online training program that helps
        you develop skills to start or advance your career in technology.
      </p>

      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        What to know before you fill out this form
      </h2>
      <ul className="intro-ul">
        <li>
          You may be eligible for this program if you’re a Veteran, a service
          member, or a family member or caregiver of a Veteran.
        </li>
        <li>
          After you submit your form, you can print the confirmation page for
          your records. You can also download a copy of your completed form as a
          PDF.
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

      <div className="intro-omb-info">
        <va-omb-info
          res-burden={10}
          omb-number="2900-0922"
          exp-date="9/30/2026"
        />
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default IntroductionPage;
