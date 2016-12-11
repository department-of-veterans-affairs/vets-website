import React from 'react';
import AboutYourselfFields from '../components/AboutYourselfFields';
import FilterFields from '../components/FilterFields';
import SearchResult from '../components/SearchResult';

class SearchPage extends React.Component {

  render() {
    return (
      <span>
        <div className="section">
          {this.renderBreadcrumbs()}
          {this.renderHeader()}
        </div>

        <div className="action-bar">
          <div className="row">
            <div className="small-10 medium-10 columns filter-horizontal" id="horiz-filters-noprint2">
              <AboutYourselfFields labels={false}/>
            </div>
            <div className="medium-2 columns">
              <a href="#">
                <button type="button">Reset Search</button>
              </a>
            </div>
          </div>
        </div>

        <div className="section one">
          <div className="row">

            { /* filter controls column */ }
            <div className="small-12 medium-3 columns">
              <ul className="accordion filtermargin" data-accordion>
                <li className="accordion-navigation search-filters-header">
                  <a id="open-or-close-filters-accordion" href="#panel-filters">Filter Results</a>
                  <div id="panel-filters" className="content">
                    <div id="search-filters">
                      <div className="usa-card-content">
                        <FilterFields queryParams={this.props.queryParams}/>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            { /* results column */ }
            <div className="small-12 medium-9 columns">
              <div className="search-count">Showing
                <strong>{3432}</strong> results for the term
                <strong><i>'{this.props.queryParams.institution_search}'</i></strong>.
              </div>
              {/*
              <%= render partial: 'school_summary',
                collection: @kilter.paged_filtered_rset,
                locals: { url: @kilter.to_href(profile_path, @inputs, page: @page) }
              %>
              */}
              <SearchResult facilityCode="123423423" cautionFlag gibill={21} institution="harvard" country="usa" city="Boston" state="ma"/>
            </div>

          </div>
        </div>

      </span>
    );
  }

  renderHeader() {
    return (
      <div className="row">
        <h1 className="va-heading-sans">GI Bill Comparison Tool Search Results</h1>
      </div>
    );
  }

  renderBreadcrumbs() {
    return (
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
          <li><a href="/">Home</a></li>
          <li><a href="/education/">Education Benefits</a></li>
          <li><a href="/education/gi-bill/">GI Bill</a></li>
          <li><a href="/gi-bill-comparison-tool/">GI Bill Comparison Tool</a></li>
          <li className="active">Search</li>
        </ul>
      </nav>
    );
  }

}

SearchPage.propTypes = {
  queryParams: React.PropTypes.object.isRequired
};

export default SearchPage;
