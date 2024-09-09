import React from 'react';

const scoImgSrc =
  'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/education-sco.jpg';

const SchoolCertifyingOfficialHandbook = () => {
  return (
    <div className="merger-r-rail hub-promo" id="promo">
      <img src={scoImgSrc} alt="Education Sco" />
      <section className="hub-promo-text">
        <h2 className="heading">
          <va-link
            href="https://iam.education.va.gov/"
            text="Access Enrollment Manager"
          />
        </h2>
        <p>via the VA Education Platform Portal</p>
      </section>
    </div>
  );
};

export default SchoolCertifyingOfficialHandbook;
