import React from 'react';
import PropTypes from 'prop-types';

import { ORDER_TYPES } from '../utils/constants';

const getOrderItems = (type, orders) => {
  return orders?.filter(order => order.type === type.label);
};

const getOrderListItemsByType = (type, orders) => {
  const items = getOrderItems(type, orders);
  return items?.map((item, idx) => <li key={idx}>{item.text}</li>) || [];
};

const consultations = avs => {
  const orderListItems = getOrderListItemsByType(
    ORDER_TYPES.CONSULT,
    avs.orders,
  );
  if (orderListItems.length) {
    return (
      <div>
        <h4>Consultations</h4>
        <p>
          You will be contacted by mail or telephone for the following referral:
        </p>
        <ul className="bulleted-list" data-testid="consultations">
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

const imaging = avs => {
  const orderListItems = getOrderListItemsByType(
    ORDER_TYPES.IMAGING,
    avs.orders,
  );
  if (orderListItems.length) {
    return (
      <div>
        <h4>Imaging</h4>
        <p>
          For CT and MRI scans, you will be contacted by Imaging Service for
          your appointment. For X-Rays and Ultrasounds, please report to Imaging
          Service during normmal working hours to complete your exam. If a
          specific preparation is required, the Technologist will inform you.
        </p>
        <ul className="bulleted-list" data-testid="imaging">
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

const labTests = avs => {
  const orderListItems = getOrderListItemsByType(ORDER_TYPES.LAB, avs.orders);
  if (orderListItems.length) {
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
        <ul className="bulleted-list" data-testid="lab-tests">
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

const medsAndSupplies = avs => {
  const orderListItems = getOrderListItemsByType(ORDER_TYPES.MED, avs.orders);
  if (orderListItems.length) {
    return (
      <div>
        <h4>Medications & supplies</h4>
        <p>
          Note: this section <strong>only</strong> lists{' '}
          <strong>changes</strong> to your medication regimen. Please see your
          complete medication list under My Ongoing Care below.
        </p>
        {/* TODO: headings for med change types */}
        <ul className="bulleted-list" data-testid="medications-and-supplies">
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

const otherOrders = avs => {
  const orderListItems = getOrderListItemsByType(ORDER_TYPES.OTHER, avs.orders);
  if (orderListItems.length) {
    return (
      <div>
        <h4>Other orders</h4>
        <ul className="bulleted-list" data-testid="other-orders">
          {orderListItems}
        </ul>
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
        {/* eslint-disable react/no-danger */}
        {/*
            We're choosing to trust the HTML coming from AVS since it is explicitly
            added there and will give us the highest fidelity with the printed AVS.
            cf. https://github.com/department-of-veterans-affairs/avs/blob/master/ll-avs-web/src/main/java/gov/va/med/lom/avs/client/thread/DelimitedNoteContentThread.java
        */}
        <p
          data-testid="patient-instructions"
          dangerouslySetInnerHTML={{ __html: avs.patientInstructions }}
        />
        {/* eslint-enable react/no-danger */}
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
      {/* TODO: add health reminders. */}
      {patientInstructions(avs)}
    </div>
  );
};

export default YourTreatmentPlan;

YourTreatmentPlan.propTypes = {
  avs: PropTypes.object,
};
