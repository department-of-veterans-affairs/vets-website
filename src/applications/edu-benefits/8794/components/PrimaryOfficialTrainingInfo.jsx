import React from 'react';
import { useSelector } from 'react-redux';

const PrimaryOfficialTrainingInfo = () => {
  const formState = useSelector(state => state?.form?.data || {});

  return (
    <>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
        {formState?.primaryOfficial.fullName.first &&
        formState?.primaryOfficial.fullName.last
          ? `${formState?.primaryOfficial.fullName.first} ${
              formState?.primaryOfficial.fullName.last
            }'s Section 305 training`
          : 'Section 305 Training'}
      </h3>
      <p className="vads-u-margin-top--4">
        <strong>New School Certifying Officials:</strong> All newly designated
        certifying officials must complete required online training for new
        certifying officials based on their type of facility and provide a copy
        of their training certificate when submitting this form. Enter the date
        the new certifying official training was completed.
      </p>
      <p className="vads-u-margin-top--2">
        <strong>Existing School Certifying Officials:</strong> Existing SCOs at
        covered educational institutions must complete a certain number of
        training modules/training events based on their facility or program
        type, annually, to maintain their access to certifying enrollments to
        VA.
        <va-link
          href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/online_sco_training.asp#existing"
          text="Go to this page to find out what's required"
          external
        />
      </p>
    </>
  );
};

export default PrimaryOfficialTrainingInfo;
