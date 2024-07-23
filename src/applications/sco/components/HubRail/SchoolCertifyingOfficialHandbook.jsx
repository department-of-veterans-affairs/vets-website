import React from 'react';
import educationSco from '../../assets/img/hub-illustrations/education-sco.jpg';

const SchoolCertifyingOfficialHandbook = () => {
  return (
    <div className="merger-r-rail hub-promo" id="promo">
      <img src={educationSco} alt="" />
      <section className="hub-promo-text">
        <h4 className="heading">
          <va-link
            href="https://iam.education.va.gov/"
            text="Access Enrollment Manager"
            className="hydrated"
          />
        </h4>
        <p>via the VA Education Platform Portal</p>
      </section>
    </div>
  );
};

export default SchoolCertifyingOfficialHandbook;
