import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { estimatedBenefits } from '../../selectors/vetTecEstimator';
import { formatCurrency } from '../../utils/helpers';
import {
  renderCautionFlag,
  renderSchoolClosingFlag,
  renderPreferredProviderFlag,
} from '../../utils/render';

export class SearchResult extends React.Component {
  estimate = ({ qualifier, value, range }) => {
    if (qualifier === 'per month range') {
      return (
        <span>
          {formatCurrency(range.start)} - {formatCurrency(range.end)}
        </span>
      );
    } else if (qualifier === null) {
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
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
          {renderSchoolClosingFlag(this.props.result)}
          {renderCautionFlag(this.props.result)}
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
                {renderPreferredProviderFlag(this.props.result)}
                <h3 className="vads-u-padding-top--1p5">
                  You may be eligible for up to:
                </h3>
                <div className="row">
                  <div className="columns">
                    <h4>
                      <i className="fa fa-graduation-cap fa-search-result" />
                      Tuition:
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
  estimated: estimatedBenefits(state, props),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResult);
