import React from 'react';

const Banner = () => (
  <>
    <va-alert visible full-width closeable status="warning">
      <h3 slot="headline">VA facility and status updates</h3>
      <div>
        <p>
          <strong>Natural disaster affecting your area:</strong>
          &nbsp;Use the&nbsp;
          <a href="https://www.va.gov/find-locations">Find VA locations tool</a>
          &nbsp;to check the status and operating hours of your local VA
          facility.
        </p>
        <p>
          <strong>Coronavirus information:</strong>
          &nbsp;To get the latest updates and sign up to stay informed about
          COVID-19 vaccines, visit our&nbsp;
          <a href="https://www.va.gov/health-care/covid-19-vaccine/">
            vaccine information page
          </a>
          . For questions about how COVID-19 may affect your VA health care and
          benefit services, visit our coronavirus&nbsp;
          <a href="https://www.va.gov/coronavirus-veteran-frequently-asked-questions/">
            FAQs
          </a>
          &nbsp;or read&nbsp;
          <a href="https://www.publichealth.va.gov/n-coronavirus/">
            VA’s public health response
          </a>
          .
        </p>
      </div>
    </va-alert>
  </>
);

export default Banner;
