import React, { useEffect } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { Element } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/ui/scroll';

import { VaBackToTop } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import Breadcrumbs from '../../components/Breadcrumbs';
import { STATUSES, STATUS_GROUPINGS } from '../../constants';

const ClaimStatusExplainerPage = () => {
  useEffect(() => {
    focusElement('h1');
    scrollTo('topScrollElement');
  });

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  if (!appEnabled) {
    window.location.replace('/');
    return null;
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <Breadcrumbs />
        <h1 tabIndex="-1" data-testid="status-explainer-header">
          What does my claim status mean?
        </h1>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--10 vads-u-padding-x--2p5 ">
            <p>
              VA uses many statuses to track claims from before you submit to
              after you receive payment. This page provides descriptions for
              what each status means. If you continue to have questions about
              your claim, please contact your local VA Medical Center (VAMC) and
              ask to speak with the Beneficiary Travel department.
            </p>
            <p>
              On the Dashboard and Claims pages, each claim has a status. These
              pages also include filters which allow you to filter by one of the
              following categories: Saved or Incomplete, Under VA Review, and
              Closed. The claim categories and statuses within Beneficiary
              Travel Self Service System (BTSSS) are:
            </p>

            {STATUS_GROUPINGS.map(grouping => (
              <React.Fragment key={grouping.name}>
                <h2 className="vads-u-font-size--h3">{grouping.name}</h2>
                <p>{grouping.description}</p>
                <ul>
                  {STATUSES.map(
                    status =>
                      grouping.includes.includes(status.name) && (
                        <li key={status.name}>
                          <b>{status.name} — </b> {status.description}
                          {status.reasons && (
                            <ul>
                              {status.reasons.map((reason, index) => (
                                <li key={index}>{reason}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ),
                  )}
                </ul>
              </React.Fragment>
            ))}
          </div>
        </div>
        <VaBackToTop />
      </article>
    </Element>
  );
};

export default ClaimStatusExplainerPage;
