import React from 'react';

class SearchResult extends React.Component {

  constructor(props) {
    super(props);
    this.renderCautionFlag = this.renderCautionFlag.bind(this);
    this.renderName = this.renderName.bind(this);
    this.renderLocality = this.renderLocality.bind(this);
    this.renderVetCount = this.renderVetCount.bind(this);
    this.renderTuition = this.renderTuition.bind(this);
    this.renderHousing = this.renderHousing.bind(this);
    this.renderBooks = this.renderBooks.bind(this);
  }

  render() {
    return (
      <div id={this.props.facility_code} className="school_summary large-4 medium-5-center small-12-center columns">
        { this.props.caution_flag && this.renderCautionFlag() }
        <div className="search-content">
          { this.renderName() }
          { this.renderLocality() }
          { this.renderVetCount() }
          <div className="search-benefits-values-container">
            <div className="search-selections-label">
              You may be eligible for up to:
            </div>
            { this.renderTuition() }
            { this.renderHousing() }
            { this.renderBooks() }
          </div>
          <div className="row">
            <div className="search-learnmore-div">
              <a className="button filter-button va-search-learnmore" href="#">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCautionFlag() {
    return (
      <div className="caution">
        <a className="searchresults-caution noback" href={`#$(this.props.facility_code)`}>
          <i className="fa fa-exclamation-triangle"></i> Caution Flag
        </a>
      </div>
    );
  }

  renderName() {
    return (
      <div className="search-insitution-name">
        <h6>
          <a className={`a-$(this.props.institution_id) noback`} href="#">
            { this.props.institution.toUpperCase() }
          </a>
        </h6>
      </div>
    );
  }

  renderLocality() {
    const domestic = <div className="search-locality">{this.props.city}, {this.props.state.toUpperCase()}</div>;
    const foreign = <div className="search-locality">{this.props.city}, {this.props.country}</div>;
    return ('usa' === this.props.country.toLowerCase() ? domestic : foreign);
  }

  renderVetCount() {
    return (
      <div className="search-vet-count">
        <span className="vet-count-value">{this.props.gibill}</span> GI Bill Students
      </div>
    );
  }

  renderTuition() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-graduation-cap fa-search-result"></i></div>
        <div id={`$(thihs.props.facility_code)-est-tuition-fees`}></div>
      </div>
    );
  }

  renderHousing() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-home fa-search-result"></i></div>
        <div id={`$(thihs.props.facility_code)-est-housing-allowance`}></div>
      </div>
    );
  }

  renderBooks() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-book fa-search-result"></i></div>
        <div id={`$(thihs.props.facility_code)-est-book-stipend`}></div>
      </div>
    );
  }

}

SearchResult.propTypes = {
  facility_code: React.PropTypes.string,
  caution_flag: React.PropTypes.bool,
  institution: React.PropTypes.string,
  country: React.PropTypes.string,
  city: React.PropTypes.string,
  state: React.PropTypes.string,
};

SearchResult.defaultProps = {
  facility_code: 'facility_code',
  institution: 'name goes here',
  caution_flag: true
};

export default SearchResult;


// <div id="10718013" class="school_summary large-4 medium-5-center small-12-center columns" data-id="8399" data-facility-code="10718013 %>" data-institution="CITY OF HARVARD POLICE DEPARTMENT" data-city="HARVARD" data-state="IL" data-country="USA" data-type="ojt" data-institution-type="employer" data-poe="false" data-student-veteran="false" data-eight-keys="" data-yr="false" data-bah="1749.0">
//
//   <div class="search-content"><!-- Start SEARCH RESULTS CONTENT DIV -->
//     <!-- Divs added to preserve consistent heights regardless of # of lines -->
//     <div class="search-insitution-name"><!-- Institution name -->
//       <h6><a class="a-8399 noback" href="/gi-bill-comparison-tool/institutions/profile?military_status=veteran&amp;spouse_active_duty=no&amp;gi_bill_chapter=33&amp;cumulative_service=1.0&amp;enlistment_service=3&amp;consecutive_service=0.8&amp;elig_for_post_gi_bill=no&amp;number_of_dependents=0&amp;online_classes=no&amp;source=search&amp;institution_search=harvard&amp;type_name=employer&amp;page=1&amp;facility_code=10718013">
//         CITY OF HARVARD POLICE DEPARTMENT</a></h6>
//     </div><!-- END Institution name -->
//
//     <div class="search-locality"><!-- locality data -->
//         HARVARD, IL
//     </div><!-- END locality data -->
//
//     <div class="search-vet-count"><!-- # of Student Vets -->
// 	    <span class="vet-count-value">0</span> GI Bill Students
//     </div><!-- END # of Student Vets -->
//
//     <div class="search-benefits-values-container"><!-- Contains the benefit values divs -->
//       <div class="search-selections-label">You may be eligible for up to:</div>
// 		    <div class="search-value-each small-4 column"> <!-- tuition -->
//           <div class="icon"><i class="fa fa-graduation-cap fa-search-result"></i></div>
//           <div id="10718013-est-tuition-fees">N/A</div>
//         </div><!-- END tuition -->
//
// 		    <div class="search-value-each small-4 column"><!-- housing -->
//           <div class="icon"><i class="fa fa-home fa-search-result"></i></div>
//           <div id="10718013-est-housing-allowance"><span class="estimator-dollar-sign">$</span>1,749<br><span class="estimate-qualifier">per month</span></div>
//         </div><!-- END Housing -->
//
// 		    <div class="search-value-each small-4 column"><!-- Books -->
//           <div class="icon"><i class="fa fa-book fa-search-result"></i></div>
//           <div id="10718013-est-book-stipend"><span class="estimator-dollar-sign">$</span>1,000<br><span class="estimate-qualifier">per year</span></div>
//         </div><!-- END books -->
//       </div><!-- Contains the benefit values divs -->
//
//       <div class="row">
//         <div class="search-learnmore-div"><!-- Contains the learn more div for consistent position -->
//           <a class="button filter-button va-search-learnmore" href="/gi-bill-comparison-tool/institutions/profile?military_status=veteran&amp;spouse_active_duty=no&amp;gi_bill_chapter=33&amp;cumulative_service=1.0&amp;enlistment_service=3&amp;consecutive_service=0.8&amp;elig_for_post_gi_bill=no&amp;number_of_dependents=0&amp;online_classes=no&amp;source=search&amp;institution_search=harvard&amp;type_name=employer&amp;page=1&amp;facility_code=10718013">Learn More</a>
//       </div>
//     </div>
//   </div><!-- END learn more div -->
// </div>
