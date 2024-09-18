import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import localStorage from 'platform/utilities/storage/localStorage';
import {
  determineBoardObj,
  determineVenueAddress,
  determineBranchOfService,
} from '../../helpers';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';

const RequestDD214v2 = ({ router }) => {
  useEffect(() => {
    // Results should have been viewed first.
    if (!localStorage.getItem('dw-viewed-results')) {
      router.push('/');
    }
  });

  useEffect(() => {
    localStorage.removeItem('dw-viewed-results');
    localStorage.removeItem('dw-formResponses');
  });

  const formResponses = JSON.parse(localStorage.getItem('dw-formResponses'));
  const { name, abbr } = determineBoardObj(formResponses, true);
  const branchOfService = determineBranchOfService(
    formResponses[SHORT_NAME_MAP.SERVICE_BRANCH],
  );
  return (
    <div>
      <h1>
        Your Steps for Getting a DD214 for Your Period of Honorable Service
      </h1>
      <div className="">
        <div className="va-introtext">
          <p>
            To receive a second DD214 reflecting <strong>only</strong> your
            period of honorable service, you’ll need to complete Department of
            Defense (DoD) Form 149 and send it to the {name}—
            <strong>do not</strong> send it to the Discharge Review Board (DRB)
            for the {branchOfService}.
          </p>
        </div>
        <va-process-list>
          <va-process-list-item>
            <h2 className="usa-process-list__heading">
              Download and fill out{' '}
              <va-link
                href="https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0149.pdf"
                text="DoD Form 149"
              />
            </h2>
            <ul>
              <li>
                Pay special attention to item 6, which asks for the reason for
                your change. Be clear that you want a DD214 for your period of
                honorable service, and include the dates of that period.
              </li>
              <li>
                Item 8 asks for your date of “discovery” of the injustice. In
                this case, it’s the day you “discovered” you were missing an
                extra DD214 that you deserved. If this date isn’t in the last 3
                years, you’ll need to argue that the Board should hear your case
                anyway. This isn’t a strict date, so don’t let the 3-year rule
                keep you from applying if you have a strong case. You may note
                your recent discovery of new evidence about your situation, such
                as the ability to apply for a discharge upgrade.
              </li>
              <li>
                Item 10 asks if you’re willing to appear in person before the
                Board in Washington, DC. The Board rarely asks Veterans to
                appear in person, but saying you’re willing to do so may help
                show how serious you are about your case.
              </li>
            </ul>
          </va-process-list-item>
          <va-process-list-item header="Mail your completed form" level="2">
            <p>
              There are a number of different boards that handle discharge
              upgrades and corrections. Because you want a new DD214, which is
              seen as a correction of your military record, you’ll need to apply
              to the {abbr} for the {branchOfService}.
            </p>
            <p>At this time, there isn’t a way to submit this form online.</p>
            <p>
              Mail your completed form and all supporting documents to the{' '}
              {abbr} at:
            </p>
            <p>{determineVenueAddress(formResponses, true)}</p>
          </va-process-list-item>
        </va-process-list>
      </div>
    </div>
  );
};

RequestDD214v2.propTypes = {
  router: PropTypes.object.isRequired,
};

export default RequestDD214v2;
