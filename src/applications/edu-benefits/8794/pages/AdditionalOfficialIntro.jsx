import React from 'react';
import { useSelector } from 'react-redux';
import { certifyingOfficialInfoAlert } from '../helpers';

const AdditionalOfficialIntro = () => {
  const formData = useSelector(state => state.form?.data);
  const additionalOfficial =
    formData['additional-certifying-official']?.length > 0;

  return !additionalOfficial ? (
    <div>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--neg3">
        Add additional certifying officials
      </h3>
      <p className="vads-u-margin-top--4">
        In this next section of the form, please list any additional certifying
        officials at your institution. Officials listed in this section of the
        form are designated to sign VA Enrollment Certifications, Certifications
        of Change in Student Status, Certifications of Delivery of Advance
        Payments, Certifications of Pursuit, Attendance, Flight Training,
        On-the-Job or Apprenticeship Training (as applicable), School Portion of
        VA Form 22-1990t and other Certifications of Enrollment.
      </p>
      {certifyingOfficialInfoAlert}
    </div>
  ) : null;
};

export default AdditionalOfficialIntro;
