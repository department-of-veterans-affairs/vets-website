import React from 'react';
import { useSelector } from 'react-redux';

import { alert, ProprietaryProfitAdditionalInfo } from '../helpers';

const ConflictOfInterestIntro = () => {
  const formData = useSelector(state => state.form?.data);
  const conflictOfInterest = formData['conflict-of-interest']?.length > 0;

  return !conflictOfInterest ? (
    <>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--4">
        Individuals with a potential conflict of interest who receive VA
        educational benefits
      </h3>
      <p>
        Title 38 C.F.R. 21.4202(c), 21.5200(c), 21.7122(e)(6), and
        21.7622(f)(4)(iv) prohibit the payment of educational assistance to any
        Veteran or eligible person enrolled in a proprietary school as an owner
        or officer. If a Veteran or eligible person is an official authorized to
        sign enrollment certificates or certify/verifying attendance, they
        cannot submit their own enrollment certification(s) to VA.
      </p>
      <p>
        In the next step, provide the names and VA file numbers (claim or Social
        Security numbers) of any certifying officials, owners, or officers at
        your school who receive VA educational assistance based on their
        enrollment.
      </p>
      <div className="vads-u-margin-y--4">
        <ProprietaryProfitAdditionalInfo />
      </div>
      {alert}
    </>
  ) : null;
};

export default ConflictOfInterestIntro;
