import React from 'react';

const CarefulConsiderationStatement = (props) => {
  switch (props.reason) {
    case '1':
      return (
        <p>
          Because you answered that your discharge was related to a TBI or PTSD or other mental health conditions, the DoD will apply "liberal consideration" to your case. In 2014, DoD recognized that many Veterans received discharges due to behavior connected to their previously undiagnosed or undocumented TBI, PTSD, or mental health conditions. <a href="http://arba.army.pentagon.mil/documents/SECDEF%20Guidance%20to%20BCMRs%20re%20Vets%20Claiming%20PTSD.pdf">Learn more about the DoD guidelines for reviewing cases related to TBI, PTSD, and mental health conditions.</a>
        </p>
      );
    case '2':
      return (
        <p>
          Because you answered that your discharge was related to a TBI, the DoD will apply "liberal consideration" to your case. In 2014, DoD recognized that many Veterans received discharges due to behavior connected to their previously undiagnosed or undocumented TB. Learn more about the DoD guidelines for reviewing cases related to TBI.
        </p>
      );
    case '3':
      if (props.dischargeType === '2') {
        return (
          <p>
            Because you answered that your discharge was due to "homosexual conduct" under Don't Ask Don't Tell or its predecessor policies, the DoD will carefully consider your case. In 2011, DoD recognized that many Veterans received discharges only because of this reason. Note: You must prove that your discharge was <strong>only</strong> due to homosexual conduct, and not due to other behavior.
          </p>
        );
      } else if (props.dischargeType === '1') {
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

export default CarefulConsiderationStatement;
