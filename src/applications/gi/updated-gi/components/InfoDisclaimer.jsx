import React from 'react';

const InfoDisclaimer = () => {
  return (
    <div className="disclaimer-border vads-u-margin-y--3">
      <div className="vads-u-font-family--sans" data-testid="info-disclaimer">
        <h2 className="vads-u-border-bottom--3px vads-u-border-color--primary vads-u-line-height--4 vads-u-font-size--h4">
          Need help?
        </h2>
        <p>
          Note: Content on this web page is for informational purposes only. It
          is not intended to provide legal advice or to be a comprehensive
          statement or analysis of applicable statutes, regulations, and case
          law governing this topic. Rather, it’s a plain language summary.
        </p>
        <p>
          <span className="vads-u-font-weight--bold">
            For information about using VA Education benefits,
          </span>{' '}
          contact us online any time using{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://ask.va.gov/"
            id="disclaimer-ask-va-link"
          >
            Ask VA
          </a>{' '}
          or call the VA Education Call Center at 1-888-GIBILL-1(1-888-442-4551)
          from 7 a.m. - 6 p.m. Central Time, Monday-Friday.
        </p>
        <p>
          <span className="vads-u-font-weight--bold">For help with claims</span>{' '}
          contact a{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.va.gov/get-help-from-accredited-representative/"
            id="disclaimer-link-vso"
          >
            Veterans Service Organization (VSO) or a VA-accredited attorney or
            agent.
          </a>
        </p>
        <p>
          <span className="vads-u-font-weight--bold">
            For technical assistance
          </span>{' '}
          or questions about the GI Bill Comparison Tool, contact a VA regional
          office or{' '}
          <a href="mailto: vbacoeducomptoolinq@va.gov">send us an email.</a> You
          can also{' '}
          <a
            href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
            target="_blank"
            rel="noopener noreferrer"
            id="disclaimer-link-about-this-tool"
          >
            learn more about the GI Bill Comparison Tool.
          </a>
        </p>
      </div>
    </div>
  );
};

export default InfoDisclaimer;
