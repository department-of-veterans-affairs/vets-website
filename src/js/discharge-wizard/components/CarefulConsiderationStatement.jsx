import React from 'react';
import { Link } from 'react-router';

const reasonStatement = (props) => {
  const reason = props.formValues['4_reason'];
  const dischargeType = props.formValues['5_dischargeType'];

  switch (reason) {
    case '1':
      return (
        <p>
          Because you answered that your discharge was related to a TBI or PTSD or other mental health conditions, the DoD will apply "liberal consideration" to your case. In 2014, DoD recognized that many Veterans received discharges due to behavior connected to their previously undiagnosed or undocumented TBI, PTSD, or mental health conditions.
        </p>
      );
    case '2':
      return (
        <p>
          Because you answered that your discharge was related to a TBI, the DoD will apply "liberal consideration" to your case. In 2014, DoD recognized that many Veterans received discharges due to behavior connected to their previously undiagnosed or undocumented TBI.
        </p>
      );
    case '3':
      if (dischargeType === '2') {
        return (
          <p>
            Because you answered that your discharge was due to your sexual orientation, the DoD will carefully consider your case. In 2011, DoD recognized that many Veterans received discharges only because of their sexual orientation. Note: You must prove that your discharge was only due to your sexual orientation and events specifically related to it.
          </p>
        );
      } else if (dischargeType === '1') {
        return (
          <p>
            Many Veterans received General or Honorable discharges due to their sexual orientation, and simply want references to sexual orientation removed from their DD-214, or want the ability to re-enlist. This is a relatively straightforward application.
          </p>
        );
      }
      return null;
    case '4':
      return (
        <p>
          Because you answered that your discharge was related to sexual assault or harassment, the DoD will apply “liberal consideration” to your case. In 2017, the DoD recognized that many Veterans had received discharges due to sexual assault or harassment, and had unfairly received less than honorable discharges. <strong>Note:</strong> You must prove that your discharge was solely the result of sexual assault or harassment and events specifically related to it. If the events leading to your discharge were unrelated, you may still receive an upgrade, but you'll have to argue that your discharge was unjust punishment for those events.
        </p>
      );
    case '5':
      return (
        <p>
          This is a common request for transgender Veterans whose DD-214 name does not match the name they currently use.
        </p>
      );
    default:
      return null;
  }
};

const priorServiceStatement = (props) => {
  switch (props.formValues['12_priorService']) {
    case '1':
      return (
        <div>
          <p>
            The instructions below tell you how to apply for an upgrade or correction to your final, less than honorable period of service. Because you served honorably in one period of service, however, you can apply for VA benefits using that honorable characterization. You earned your benefits during the period in which you served honorably.
          </p>
          <p>
            <strong>Note:</strong> The only exception is for service-connected disability compensation. If your disability began during your less than honorable period of service, you won't be eligible to earn disability compensation unless you get that discharge upgraded. If you'd like to apply to upgrade your final discharge, follow the instructions below.
          </p>
        </div>
      );
    case '2':
      return (
        <div>
          <p>
            The instructions below tell you how to apply to an upgrade or correction for your final, less than honorable period of service. Because you served honorably in one period of service, however, you can apply for VA benefits using that honorable characterization. You earned your benefits during the period in which you served honorably.
          </p>
          <p>
            <strong>Note:</strong> The only exception is for service-connected disability compensation. If your disability began during your less than honorable period of service, you won't be eligible to earn disability compensation unless you get that discharge upgraded. If you'd like to apply to upgrade your final discharge, follow the instructions below. When you apply for VA benefits using your honorable period of service, submit a DD214 that shows only your period of honorable service. <Link to="/request-dd214" target="_blank">Get instructions on how to request a DD214 for your period of honorable service</Link>
          </p>
        </div>
      );
    default:
      return null;
  }
};

const CarefulConsiderationStatement = (props) => {
  return (
    <div>
      {reasonStatement(props)}
      {priorServiceStatement(props)}
    </div>
  );
};

export default CarefulConsiderationStatement;
