// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Relative Imports
import { board } from '../../helpers';

const AdditionalInstructions = ({
  formValues,
  handleFAQToggle,
  parentState,
}) => {
  const serviceBranch = formValues['1_branchOfService'];

  return (
    <section>
      <div className="usa-accordion accordion-container">
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className="usa-unstyled-list" role="list">
          <li itemScope itemType="http://schema.org/Question">
            <button
              className="usa-button-unstyled usa-accordion-button"
              aria-controls="dbq1"
              itemProp="name"
              name="q1"
              aria-expanded={!!parentState?.q1}
              onClick={handleFAQToggle}
            >
              What happens after I send in my application?
            </button>
            <div
              id="dbq1"
              className="usa-accordion-content"
              itemProp="acceptedAnswer"
              itemScope
              itemType="http://schema.org/Answer"
              aria-hidden={!parentState?.q1}
            >
              <div itemProp="text">
                <p>
                  The Board reviews nearly all applications within 18 months.
                  You can continue to submit supporting documentation until the
                  Board has reviewed your application.
                </p>
                <p>
                  If your application is successful, the Board will direct your
                  service personnel office to issue you either a DD215, which
                  contains updates to the DD214, or an entirely new DD214. If
                  you get a new DD214,{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.dpris.dod.mil/veteranaccess.html"
                  >
                    request a copy
                  </a>
                  .
                </p>
                <p>
                  If your appeal results in raising your discharge to honorable,
                  you’ll immediately be considered an eligible Veteran to VA,
                  and you can apply for VA benefits and services. For now, you
                  may still apply for VA eligibility by{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf"
                  >
                    requesting a Character of Discharge review
                  </a>
                  .
                </p>
              </div>
            </div>
          </li>
          <li itemScope itemType="http://schema.org/Question">
            <button
              className="usa-button-unstyled usa-accordion-button"
              aria-controls="dbq2"
              itemProp="name"
              name="q2"
              aria-expanded={!!parentState?.q2}
              onClick={handleFAQToggle}
            >
              Can I get VA benefits without a discharge upgrade?
            </button>
            <div
              id="dbq2"
              className="usa-accordion-content"
              itemProp="acceptedAnswer"
              itemScope
              itemType="http://schema.org/Answer"
              aria-hidden={!parentState?.q2}
            >
              <div itemProp="text">
                <p>
                  Even with a less than honorable discharge, you may be able to
                  access some VA benefits through the Character of Discharge
                  review process. When you apply for VA benefits, we’ll review
                  your record to determine if your service was “honorable for VA
                  purposes.” This review can take up to a year. Please provide
                  us with documents supporting your case, similar to the
                  evidence you’d send with an application to upgrade your
                  discharge.
                </p>
                <p>
                  You may want to consider finding someone to advocate on your
                  behalf, depending on the complexity of your case. A lawyer or
                  Veterans Service Organization (VSO) can collect and submit
                  supporting documents for you.{' '}
                  <a href="https://www.benefits.va.gov/vso/varo.asp">
                    Find a VSO near you.
                  </a>
                </p>
                <p>
                  <strong>Note:</strong> You can ask for a VA Character of
                  Discharge review while at the same time applying for a
                  discharge upgrade from the Department of Defense (DoD) or the
                  Coast Guard.
                </p>
                <p>
                  If you experienced sexual assault or harassment while in the
                  military, or need mental health services related to PTSD or
                  other mental health conditions linked to your service, you may
                  qualify immediately for VA health benefits, even without a VA
                  Character of Discharge review or a discharge upgrade.
                </p>
                <p>Learn more about:</p>
                <ul>
                  <li>
                    <a href="/health-care/health-needs-conditions/military-sexual-trauma/">
                      VA health benefits for Veterans who have experienced
                      military sexual trauma
                    </a>
                  </li>
                  <li>
                    <a href="/health-care/health-needs-conditions/mental-health/">
                      VA health benefits for Veterans with mental health
                      conditions
                    </a>
                  </li>
                  <li>
                    <a href="/health-care/health-needs-conditions/mental-health/ptsd/">
                      VA health benefits for Veterans with PTSD
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <h4>Additional Resources</h4>
      <hr />
      <ul className="additional-resources">
        <li>
          <a
            target="_blank"
            href="/health-care/health-needs-conditions/military-sexual-trauma/"
          >
            VA health benefits for Veterans who experience military sexual
            trauma
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="/health-care/health-needs-conditions/mental-health/"
          >
            VA health benefits for Veterans with mental health conditions
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="/health-care/health-needs-conditions/mental-health/ptsd/"
          >
            VA health benefits for Veterans with PTSD
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.benefits.va.gov/BENEFITS/docs/COD_Factsheet.pdf"
          >
            VA Guidance on Character of Discharge Reviews
          </a>
        </li>
        {serviceBranch === 'army' && (
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://arba.army.pentagon.mil"
            >
              Army Review Boards Agency
            </a>
          </li>
        )}
        {serviceBranch === 'army' &&
          board(formValues).abbr === 'DRB' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://arba.army.pentagon.mil/adrb-overview.html"
              >
                Army Discharge Review Board
              </a>
            </li>
          )}
        {serviceBranch === 'army' &&
          board(formValues).abbr === 'BCMR' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://arba.army.pentagon.mil/abcmr-overview.html"
              >
                Army Board for Correction of Military Records
              </a>
            </li>
          )}
        {['navy', 'marines'].includes(serviceBranch) && (
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.secnav.navy.mil/mra/CORB/pages/ndrb/default.aspx"
            >
              Naval Discharge Review Board
            </a>
          </li>
        )}
        {serviceBranch === 'airForce' &&
          board(formValues).abbr === 'BCMR' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.afpc.af.mil/Board-for-Correction-of-Military-Records/"
              >
                Air Force Board for Correction of Military Records
              </a>
            </li>
          )}
        {serviceBranch === 'coastGuard' &&
          board(formValues).abbr === 'BCMR' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.uscg.mil/Resources/legal/BCMR/"
              >
                Coast Guard Board for Correction of Military Records
              </a>
            </li>
          )}
        {serviceBranch === 'coastGuard' &&
          board(formValues).abbr === 'DRB' && (
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.uscg.mil/Resources/Legal/DRB.aspx/"
              >
                Coast Guard Discharge Review Board
              </a>
            </li>
          )}
      </ul>
      <p>
        <strong>Please note:</strong> This information was created based on how
        you answered the questions on the previous page. This information will
        not be specific to someone with different answers to the questions.
      </p>
    </section>
  );
};

AdditionalInstructions.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default AdditionalInstructions;
