import React from 'react';
import PropTypes from 'prop-types';
import { determineBoardObj } from '../../helpers';
import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';
import { BCMR, DRB } from '../../constants';
import VABenefitsAccordion from '../VABenefitsAccordion';

const AdditionalInstructions = ({ formResponses }) => {
  const serviceBranch = formResponses[SHORT_NAME_MAP.SERVICE_BRANCH];
  const { abbr } = determineBoardObj(formResponses);

  return (
    <section>
      <va-accordion>
        <va-accordion-item header="What happens after I send in my application?">
          <p>
            The Board reviews nearly all applications within 18 months. You can
            continue to submit supporting documentation until the Board has
            reviewed your application.
          </p>
          <p>
            If your application is successful, the Board will direct your
            service personnel office to issue you either a DD215, which contains
            updates to the DD214, or an entirely new DD214. If you get a new
            DD214,{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.archives.gov/veterans/military-service-records"
            >
              request a copy (opens in a new tab)
            </a>
            .
          </p>
          <p>
            If your appeal results in raising your discharge to honorable,
            you’ll immediately be considered an eligible Veteran to VA, and you
            can apply for VA benefits and services. For now, you may still apply
            for VA eligibility by{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf"
            >
              requesting a Character of Discharge review (opens in a new tab)
            </a>
            .
          </p>
        </va-accordion-item>
        <VABenefitsAccordion isResultsPage />
      </va-accordion>
      <h2>Additional Resources</h2>
      <hr />
      <ul className="additional-resources">
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/health-care/health-needs-conditions/military-sexual-trauma/"
          >
            VA health benefits for Veterans who experience military sexual
            trauma (opens in a new tab)
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/health-care/health-needs-conditions/mental-health/"
          >
            VA health benefits for Veterans with mental health conditions (opens
            in a new tab)
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/health-care/health-needs-conditions/mental-health/ptsd/"
          >
            VA health benefits for Veterans with PTSD (opens in a new tab)
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf"
          >
            VA Guidance on Character of Discharge Reviews (opens in a new tab)
          </a>
        </li>
        {serviceBranch === RESPONSES.ARMY && (
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://arba.army.pentagon.mil"
            >
              Army Review Boards Agency (opens in a new tab)
            </a>
          </li>
        )}
        {serviceBranch === RESPONSES.ARMY &&
          determineBoardObj(formResponses).abbr === DRB && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://arba.army.pentagon.mil/adrb-overview.html"
              >
                Army Discharge Review Board (opens in a new tab)
              </a>
            </li>
          )}
        {serviceBranch === RESPONSES.ARMY &&
          abbr === BCMR && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://arba.army.pentagon.mil/abcmr-overview.html"
              >
                Army Board for Correction of Military Records (opens in a new
                tab)
              </a>
            </li>
          )}
        {[RESPONSES.NAVY, RESPONSES.MARINE_CORPS].includes(serviceBranch) && (
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.secnav.navy.mil/mra/CORB/pages/ndrb/default.aspx"
            >
              Naval Discharge Review Board (opens in a new tab)
            </a>
          </li>
        )}
        {serviceBranch === RESPONSES.AIR_FORCE &&
          abbr === BCMR && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.afpc.af.mil/Board-for-Correction-of-Military-Records/"
              >
                Air Force Board for Correction of Military Records (opens in a
                new tab)
              </a>
            </li>
          )}
        {serviceBranch === RESPONSES.COAST_GUARD &&
          abbr === BCMR && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.uscg.mil/Resources/legal/BCMR/"
              >
                Coast Guard Board for Correction of Military Records (opens in a
                new tab)
              </a>
            </li>
          )}
        {serviceBranch === RESPONSES.COAST_GUARD &&
          abbr === DRB && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.uscg.mil/Resources/Legal/DRB.aspx/"
              >
                Coast Guard Discharge Review Board (opens in a new tab)
              </a>
            </li>
          )}
      </ul>
      <p>
        <strong>Note:</strong> This information was created based on how you
        answered the questions on the previous page. This information will not
        be specific to someone with different answers to the questions.
      </p>
    </section>
  );
};

AdditionalInstructions.propTypes = {
  formResponses: PropTypes.object.isRequired,
};

export default AdditionalInstructions;
