import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { estimatedBenefits } from '../../selectors/estimator';

export class SearchResult extends React.Component {

  cautionFlag() {
    if (!this.props.cautionFlag) {
      return null;
    }
    return (
      <div className="caution-flag">
        <i className="fa fa-warning"></i>
        Caution
      </div>
    );
  }

  place() {
    const domestic = <span>{this.props.city}, {this.props.state}</span>;
    const foreign = <span>{this.props.city}, {this.props.country}</span>;
    return (this.props.country === 'usa' ? domestic : foreign);
  }

  renderEstimate({ qualifier, value }) {
    const formatCurrency = (n) => {
      const str = Math.round(Number(n)).toString();
      return str.replace(/\d(?=(\d{3})+$)/g, '$&,');
    };
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    }
    if (qualifier === null) {
      if (value === 'N/A') {
        return 'N/A';
      }
      return value;
    }
    return (<span>${formatCurrency(value)}</span>);
  }

  render() {
    const tuition = this.renderEstimate(this.props.estimated.tuition);
    const housing = this.renderEstimate(this.props.estimated.housing);
    const books = this.renderEstimate(this.props.estimated.books);

    return (
      <div className="search-result">
        <div className="outer">
          {this.cautionFlag.bind(this)()}
          <div className="inner row">

            <div className="small-12 medium-7 columns">
              <h2><Link to={`profile/${this.props.facilityCode}`}>{this.props.name}</Link></h2>
              <div style={{ position: 'relative', bottom: 0 }}>
                <p className="locality">{this.place.bind(this)()}</p>
                <p className="count">{this.props.studentCount.toLocaleString()} GI Bill Students</p>
              </div>
            </div>
            <div className="small-12 medium-5 columns estimated-benefits">
              <h3>Your estimated benefits</h3>
              <div className="row">
                <div className="columns">
                  <h4>
                    <i className="fa fa-graduation-cap fa-search-result"></i>
                    Tuition <span>(annually):</span>
                    <div>{tuition}</div>
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="columns">
                  <h4>
                    <i className="fa fa-home fa-search-result"></i>
                    Housing <span>(monthly):</span>
                    <div>{housing}</div>
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="columns">
                  <h4>
                    <i className="fa fa-book fa-search-result"></i>
                    Books <span>(annually):</span>
                    <div>{books}</div>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, props) => {
  return {
    estimated: estimatedBenefits(state, props)
  };
};

const mapDispatchToProps = (_dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
