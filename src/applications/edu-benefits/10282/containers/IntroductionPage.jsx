import React, { useEffect } from 'react';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import DownloadLink from './DownloadLink';

const IntroductionPage = () => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }, []);

  return (
    <article className="schemaform-intro vads-u-padding-bottom--3 mobile-lg:vads-u-padding-bottom--6">
      <FormTitle title="About VA Form 22-10282" />
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
        Apply for an IBM-sponsored training program sponsored by the VA
      </p>
      <p>
        <strong>Related to: </strong>
        Education and training
      </p>
      <p>
        <strong>Form last updated: </strong>
        March 2024
      </p>
      <h2 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        When to use this form
      </h2>
      <p>
        Use VA Form 22-10282 to apply for an IBM-sponsored training program if
        one of these is true for you:
      </p>

      <ul className="intro-ul">
        <li>
          You’re a Veteran, service member, spouse, child, or caregiver of a
          Veteran seeking educational opportunities at no cost.
        </li>
        <li>
          You have an interest in gaining IT skills that meet the needs of
          employers in the high-technology industry.
        </li>
        <li>Note: registration is on a first-come, first-served basis.</li>
      </ul>
      <h3 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        Downloadable PDF
      </h3>
      <p className="vads-u-margin-bottom--0">
        <DownloadLink subTaskEvent />
      </p>

      <h3 className="vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4">
        Online tool
      </h3>
      <p>
        You can submit your request online instead of filling out and sending us
        the paper form.
      </p>
      <div className="vads-u-margin-y--2 mobile-lg:vads-u-margin-y--3">
        <va-link-action
          href="/education/apply-for-education-benefits/10282/applicant/information"
          text="Go to the online tool"
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

export default IntroductionPage;
