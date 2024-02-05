import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { currency } from '../../utils/helpers';
import { MiniSummaryCard } from '../shared/MiniSummaryCard';

const HotlineInfo = () => {
  return (
    <p>
      <strong>Note:</strong> If this information isn’t right, you can call our
      VA benefits hotline at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} uswds /> . We’re here Monday
      through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
  );
};

const BenefitCard = React.memo(({ received }) => {
  return (
    <p className="vads-u-margin-bottom--1 vads-u-margin-top--1">
      <span>Amount received last month: </span>
      <b>{currency(received)}</b>
    </p>
  );
});

BenefitCard.propTypes = {
  received: PropTypes.number,
};

const NoBenefits = React.memo(() => {
  return (
    <section className="usa-alert background-color-only">
      <div className="vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">
          Our records show you don’t get any monthly benefit payments
        </h4>
      </div>

      <HotlineInfo />
    </section>
  );
});

const EnhancedBenefits = ({ income, pending }) => {
  const eduReceived = income?.reduce((a, b) => a + Number(b.education), 0);
  const compReceived = income?.reduce(
    (a, b) => a + Number(b.compensationAndPension),
    0,
  );

  return !pending && (eduReceived || compReceived) ? (
    <>
      <p>This is the VA benefit information we have on file for you.</p>
      {compReceived ? (
        <MiniSummaryCard
          heading="Disability compensation and pension benefits"
          showDelete={false}
          editDestination={{
            pathname: '/edit-benefits',
            search: `?type=compensationAndPension`,
          }}
          body={<BenefitCard received={compReceived} />}
          index={0}
        />
      ) : null}
      {eduReceived ? (
        <MiniSummaryCard
          heading="Education benefits"
          editDestination={{
            pathname: '/edit-benefits',
            search: `?type=education`,
          }}
          showDelete={false}
          body={<BenefitCard received={eduReceived} />}
          index={1}
        />
      ) : null}
      <HotlineInfo />
    </>
  ) : (
    <NoBenefits />
  );
};

EnhancedBenefits.defaultProps = {
  income: [],
  pending: false,
};

EnhancedBenefits.propTypes = {
  income: PropTypes.array,
  pending: PropTypes.bool,
};

const mapStateToProps = ({ form, fsr }) => ({
  income: form.data.income,
  pending: fsr.pending,
});

export default connect(
  mapStateToProps,
  null,
)(EnhancedBenefits);
