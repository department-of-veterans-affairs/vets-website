import React from 'react';

export default function Disclaimer() {
  return (
    // <div className="row disclaimer">
    //   <p>
    //     Please note: Content on this Web page is for informational purposes
    //     only. It is not intended to provide legal advice or to be a
    //     comprehensive statement or analysis of applicable statutes, regulations,
    //     and case law governing this topic. Rather, it’s a plain-language
    //     summary. If you are seeking claims assistance, your local VA regional
    //     office, a VA-recognized Veterans Service Organization, or a
    //     VA-accredited attorney or agent can help.{' '}
    //     <a
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       href="https://www.va.gov/ogc/apps/accreditation/index.asp"
    //       id="disclaimer-link"
    //     >
    //       Search Accredited Attorneys, Claims Agents, or Veterans Service
    //       Organizations (VSO) Representatives.
    //     </a>
    //     <span>
    //       {' '}
    //       If you have data questions about the GI Bill Comparison Tool, email at{' '}
    //       <a href="mailto: vbacoeducomptoolinq@va.gov">
    //         vbacoeducomptoolinq@va.gov
    //       </a>
    //       .
    //     </span>
    //   </p>
    // </div>
    <div className="border-bottom vads-u-margin-top--3 vads-u-margin-bottom--2 ">
      <p className="vads-u-font-family--sans" data-testid="info-disclaimer">
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
      </p>
    </div>
  );
}
