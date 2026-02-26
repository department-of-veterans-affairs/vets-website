import React from 'react';
import {
  titleUI,
  checkboxUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { checkboxRequiredSchema } from 'platform/forms-system/src/js/web-component-patterns/checkboxPattern';

export const uiSchema = {
  ...titleUI('The Principles of Excellence'),
  'ui:description': (
    <p>
      Please read through and agree to all of the Principles of Excellence
      listed below.
    </p>
  ),
  principle1: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>1.</span> Provide students who are eligible to receive veteran’s
          education benefits with a personalized College Financing Plan
          (formerly known as the Financial Aid Shopping Sheet) to inform
          students about the total cost of an education program and financial
          aid.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle2: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>2.</span> Inform students who are eligible to receive veterans
          education benefits of the availability and potential eligibility of
          Federal financial aid before packaging or arranging private student
          loans or alternative financing programs.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle3: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>3.</span> Avoid fraudulent and unduly aggressive recruiting
          techniques as well as misrepresentations, payment of incentive
          compensation, and failure to meet State authorization requirements.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle4: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>4.</span> Make sure all new programs are accredited (officially
          approved) before enrolling students.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle5: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>5.</span> Accommodate service members and reservists to be
          readmitted to a program if they are temporarily unable to attend class
          or have to suspend their studies due to service requirements.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle6: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>6.</span> Align institutional refund policies with those under
          Title IV, which governs the administration of Federal student
          financial aid programs.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle7: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>7.</span> Provide educational plans for all military and veteran
          education beneficiaries.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
  principle8: checkboxUI({
    title: 'My institution agrees to commit to this principle',
    description: (
      <div className="vads-u-margin-bottom--2 vads-u-margin-left--4">
        <p className="vads-u-margin-bottom--1 checkbox-text">
          <span>8.</span> Designate a point of contact to provide academic and
          financial advising.
        </p>
      </div>
    ),
    errorMessages: {
      required: 'You must commit to this Principle of Excellence',
    },
    classNames: 'box-highlight vads-u-padding--2 vads-u-margin-bottom--3',
  }),
};

export const schema = {
  type: 'object',
  properties: {
    principle1: checkboxRequiredSchema,
    principle2: checkboxRequiredSchema,
    principle3: checkboxRequiredSchema,
    principle4: checkboxRequiredSchema,
    principle5: checkboxRequiredSchema,
    principle6: checkboxRequiredSchema,
    principle7: checkboxRequiredSchema,
    principle8: checkboxRequiredSchema,
  },
  required: [
    'principle1',
    'principle2',
    'principle3',
    'principle4',
    'principle5',
    'principle6',
    'principle7',
    'principle8',
  ],
};
