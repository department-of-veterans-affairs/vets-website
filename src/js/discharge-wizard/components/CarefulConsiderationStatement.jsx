import React from 'react';
import { board, venueAddress, branchOfService } from '../utils';

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
          Because you answered that your discharge was related to sexual assault or harassment, the DoD will carefully consider your case. In 2017, DoD recognized that many Veterans received discharges due to sexual assault or harassment and unfairly received less than honorable discharges. Note: You must prove that your discharge was only a result of sexual assault or harassment and events specifically related to it.
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
  switch (props.formValues['11_priorService']) {
    case '1':
      return (
        <p>
          Because you served honorably in one period of service, you can apply for VA benefits using that honorable characterization. You earned your benefits during the period in which you served honorably. The only exception is for service-connected disability compensation. If your disability began during your less than honorable period of service, you won't be eligible to earn disability compensation unless you get your discharge upgraded.
        </p>
      );
    case '2':
      return (
        <p>
          The directions on this page tell you how to apply to an upgrade or correction for your final period of service, in which you received a less than honorable discharge. However, because you served honorably in a previous period of service, you can also apply for VA benefits using that honorable status. You earned your benefits during the period in which you served honorably. If you apply for VA benefits, make sure you mention your honorable period of service, and VA will conduct a Character of Service Determination review. You may also apply to DoD to receive a second DD-214 reflecting only your period of honorable service. To do so, <a href="http://www.afpc.af.mil/Portals/70/documents/Home/AFBCMR/DD%20Form%20149.pdf?ver=2016-12-15-120123-183">submit DoD Form 149</a> to the {board(props.formValues, true).abbr} for the {branchOfService(props.formValues['1_branchOfService'])} at {venueAddress(props.formValues, true)}. When filling out DoD Form 149, be sure to clarify in Item 6 that you are seeking a DD-214 for your honorable period of service, and include the dates of that period.
        </p>
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
