import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { currency } from '../../utils/helpers';

const BenefitCard = ({ received, title }) => {
  return (
    <section className="usa-alert background-color-only">
      <div className="vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">{title}</h4>
      </div>

      <div className="vads-u-margin-bottom--1">
        <span>Amount received last month: </span>
        {currency(received)}
      </div>
    </section>
  );
};

BenefitCard.propTypes = {
  received: PropTypes.number,
  title: PropTypes.string,
};

const NoBenefits = () => {
  return (
    <section className="usa-alert background-color-only">
      <div className="vads-u-margin-bottom--1">
        <h4 className="vads-u-margin--0">
          Our records show you don’t get any monthly benefit payments
        </h4>
      </div>

      <p>
        If this information isn’t right, you can call our VA benefits hotline at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </section>
  );
};

const Benefits = ({ pending, income }) => {
  const eduReceived = income?.reduce((a, b) => a + Number(b.education), 0);
  const compReceived = income?.reduce(
    (a, b) => a + Number(b.compensationAndPension),
    0,
  );

  return !pending && (eduReceived || compReceived) ? (
    <>
      <p>This is the VA benefit information we have on file for you.</p>
      {Boolean(compReceived) && (
        <BenefitCard
          title="Disability compensation and pension benefits"
          received={compReceived}
        />
      )}
      {Boolean(eduReceived) && (
        <BenefitCard title="Education benefits" received={eduReceived} />
      )}
      <p>
        <strong>Note:</strong> If this information isn’t right, you can call our
        VA benefits hotline at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </>
  ) : (
    <NoBenefits />
  );
};

Benefits.propTypes = {
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
)(Benefits);
