import React from 'react';

const reasonStatement = (props) => {
  const reason = props.formValues['4_reason'];
  const dischargeType = props.formValues['5_dischargeType'];

  switch (reason) {
    case '1':
      return (
        <p>
          Because you answered that your discharge was related to a TBI or PTSD or other mental health conditions, the DoD will apply "liberal consideration" to your case. In 2014, DoD recognized that many Veterans received discharges due to behavior connected to their previously undiagnosed or undocumented TBI, PTSD, or mental health conditions. <a href="http://arba.army.pentagon.mil/documents/SECDEF%20Guidance%20to%20BCMRs%20re%20Vets%20Claiming%20PTSD.pdf">Learn more about the DoD guidelines for reviewing cases related to TBI, PTSD, and mental health conditions.</a>
        </p>
      );
    case '2':
      return (
        <p>
          Because you answered that your discharge was related to a TBI, the DoD will apply "liberal consideration" to your case. In 2014, DoD recognized that many Veterans received discharges due to behavior connected to their previously undiagnosed or undocumented TBI. Learn more about the DoD guidelines for reviewing cases related to TBI.
        </p>
      );
    case '3':
      if (dischargeType === '2') {
        return (
          <p>
            Because you answered that your discharge was due to sexual orientation under Don't Ask Don't Tell or its predecessor policies, the DoD will carefully consider your case. In 2011, DoD recognized that many Veterans received discharges only because of this reason. Note: You must prove that your discharge was <strong>only</strong> due to sexual orientation, and not due to other behavior.
          </p>
        );
      } else if (dischargeType === '1') {
        return (
          <p>
            Many Veterans received General or Honorable discharges under Don’t Ask Don’t Tell (DADT), and simply want references to sexual orientation removed from their DD-214, or want the ability to re-enlist. This is a relatively straightforward application.
          </p>
        );
      }
      return null;
    case '4':
      return (
        <p>
          Because you answered that your discharge was related to sexual assault or harassment, the DoD will carefully consider your case. In 2017, DoD recognized that many Veterans received discharges due to sexual assault or harassment and unfairly received less than honorable discharges. Note: You must prove that your discharge was <strong>only</strong> a result of sexual assault or harassment, and not due to other behavior.
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
          Because you served honorably in one period of service, you can apply for VA benefits using that honorable characterization. You earned your benefits during the period in which you served honorably. This is true even if you didn’t receive an actual discharge at the end of the honorable period. If you completed your original contract period without any disciplinary problems, you can use this period of service to establish your eligibility, even if you re-enlisted or extended your service and did not receive an "Honorable" DD-214. If you believe there is a period of service that entitles you to benefits, but which is not reflected on a DD-214, you will likely need to ask the VA to do a Character of Service Determination. The only exception is for service-connected disability compensation. If your disability began during your less than honorable period of service, you won't be eligible to earn disability compensation unless you get your discharge upgraded.
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
