import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import {
  PAGE_NAMES,
  recordBenefitOfficeClickEvent,
} from '../../../shared/utils/start-page';
import DownloadLink from '../../content/DownloadLink';
import { PageTitle } from '../../content/title';
import { BENEFIT_OFFICES_URL } from '../../constants';

const DecisionReviewPage = () => {
  useEffect(() => {
    setTimeout(() => {
      focusElement('#main h2');
    });
  }, []);

  const handlers = {
    officeLinkClick: () => {
      recordBenefitOfficeClickEvent();
    },
  };

  return (
    <div id={PAGE_NAMES.other} className="vads-u-padding-bottom--2">
      <PageTitle />
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        Requesting a Higher-Level Review if it isn’t for a disability
        compensation
      </h2>
      <p>
        We can accept online Higher-Level Reviews only for disability claims at
        this time. For other types of claims, you’ll need to fill out and submit
        VA Form 20-0996 by mail or in person.
      </p>
      <p>
        Send the completed form to the benefit office that matches the benefit
        type you select on the form.
      </p>
      <va-link
        disable-analytics
        href={BENEFIT_OFFICES_URL}
        onClick={handlers.officeLinkClick}
        text="Find the address for mailing your form"
      />{' '}
      <p className="vads-u-margin-bottom--0">
        <DownloadLink subTaskEvent />
      </p>
      <p>
        If you don’t think this is the right form for you, find out about other
        decision review options.
      </p>
      <va-link
        disable-analytics
        href="/resources/choosing-a-decision-review-option/"
        text="Learn about choosing a decision review option"
      />
    </div>
  );
};

export default {
  name: PAGE_NAMES.other,
  component: DecisionReviewPage,
  next: null,
  back: PAGE_NAMES.start,
};
