import React from 'react';
import Estimator from '../utils/Estimator';

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
    this.estimate = this.estimate.bind(this);
  }

  // WIP
  estimate() {
    // get current values about the user
    let e = this.props.estimator;
    e.set_military_status = 'active duty';
    e.set_spouse_active_duty = 'yes';
    e.set_gi_bill_chap = '31';
    e.set_number_of_depend = '2';
    e.set_post_911_elig = 'yes';
    e.set_cumulative_service = '1.0';
    e.set_enlistment_service = '3123412314';
    e.set_consecutive_service = '3123412314';
    e.set_online = 'yes';
    // set institution values
    e.set_institution_type = 'private';
    e.set_country = 'usa';
    e.set_bah = '1.1';
  }

  render() {
    this.estimate();

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
        <div id={`$(thihs.props.facility_code)-est-tuition-fees`}>
          { this.props.estimator.renderTuitionFees() }
        </div>
      </div>
    );
  }

  renderHousing() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-home fa-search-result"></i></div>
        <div id={`$(thihs.props.facility_code)-est-housing-allowance`}>
          { this.props.estimator.renderHousingAllowance() }
        </div>
      </div>
    );
  }

  renderBooks() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-book fa-search-result"></i></div>
        <div id={`$(thihs.props.facility_code)-est-book-stipend`}>
          { this.props.estimator.renderBookStipend() }
        </div>
      </div>
    );
  }

}

SearchResult.propTypes = {
  facility_code: React.PropTypes.string.isRequired,
  caution_flag: React.PropTypes.bool.isRequired,
  institution: React.PropTypes.string.isRequired,
  country: React.PropTypes.string.isRequired,
  city: React.PropTypes.string.isRequired,
  state: React.PropTypes.string.isRequired,
  estimator: React.PropTypes.object.isRequired
};

SearchResult.defaultProps = {
  facility_code: 'facility_code',
  institution: 'name goes here',
  caution_flag: true,
  estimator: new Estimator()
};

export default SearchResult;
