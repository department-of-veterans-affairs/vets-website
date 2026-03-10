import React from 'react';
import PropTypes from 'prop-types';
import AlertMessage from './AlertMessage';
import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';

const CarefulConsiderationStatement = ({ formResponses, router }) => {
  const reasonStatement = () => {
    const reason = formResponses[SHORT_NAME_MAP.REASON];
    const dischargeType = formResponses[SHORT_NAME_MAP.DISCHARGE_TYPE];

    switch (reason) {
      case RESPONSES.REASON_PTSD:
        return (
          <p>
            You answered that your discharge is due to posttraumatic stress
            disorder (PTSD) or other mental health conditions. In 2014, the
            Defense Department (DOD) recognized that it discharged many Veterans
            due to behavior from undiagnosed or undocumented PTSD or mental
            health conditions. If you apply for a discharge upgrade, DOD will
            apply "liberal consideration" to your case. That means you’ll be
            able to explain any extenuating circumstances around your discharge.
          </p>
        );
      case RESPONSES.REASON_TBI:
        return (
          <p>
            You answered that your discharge is due to a traumatic brain injury
            (TBI). In 2014, the Defense Department (DOD) recognized that it
            discharged many Veterans due to behavior from their previously
            undiagnosed or undocumented TBI. If you apply for a discharge
            upgrade, DOD will apply "liberal consideration" to your case.
          </p>
        );
      case RESPONSES.REASON_SEXUAL_ORIENTATION:
        if (dischargeType === RESPONSES.DISCHARGE_DISHONORABLE) {
          return (
            <p>
              You answered that your discharge is due to your sexual
              orientation. In 2011, DOD recognized that it discharged many
              Veterans only because of their sexual orientation.
            </p>
          );
        }
        if (dischargeType === RESPONSES.DISCHARGE_HONORABLE) {
          return (
            <>
              <p>
                You answered that your discharge is due to your sexual
                orientation. In 2011, DOD recognized that many Veterans received
                discharges only because of their sexual orientation.
              </p>
              <p>
                <strong>Note:</strong> You’ll need to show that your discharge
                was solely due to your sexual orientation and related events. If
                the events weren’t related, you may still receive an upgrade.
                But you’ll have to prove your discharge was unjust punishment
                for those events.
              </p>
            </>
          );
        }
        return null;
      case RESPONSES.REASON_SEXUAL_ASSAULT:
        return (
          <>
            <p>
              You answered that your discharge is related to sexual assault or
              harassment. In 2017, the Defense Department (DOD) recognized that
              it discharged many Veterans due to sexual assault or harassment.
              And that many Veterans unfairly received discharges that weren’t
              honorable. If you apply for a discharge upgrade, DOD will apply
              "liberal consideration" to your case. That means you’ll be able to
              explain any extenuating circumstances around your discharge.
            </p>
            <p>
              <strong>Note:</strong> You’ll need to show that your discharge was
              solely the result of sexual assault or harassment and events
              specifically related to it. If the events leading to your
              discharge weren’t related to sexual assault or harassment, you may
              still receive an upgrade. But you’ll have to prove your discharge
              was unjust punishment for those events.
            </p>
          </>
        );
      case RESPONSES.REASON_TRANSGENDER:
        return (
          <p>
            This is a common request when your name on your DD214 doesn’t match
            the one you currently use.
          </p>
        );
      default:
        return null;
    }
  };

  const priorServiceStatement = () => {
    const onDD214LinkClick = () => {
      router.push(ROUTES.DD214);
    };

    switch (formResponses[SHORT_NAME_MAP.PRIOR_SERVICE]) {
      case RESPONSES.PRIOR_SERVICE_PAPERWORK_YES:
        return (
          <AlertMessage
            isVisible
            status="info"
            content={
              <>
                <h2 className="usa-alert-heading">
                  You can apply for VA benefits using your honorable
                  characterization.
                </h2>
                <p>
                  Because you served honorably in one period of service, you can
                  apply for VA benefits using that honorable characterization.
                  You earned your benefits during the period in which you served
                  honorably. The only exception is for service-connected
                  disability compensation. If your disability began during your
                  less than honorable period of service, you won’t be eligible
                  to earn disability compensation unless you get that discharge
                  upgraded. The instructions below this box tell you how to
                  apply for an upgrade or correction to your final, less than
                  honorable period of service.
                </p>
              </>
            }
          />
        );
      case RESPONSES.PRIOR_SERVICE_PAPERWORK_NO:
        return (
          <AlertMessage
            isVisible
            status="info"
            content={
              <>
                <h2 className="usa-alert-heading">
                  You can apply for VA benefits using your honorable
                  characterization.
                </h2>
                <div className="vads-u-font-size--base">
                  <p className="vads-u-margin-top--2">
                    Because you served honorably in one period of service, you
                    can apply for VA benefits using that honorable
                    characterization. You earned your benefits during the period
                    in which you served honorably. You don’t need a DD214 to
                    apply for VA benefits—you only need to specifically mention
                    this period of honorable service. (VA may do a Character of
                    Discharge review to confirm your eligibility.)
                  </p>
                  <p>
                    The only exception is for service-connected disability
                    compensation. If your disability began during your less than
                    honorable period of service, you won’t be eligible to earn
                    disability compensation unless you get that discharge
                    upgraded. The instructions below this box tell you how to
                    apply to an upgrade or correction for your final, less than
                    honorable period of service.
                  </p>
                  <p>
                    If you want a DD214 for your period of honorable service for
                    other reasons, unrelated to applying for VA benefits, you
                    can request one.{' '}
                    <va-link
                      href="#"
                      text="Find out how to request a DD214 for your period of
                      honorable service"
                      onClick={onDD214LinkClick}
                    />
                  </p>
                </div>
              </>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {reasonStatement()}
      <div className="vads-u-padding-bottom--2">{priorServiceStatement()}</div>
    </>
  );
};

CarefulConsiderationStatement.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default CarefulConsiderationStatement;
