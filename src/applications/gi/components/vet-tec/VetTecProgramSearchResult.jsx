import React from 'react';
import { Link } from 'react-router';

import { formatCurrency } from '../../utils/helpers';
import {
  renderCautionFlag,
  renderSchoolClosingFlag,
  renderPreferredProviderFlag,
} from '../../utils/render';

class VetTecProgramSearchResult extends React.Component {
  render() {
    const { version, result } = this.props;
    const {
      facilityCode,
      description,
      institutionName,
      city,
      state,
      country,
      tuitionAmount,
      lengthInWeeks,
      vaBah,
      dodBah,
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
                  <p className="institution-name vads-u-font-weight--bold">
                    {institutionName}
                  </p>
                  <p className="institution-location">{`${city}, ${state ||
                    country}`}</p>
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
                      <div className="programTuition">
                        {formatCurrency(tuitionAmount)}
                      </div>
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
                      <div className="programHousingAllowance">
                        {formatCurrency(housing)}
                      </div>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-details columns vads-u-display--inline-block">
                <div className="info-flag">{`${lengthInWeeks} weeks`}</div>
                <Link to={linkTo}>View details ›</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VetTecProgramSearchResult;
