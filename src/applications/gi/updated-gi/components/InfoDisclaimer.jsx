import React from 'react';

const InfoDisclaimer = () => {
  return (
    <div className="border-bottom vads-u-margin-y--3">
      <div className="vads-u-font-family--sans" data-testid="info-disclaimer">
        <h3 className="vads-u-border-bottom--3px vads-u-border-color--primary vads-u-line-height--4 vads-u-font-size--h4">
          Need help?
        </h3>
        <p>
          Note: This website provides general information and does not
          constitute legal advice. It is not a comprehensive analysis of
          statutes, regulations, or case law.
        </p>
        <p>
          <span className="vads-u-font-weight--bold">
            If you need help with claims,
          </span>{' '}
          contact a VA regional office, a{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.va.gov/ogc/apps/accreditation/index.asp"
            id="disclaimer-link-vso"
          >
            Veterans Service Organization (VSO), or a VA-accredited attorney or
            agent.
          </a>
        </p>
        <p>
          <span className="vads-u-font-weight--bold">
            For technical assistance
          </span>{' '}
          or questions about the GI Bill Comparison Tool,{' '}
          <a href="mailto: vbacoeducomptoolinq@va.gov">send us an email.</a> You
          can also{' '}
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
            target="_blank"
            rel="noopener noreferrer"
            id="about-this-tool"
          >
            learn more about the GI Bill Comparison Tool
          </a>
          , or{' '}
          <a
            href="https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx"
            target="_blank"
            rel="noopener noreferrer"
            id="download-all-data"
          >
            download data on all schools (XLS).
          </a>
        </p>
      </div>
    </div>
  );
};

export default InfoDisclaimer;
