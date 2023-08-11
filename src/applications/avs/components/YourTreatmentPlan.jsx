import React from 'react';
import PropTypes from 'prop-types';

import { ORDER_TYPES } from '../utils/constants';

const getOrderItems = (type, orders) => {
  return orders.filter(order => order.type === type.label);
};

const consultations = avs => {
  if (avs.orders?.length > 0) {
    const items = getOrderItems(ORDER_TYPES.CONSULT, avs.orders);
    const orderListItems = items.map((item, idx) => (
      <li key={idx}>{item.text}</li>
    ));

    return (
      <div>
        <h4>Consultations</h4>
        <p>
          You will be contacted by mail or telephone for the following referral:
        </p>
        {orderListItems && <ul>{orderListItems}</ul>}
      </div>
    );
  }

  return null;
};

const imaging = avs => {
  if (avs.orders?.length > 0) {
    const items = getOrderItems(ORDER_TYPES.IMAGING, avs.orders);
    const orderListItems = items.map((item, idx) => (
      <li key={idx}>{item.text}</li>
    ));

    return (
      <div>
        <h4>Imaging</h4>
        <p>
          For CT and MRI scans, you will be contacted by Imaging Service for
          your appointment. For X-Rays and Ultrasounds, please report to Imaging
          Service during normmal working hours to complete your exam. If a
          specific preparation is required, the Technologist will inform you.
        </p>
        {orderListItems && <ul>{orderListItems}</ul>}
      </div>
    );
  }

  return null;
};

const labTests = avs => {
  if (avs.orders?.length > 0) {
    const items = getOrderItems(ORDER_TYPES.LAB, avs.orders);
    const orderListItems = items.map((item, idx) => (
      <li key={idx}>
        {item.text} ({item.date})
      </li>
    ));

    return (
      <div>
        <h4>
          Lab tests: Patients no longer need to fast for most blood draws. Check
          with your provider whether fasting is required before completing your
          Laboratory draws.
        </h4>
        <p>
          Please report to the lab for the following blood tests on the date
          listed for each test:
        </p>
        {orderListItems && <ul>{orderListItems}</ul>}
      </div>
    );
  }

  return null;
};

const medsAndSupplies = avs => {
  if (avs.orders?.length > 0) {
    const items = getOrderItems(ORDER_TYPES.MED, avs.orders);
    const orderListItems = items.map((item, idx) => (
      <li key={idx}>{item.text}</li>
    ));

    return (
      <div>
        <h4>Medications & supplies</h4>
        <p>
          Note: this section <strong>only</strong> lists{' '}
          <strong>changes</strong> to your medication regimen. Please see your
          complete medication list under My Ongoing Care below.
        </p>
        {/* TODO: headings for med change types */}
        {orderListItems && <ul>{orderListItems}</ul>}
      </div>
    );
  }

  return null;
};

const otherOrders = avs => {
  if (avs.orders?.length > 0) {
    const items = getOrderItems(ORDER_TYPES.OTHER, avs.orders);
    const orderListItems = items.map((item, idx) => (
      <li key={idx}>{item.text}</li>
    ));

    return (
      <div>
        <h4>Other orders</h4>
        {orderListItems && <ul>{orderListItems}</ul>}
      </div>
    );
  }

  return null;
};

const patientInstructions = avs => {
  if (avs.patientInstructions) {
    return (
      <div>
        <h4>Other instructions</h4>
        {/* TODO: better way to do this */}
        {/* eslint-disable-next-line react/no-danger */}
        <p dangerouslySetInnerHTML={{ __html: avs.patientInstructions }} />
      </div>
    );
  }

  return null;
};

const YourTreatmentPlan = props => {
  const { avs } = props;

  return (
    <div>
      <h3>New orders from this appointment</h3>
      {/* TODO: is this the correct dataset? (Today vs. all) */}
      {consultations(avs)}
      {imaging(avs)}
      {labTests(avs)}
      {medsAndSupplies(avs)}
      {otherOrders(avs)}
      {patientInstructions(avs)}
    </div>
  );
};

export default YourTreatmentPlan;

YourTreatmentPlan.propTypes = {
  avs: PropTypes.object,
};
