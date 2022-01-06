import React from 'react';

export default function Disclaimer() {
  return (
    <div className="row disclaimer">
      <p>
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
      </p>
    </div>
  );
}
