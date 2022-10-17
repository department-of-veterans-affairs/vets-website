import React from 'react';

export const PageNotFound = () => {
  return (
    <>
      <div className="main maintenance-page" role="main">
        <div className="primary">
          <div className="row">
            <div className="text-center usa-content">
              <h3>Sorry — we can’t find that page</h3>
              <p>Try the search box or one of the common questions below.</p>
              <div className="feature va-flex va-flex--ctr">
                <form
                  acceptCharset="UTF-8"
                  action="/search/"
                  id="search_form"
                  className="full-width search-form-bottom-margin"
                  method="get"
                >
                  <div className="va-flex va-flex--top va-flex--jctr">
                    <label htmlFor="mobile-query">Search:</label>
                    <input
                      autoComplete="off"
                      className="usagov-search-autocomplete full-width"
                      id="mobile-query"
                      name="query"
                      type="text"
                    />
                    <input type="submit" value="Search" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row va-quicklinks va-quicklinks--commpop">
        <div className="small-12 usa-width-one-half medium-6 columns">
          <h3 className="va-h-ruled">Common Questions</h3>
          <ul className="va-list--plain">
            <li>
              <a href="/health-care/how-to-apply/">
                How do I apply for health care?
              </a>
            </li>
            <li>
              <a href="/disability/how-to-file-claim/">
                How do I file for disability benefits?
              </a>
            </li>
            <li>
              <a href="/education/how-to-apply/">
                How do I apply for education benefits?
              </a>
            </li>
          </ul>
        </div>
        <div className="small-12 usa-width-one-half medium-6 columns">
          <h3 className="va-h-ruled">Popular on VA.gov</h3>
          <ul className="va-list--plain">
            <li>
              <a href="/find-locations/">Find nearby VA locations</a>
            </li>
            <li>
              <a href="/education/gi-bill-comparison-tool">
                View education benefits available by school
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://www.veteranscrisisline.net/"
                rel="noopener noreferrer"
                className="external no-external-icon"
              >
                Contact the Veterans Crisis Line
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
