// Node modules.
import React from 'react';
// Relative imports.
import SearchForm from '../../containers/SearchForm';
import SearchResults from '../../containers/SearchResults';

export const FindYellowRibbonPage = () => (
  <>
    {/* Title */}
    <h1 className="vads-u-margin-bottom--0">Find a Yellow Ribbon school</h1>

    <div className="vads-l-row">
      {/* Search Form */}
      <div className="vads-l-col--12">
        {/* Pre-form content */}
        <p className="vads-l-col--12 medium-screen:vads-l-col--7">
          Find out if your school participates in the Yellow Ribbon Program. If
          you already have Post-9/11 GI Bill benefits, the Yellow Ribbon Program
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
    </div>
  </>
);

export default FindYellowRibbonPage;
