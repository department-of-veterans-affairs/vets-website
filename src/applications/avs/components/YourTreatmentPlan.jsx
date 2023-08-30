import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import OrdersBlock from './OrdersBlock';
import { ORDER_TYPES } from '../utils/constants';

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
  const { orders } = avs;

  const medsIntro = (
    <>
      Note: this section <strong>only</strong> lists <strong>changes</strong> to
      your medication regimen. Please see your complete medication list under My
      Ongoing Care below.
    </>
  );

  return (
    <div>
      <h3>New orders from this appointment</h3>
      {/* TODO: is this the correct dataset? (Today vs. all) */}
      <OrdersBlock
        heading="Consultations"
        intro="You will be contacted by mail or telephone for the following referral:"
        orders={orders}
        type={ORDER_TYPES.CONSULT}
      />
      <OrdersBlock
        heading="Imaging"
        intro="For CT and MRI scans, you will be contacted by Imaging Service for
               your appointment. For X-Rays and Ultrasounds, please report to Imaging
               Service during normmal working hours to complete your exam. If a
               specific preparation is required, the Technologist will inform you."
        orders={orders}
        type={ORDER_TYPES.IMAGING}
      />
      <OrdersBlock
        heading="Lab tests: Patients no longer need to fast for most blood draws. Check
                 with your provider whether fasting is required before completing your
                 Laboratory draws."
        intro="Please report to the lab for the following blood tests on the date listed for each test:"
        orders={orders}
        type={ORDER_TYPES.LAB}
      />
      <OrdersBlock
        heading="Medications & supplies"
        intro={medsIntro}
        orders={orders}
        type={ORDER_TYPES.MED}
      />
      <OrdersBlock
        heading="Other orders"
        orders={orders}
        type={ORDER_TYPES.OTHER}
      />
      {/* TODO: add health reminders. */}
      {patientInstructions(avs)}
    </div>
  );
};

export default YourTreatmentPlan;

YourTreatmentPlan.propTypes = {
  avs: PropTypes.object,
};
