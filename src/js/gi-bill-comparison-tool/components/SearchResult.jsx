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
    const e = this.props.estimator;
    e.setMilitaryStatus = 'active duty';
    e.setSpouseActiveDuty = 'yes';
    e.setGiBillChap = '31';
    e.setNumberOfDepend = '2';
    e.setPost911Elig = 'yes';
    e.setCumulativeService = '1.0';
    e.setEnlistmentService = '3123412314';
    e.setConsecutiveService = '3123412314';
    e.setOnline = 'yes';
    // set institution values
    e.setInstitutionType = 'private';
    e.setCountry = 'usa';
    e.setBah = '1.1';
  }

  renderCautionFlag() {
    return (
      <div className="caution">
        <a className="searchresults-caution noback" href={'#$(this.props.facility_code)'}>
          <i className="fa fa-exclamation-triangle"></i> Caution Flag
        </a>
      </div>
    );
  }

  renderName() {
    return (
      <div className="search-insitution-name">
        <h6>
          <a className={'a-$(this.props.institution_id) noback'} href="#">
            {this.props.institution.toUpperCase()}
          </a>
        </h6>
      </div>
    );
  }

  renderLocality() {
    const domestic = <div className="search-locality">{this.props.city}, {this.props.state.toUpperCase()}</div>;
    const foreign = <div className="search-locality">{this.props.city}, {this.props.country}</div>;
    return (this.props.country.toLowerCase() === 'usa' ? domestic : foreign);
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
        <div id={'$(thihs.props.facility_code)-est-tuition-fees'}>
          {this.props.estimator.renderTuitionFees()}
        </div>
      </div>
    );
  }

  renderHousing() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-home fa-search-result"></i></div>
        <div id={'$(thihs.props.facility_code)-est-housing-allowance'}>
          {this.props.estimator.renderHousingAllowance()}
        </div>
      </div>
    );
  }

  renderBooks() {
    return (
      <div className="search-value-each small-4 column">
        <div className="icon"><i className="fa fa-book fa-search-result"></i></div>
        <div id={'$(thihs.props.facility_code)-est-book-stipend'}>
          {this.props.estimator.renderBookStipend()}
        </div>
      </div>
    );
  }

  render() {
    this.estimate();

    return (
      <div id={this.props.facility_code} className="school_summary large-4 medium-5-center small-12-center columns">
        {this.props.caution_flag && this.renderCautionFlag()}
        <div className="search-content">
          {this.renderName()}
          {this.renderLocality()}
          {this.renderVetCount()}
          <div className="search-benefits-values-container">
            <div className="search-selections-label">
              You may be eligible for up to:
            </div>
            {this.renderTuition()}
            {this.renderHousing()}
            {this.renderBooks()}
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

}

SearchResult.propTypes = {
  facilityCode: React.PropTypes.string.isRequired,
  cautionFlag: React.PropTypes.bool.isRequired,
  institution: React.PropTypes.string.isRequired,
  country: React.PropTypes.string.isRequired,
  city: React.PropTypes.string.isRequired,
  state: React.PropTypes.string.isRequired,
  estimator: React.PropTypes.object.isRequired
};

SearchResult.defaultProps = {
  facilityCode: 'facility_code',
  institution: 'name goes here',
  cautionFlag: true,
  estimator: new Estimator()
};

export default SearchResult;
