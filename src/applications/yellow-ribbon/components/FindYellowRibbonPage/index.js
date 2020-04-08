// Node modules.
import React from 'react';
// Relative imports.
import SearchForm from '../../containers/SearchForm';
import SearchResults from '../../containers/SearchResults';

export const FindYellowRibbonPage = () => (
  <div className="vads-l-grid-container vads-u-padding-x--2p5 vads-u-padding-bottom--4">
    {/* Title */}
    <h1 className="vads-u-margin-bottom--0">Find a Yellow Ribbon school</h1>

    <div className="vads-l-row">
      {/* Search Form */}
      <div className="vads-l-col--12">
        {/* Pre-form content */}
        <p className="vads-l-col--12 medium-screen:vads-l-col--7">
          Find out if your school participates in the Yellow Ribbon program. If
          you already have Post-9/11 GI Bill benefits, the Yellow Ribbon program
          can help pay for higher out-of-state, private school, or graduate
          school tuition. The amount of money you get varies by school, degree
          type, and the program you&apos;re enrolled in.
        </p>

        <a href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/">
          Find out if you qualify for the Yellow Ribbon Program.
        </a>

        <p>
          If you don&apos;t already have Post-9/11 GI Bill benefits, you can:
        </p>

        <ul>
          <li>
            <a href="/education/eligibility/">
              Find out if you&apos;re eligible for the Post-9/11 GI Bill
            </a>
          </li>

          <li>
            <a href="/education/how-to-apply/">
              Apply for Post-9/11 GI Bill benefits
            </a>
          </li>
        </ul>

        <p>
          Search for schools participating in the current academic year by one
          or all of the terms below.
        </p>
      </div>

      {/* Search Form */}
      <div className="vads-l-col--12 medium-screen:vads-l-col--3">
        {/* Search Form Fields */}
        <SearchForm />
      </div>

      {/* Search Results */}
      <div className="vads-l-col--12 vads-u-padding-left--0 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-left--5">
        <SearchResults />
      </div>

      {/* Post-Form Content */}
      <p className="vads-l-col--12 medium-screen:vads-l-col--7">
        Participating school information is for the current academic year. To
        view schools for the previous academic year,{' '}
        <a
          href="https://www.benefits.va.gov/gibill/yellow_ribbon/yellow_ribbon_info_schools.asp"
          rel="noreferrer noopener"
        >
          view the historical rates
        </a>
        .
      </p>
    </div>
  </div>
);

export default FindYellowRibbonPage;
