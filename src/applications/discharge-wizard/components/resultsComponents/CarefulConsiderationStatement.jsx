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
            Because you answered that your discharge was related to
            posttraumatic stress disorder (PTSD) or other mental health
            conditions, the DOD will apply “liberal consideration” to your case.
            In 2014, the DOD recognized that many Veterans had received
            discharges due to behavior connected to their previously undiagnosed
            or undocumented PTSD or mental health condition.
          </p>
        );
      case RESPONSES.REASON_TBI:
        return (
          <p>
            Because you answered that your discharge was related to a traumatic
            brain injury (TBI), the DOD will apply “liberal consideration” to
            your case. In 2014, the DOD recognized that many Veterans had
            received discharges due to behavior connected to their previously
            undiagnosed or undocumented TBI.
          </p>
        );
      case RESPONSES.REASON_SEXUAL_ORIENTATION:
        if (dischargeType === RESPONSES.DISCHARGE_DISHONORABLE) {
          return (
            <p>
              Because you answered that your discharge was due to your sexual
              orientation, the DOD encourages you to apply for an upgrade. In
              2011, the DOD recognized that many Veterans received discharges
              only because of their sexual orientation. <br />{' '}
              <strong>Note:</strong> You must prove that your discharge was
              solely due to your sexual orientation and events specifically
              related to it. If the events leading to your discharge were
              unrelated, you may still receive an upgrade, but you’ll have to
              argue that your discharge was unjust punishment for those events.
            </p>
          );
        }
        if (dischargeType === RESPONSES.DISCHARGE_HONORABLE) {
          return (
            <p>
              Many Veterans have received general or honorable discharges due to
              their sexual orientation, and simply want references to sexual
              orientation removed from their DD214s, or want the ability to
              re-enlist. This is a relatively straightforward application.
            </p>
          );
        }
        return null;
      case RESPONSES.REASON_SEXUAL_ASSAULT:
        return (
          <p>
            Because you answered that your discharge was related to sexual
            assault or harassment, the DOD will apply “liberal consideration” to
            your case. In 2017, the DOD recognized that many Veterans had
            received discharges due to sexual assault or harassment, and had
            unfairly received less than honorable discharges.{' '}
            <strong>Note:</strong> You must prove that your discharge was solely
            the result of sexual assault or harassment and events specifically
            related to it. If the events leading to your discharge were
            unrelated, you may still receive an upgrade, but you’ll have to
            argue that your discharge was unjust punishment for those events.
          </p>
        );
      case RESPONSES.REASON_TRANSGENDER:
        return (
          <p>
            This is a common request for transgender Veterans whose DD214 name
            does not match the name they currently use.
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
