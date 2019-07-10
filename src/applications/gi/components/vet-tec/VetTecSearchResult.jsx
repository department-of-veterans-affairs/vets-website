import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { estimatedBenefits } from '../../selectors/estimator';
import { formatCurrency } from '../../utils/helpers';

export class SearchResult extends React.Component {
  estimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    }
    if (qualifier === null) {
      if (value === 'N/A') return 'N/A';
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
  };

  renderSchoolClosingFlag = () => {
    const { schoolClosing } = this.props.result;
    if (!schoolClosing) return null;
    return (
      <div className="caution-flag">
        <i className="fa fa-warning" />
        School closing
      </div>
    );
  };

  renderCautionFlag = () => {
    const { cautionFlag } = this.props.result;
    if (!cautionFlag) return null;
    return (
      <div className="caution-flag">
        <i className="fa fa-warning" />
        Caution
      </div>
    );
  };

  render() {
    const { version, result, estimated } = this.props;
    const { facilityCode, name, city, state, country } = result;

    const tuition = this.estimate(estimated.tuition);
    const housing = this.estimate(estimated.housing);

    const linkTo = {
      pathname: `profile/${facilityCode}`,
      query: version ? { version } : {},
    };

    return (
      <div className="search-result">
        <div className="outer">
          {this.renderSchoolClosingFlag()}
          {this.renderCautionFlag()}
          <div className="inner">
            <div className="row">
              <div className="small-12 usa-width-seven-twelfths medium-7 columns">
                <h2>
                  <Link to={linkTo}>{name}</Link>
                </h2>
                <div style={{ position: 'relative', bottom: 0 }}>
                  <p className="locality">
                    {city}, {state || country}
                  </p>
                </div>
              </div>
              <div className="small-12 usa-width-five-twelfths medium-5 columns estimated-benefits">
                <h3>You may be eligible for up to:</h3>
                <div className="row">
                  <div className="columns">
                    <h4>
                      <i className="fa fa-graduation-cap fa-search-result" />
                      Tuition <span>(annually):</span>
                      <div>{tuition}</div>
                    </h4>
                  </div>
                </div>
                <div className="row">
                  <div className="columns">
                    <h4>
                      <i className="fa fa-home fa-search-result" />
                      Housing <span>(monthly):</span>
                      <div>{housing}</div>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-details columns">
                <Link to={linkTo}>View details ›</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  estimated: estimatedBenefits(state, props.result),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResult);
