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

export class VetTecSearchResult extends React.Component {
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
    const {
      facilityCode,
      description,
      institutionName,
      institutionCity,
      institutionState,
      institutionCountry,
      tuitionAmount,
      lengthInHours,
      vaBah,
      dodBah
    } = result;

    const housing = Math.min(dodBah, vaBah);

    const linkTo = {
      pathname: `profile/${facilityCode}/${description}`,
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
                  <Link to={linkTo}>{description}</Link>
                </h2>
                <div style={{ position: 'relative', bottom: 0 }}>
                  <p className="institution-name">{institutionName}</p>
                  <p>
                    {institutionCity}, {institutionState || institutionCountry}
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
                      <i
                        aria-hidden="true"
                        className="fa fa-graduation-cap fa-search-result"
                      />
                      Tuition:
                      <div>{formatCurrency(tuitionAmount)}</div>
                    </h4>
                  </div>
                </div>
                <div className="row">
                  <div className="columns">
                    <h4>
                      <i
                        aria-hidden="true"
                        className="fa fa-home fa-search-result"
                      />
                      Housing <span>(monthly):</span>
                      <div>{formatCurrency(housing)}</div>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-details columns">
                <div className="info-flag">{lengthInHours} hours</div>
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
)(VetTecSearchResult);
