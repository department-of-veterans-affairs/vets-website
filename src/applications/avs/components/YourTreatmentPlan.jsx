import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ItemsBlock from './ItemsBlock';
import ListBlock from './ListBlock';
import MedicationTerms from './MedicationTerms';
import OrdersBlock from './OrdersBlock';
import ParagraphBlock from './ParagraphBlock';
import { ORDER_TYPES } from '../utils/constants';
import { allArraysEmpty } from '../utils';

const YourTreatmentPlan = props => {
  const { avs } = props;
  const { medChangesSummary, orders } = avs;

  const medChanges = !allArraysEmpty(medChangesSummary)
    ? medChangesSummary
    : null;

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

  const renderReminder = reminder => {
    return (
      <p>
        {reminder.name}
        <br />
        When due: {reminder.whenDue}
        <br />
        Frequency: {reminder.frequency}
      </p>
    );
  };

  return (
    <div>
      {orders && (
        <h3 className="vads-u-margin-top--0" data-testid="new-orders-heading">
          New orders from this appointment
        </h3>
      )}
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
      <ItemsBlock
        heading="Health reminders"
        intro="The list below is your health reminders. These are health checks for prevention care (for example cancer screening) and checks on chronic conditions like diabetes. Your primary care provider and team will see this list in the computer and should discuss them with you."
        itemType="health-reminders"
        items={avs.clinicalReminders}
        renderItem={renderReminder}
        showSeparators
      />
      <ParagraphBlock
        heading="Other instructions"
        headingLevel={4}
        content={avs.patientInstructions}
        htmlContent
      />
      {medChanges && <h3>Summary of medication changes</h3>}
      <ListBlock
        heading="Start these medications and supplies"
        headingLevel={4}
        itemType="new-medications-list"
        items={medChanges?.newMedications}
      />
      <ListBlock
        heading="Stop these medications and supplies"
        headingLevel={4}
        itemType="discontinued-medications-list"
        items={medChanges?.discontinuedMeds}
      />
      <ListBlock
        heading="Follow new instructions for these medications and supplies"
        headingLevel={4}
        itemType="changed-medications-list"
        items={medChanges?.changedMedications}
      />
    </div>
  );
};

export default YourTreatmentPlan;

YourTreatmentPlan.propTypes = {
  avs: PropTypes.object,
};
