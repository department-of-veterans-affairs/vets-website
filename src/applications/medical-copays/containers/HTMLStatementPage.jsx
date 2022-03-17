import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import PropTypes from 'prop-types';
import moment from 'moment';
import Modals from '../components/Modals';
import StatementAddresses from '../components/StatementAddresses';

const HTMLStatementPage = ({ match }) => {
  const selectedId = match.params.id;
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  const [selectedCopay] = statements.filter(({ id }) => id === selectedId);
  const statementDate = moment(selectedCopay.pSStatementDate, 'MM-DD').format(
    'MMMM D',
  );
  const title = `${statementDate} statement`;
  const prevPage = `Copay bill for ${selectedCopay.station.facilityName}`;

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <article>
        <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
          <a href="/">Home</a>
          <a href="/health-care">Health care</a>
          <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
          <a
            href={`/health-care/pay-copay-bill/your-current-balances/balance-details/${selectedId}`}
          >
            {prevPage}
          </a>
          <a href={`/balance-details/${selectedId}/statement-view`}>{title}</a>
        </va-breadcrumbs>
        <h1 data-testid="statement-page-title">{title}</h1>
        <p
          className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5"
          data-testid="facility-name"
        >
          {`${selectedCopay?.station.facilityName}`}
        </p>
        <Link
          className="vads-u-font-size--sm"
          to={`/balance-details/${selectedId}`}
        >
          <i
            className="fa fa-chevron-left vads-u-margin-right--1"
            aria-hidden="true"
          />
          <strong>Return to facility details</strong>
        </Link>
        <va-on-this-page className="vads-u-margin-top--0" />
        <StatementAddresses id="statement-addresses" copay={selectedCopay} />
        <h2>What if I have questions about my statement?</h2>
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
        <Link
          className="vads-u-font-size--sm"
          to={`/balance-details/${selectedId}`}
        >
          <i
            className="fa fa-chevron-left vads-u-margin-right--1"
            aria-hidden="true"
          />
          <strong>Return to facility details</strong>
        </Link>
      </article>
    </>
  );
};

HTMLStatementPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default HTMLStatementPage;
