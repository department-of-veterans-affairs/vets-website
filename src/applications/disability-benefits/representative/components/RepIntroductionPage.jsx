import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';

/**
 * RepIntroductionPage - Introduction page for the representative-facing 526EZ form
 *
 * This introduction page is specifically for accredited representatives filing
 * disability compensation claims on behalf of veterans.
 *
 * Note: Save-in-progress is disabled for this PoC, so we use a simple start link
 * instead of FormStartControls which requires save-in-progress infrastructure.
 */
const RepIntroductionPage = ({ route, router }) => {
  const { pageList } = route;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  // Create the start button using router.push (same pattern as caregivers app)
  const startBtn = useMemo(
    () => {
      const startForm = e => {
        e.preventDefault();
        recordEvent({ event: 'disability-526EZ-representative-start' });
        // Navigate to the second page in pageList (first is introduction)
        const firstFormPath = pageList?.[1]?.path || 'veteran-identification';
        if (router?.push) {
          return router.push(firstFormPath);
        }
        // Fallback - this should not happen
        // eslint-disable-next-line no-console
        console.error('Router not available for navigation');
        return null;
      };
      return (
        <a
          href="#start"
          className="vads-c-action-link--green"
          onClick={startForm}
          data-testid="start-form-link"
        >
          Start the disability claim application
        </a>
      );
    },
    [pageList, router],
  );

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="File a disability compensation claim for a veteran"
        subTitle="VA Form 21-526EZ (Representative)"
      />

      <p>
        As an accredited representative, you can use this form to file a
        disability compensation claim on behalf of a veteran you represent.
      </p>

      <h2 className="vads-u-font-size--h3">
        Follow the steps below to file a claim
      </h2>

      <va-process-list>
        <va-process-list-item header="Gather the veteran's information">
          <p>You’ll need the veteran’s:</p>
          <ul>
            <li>Full legal name</li>
            <li>Social Security number</li>
            <li>Date of birth</li>
            <li>Contact information</li>
          </ul>
        </va-process-list-item>
        <va-process-list-item header="Identify conditions to claim">
          <p>
            List the conditions the veteran wants to claim for disability
            compensation.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather supporting evidence">
          <p>
            Identify any VA medical records, private medical records, or other
            supporting documents.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Submit the claim">
          <p>
            Review the information and submit the claim on behalf of the
            veteran.
          </p>
        </va-process-list-item>
      </va-process-list>

      <p className="vads-u-margin-top--3">{startBtn}</p>

      <div className="vads-u-margin-top--4">
        <va-omb-info
          res-burden={25}
          omb-number="2900-0747"
          exp-date="03/31/2027"
        />
      </div>
    </article>
  );
};

RepIntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
    pageList: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default RepIntroductionPage;
