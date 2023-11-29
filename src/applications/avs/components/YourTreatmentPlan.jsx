import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import MedicationTerms from './MedicationTerms';
import OrdersBlock from './OrdersBlock';
import ParagraphBlock from './ParagraphBlock';
import { ORDER_TYPES } from '../utils/constants';

const YourTreatmentPlan = props => {
  const { avs } = props;
  const { orders } = avs;

  const medsIntro = (
    <>
      <p>
        Note: this section <strong>only</strong> lists <strong>changes</strong>{' '}
        to your medication regimen. Please see your complete medication list
        under My Ongoing Care below.
      </p>
      <MedicationTerms avs={avs} />
    </>
  );

  return (
    <div>
      <h3 className="vads-u-margin-top--0">New orders from this appointment</h3>
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
        intro=""
        orders={orders}
        type={ORDER_TYPES.OTHER}
      />
      {/* TODO: add health reminders. */}
      <ParagraphBlock
        heading="Other instructions"
        headingLevel={4}
        content={avs.patientInstructions}
        htmlContent
      />
    </div>
  );
};

export default YourTreatmentPlan;

YourTreatmentPlan.propTypes = {
  avs: PropTypes.object,
};
