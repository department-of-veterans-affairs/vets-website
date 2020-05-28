import React from 'react';

function Covid19Banner() {
  return (
    <div className="usa-alert-full-width usa-alert-full-width-warning">
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading" id="coronavirus">
            Coronavirus and VA education benefits
          </h3>
          <div className="usa-alert-text">
            <p>
              Visit{' '}
              <a href="https://www.benefits.va.gov/GIBILL/COVID19EducationBenefits.asp">
                COVID-19 Information affecting education benefits
              </a>{' '}
              for questions on how VA is protecting your GI Bill and <br />
              other education benefits.
            </p>
            <p>
              Not a student?{' '}
              <a href="https://benefits.va.gov/gibill/covid19faqs.asp">
                See FAQs for School Certifying Officials (SCOs)
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Covid19Banner;
