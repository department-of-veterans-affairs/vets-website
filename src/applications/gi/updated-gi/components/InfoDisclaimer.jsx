import React from 'react';

const InfoDisclaimer = () => {
  return (
    <div className="border-bottom vads-u-margin-top--3 vads-u-margin-bottom--2 ">
      <p
        className="vads-u-font-family--sans vads-u-color--gray-dark"
        data-testid="info-disclaimer"
      >
        Please note: Content on this Web page is for informational purposes
        only. It is not intended to provide legal advice or to be a
        comprehensive statement or analysis of applicable statutes, regulations,
        and case law governing this topic. Rather, it’s a plain-language
        summary. If you are seeking claims assistance, your local VA regional
        office, a VA-recognized Veterans Service Organization, or a
        VA-accredited attorney or agent can help.{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.va.gov/ogc/apps/accreditation/index.asp"
          id="disclaimer-link"
        >
          Search Accredited Attorneys, Claims Agents, or Veterans Service
          Organizations (VSO) Representatives
        </a>
        .
        <span>
          {' '}
          If you need technical assistance on “How to use the Comparison Tool”
          please see the user guide{' '}
          <va-link
            href="/gids/508_gi_bill_comparison_tool_user_guide.pdf"
            external
            text=""
          />
          . If you have data questions about the GI Bill Comparison Tool, email
          us at{' '}
          <a href="mailto: vbacoeducomptoolinq@va.gov">
            vbacoeducomptoolinq@va.gov
          </a>
          .
        </span>
      </p>
    </div>
  );
};

export default InfoDisclaimer;
