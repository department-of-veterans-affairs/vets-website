import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { estimatedBenefits } from '../../selectors/estimator';
import { formatCurrency, locationInfo } from '../../utils/helpers';
import {
  renderCautionFlag,
  renderSchoolClosingFlag,
  renderCautionAlert,
  renderSchoolClosingAlert,
} from '../../utils/render';
import environment from 'platform/utilities/environment';

export class SearchResult extends React.Component {
  estimate = ({ qualifier, value }) => {
    if (qualifier === '% of instate tuition') {
      return <span>{value}% in-state</span>;
    } else if (qualifier === null) {
      return value;
    }
    return <span>{formatCurrency(value)}</span>;
  };

  render() {
    const {
      version,
      schoolClosing,
      cautionFlag,
      estimated,
      facilityCode,
      name,
      city,
      state,
      country,
      studentCount,
    } = this.props;

    const tuition = this.estimate(estimated.tuition);
    const housing = this.estimate(estimated.housing);
    const books = this.estimate(estimated.books);

    const linkTo = {
      pathname: `profile/${facilityCode}`,
      query: version ? { version } : {},
    };

    return (
      <div className="search-result">
        {/* prod flag for bah 4926 */}
        {environment.isProduction() ? (
          <div className="outer">
            {renderSchoolClosingFlag({ schoolClosing })}
            {renderCautionFlag({ cautionFlag })}
            <div className="inner">
              <div className="row">
                <div className="small-12 usa-width-seven-twelfths medium-7 columns">
                  <h2>
                    <Link to={linkTo}>{name}</Link>
                  </h2>
                  <div style={{ position: 'relative', bottom: 0 }}>
                    <p className="locality">
                      {locationInfo(city, state, country)}
                    </p>
                    <p className="count">
                      {(+studentCount).toLocaleString()} GI Bill Students
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
                  <div className="row">
                    <div className="columns">
                      <h4>
                        <i className="fa fa-book fa-search-result" />
                        Books <span>(annually):</span>
                        <div>{books}</div>
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
        ) : (
          <div className="outer">
            <div className="inner">
              <div className="row">
                <div className="small-12 usa-width-seven-twelfths medium-7 columns">
                  <h2>
                    <Link to={linkTo}>{name}</Link>
                  </h2>
                </div>
              </div>
              {(schoolClosing || cautionFlag) && (
                <div className="row alert-row">
                  <div className="small-12 columns">
                    {renderSchoolClosingAlert({ schoolClosing })}
                    {renderCautionAlert({ cautionFlag })}
                  </div>
                </div>
              )}
              <div className="row">
                <div className="small-12 usa-width-seven-twelfths medium-7 columns">
                  <div style={{ position: 'relative', bottom: 0 }}>
                    <p className="locality">
                      {locationInfo(city, state, country)}
                    </p>
                    <p className="count">
                      {(+studentCount).toLocaleString()} GI Bill Students
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
                  <div className="row">
                    <div className="columns">
                      <h4>
                        <i className="fa fa-book fa-search-result" />
                        Books <span>(annually):</span>
                        <div>{books}</div>
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
        )}
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
