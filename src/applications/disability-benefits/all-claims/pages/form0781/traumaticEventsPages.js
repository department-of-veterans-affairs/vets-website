import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { isCompletingForm0781 } from '../../utils/form0781';
import eventDetails from './traumaticEventDetails';
import officialReport from './officialReport';
import policeReport from './policeReportLocation';
import {
  eventsListPageTitle,
  eventsListDescription,
  maxEventsAlert,
} from '../../content/traumaticEventsList';
import { eventDetailsPageTitle } from '../../content/traumaticEventDetails';
import { officialReportPageTitle } from '../../content/officialReport';
import { policeReportLocationPageTitle } from '../../content/policeReportLocation';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import { OFFICIAL_REPORT_TYPES } from '../../constants';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'events',
  nounSingular: 'event',
  nounPlural: 'events',
  useButtonInsteadOfYesNo: true,
  required: false,
  maxItems: 20,
  text: {
    summaryTitle: titleWithTag(eventsListPageTitle, form0781HeadingTag),
    summaryTitleWithoutItems: titleWithTag(
      eventsListPageTitle,
      form0781HeadingTag,
    ),
    summaryDescription: eventsListDescription,
    summaryDescriptionWithoutItems: eventsListDescription,
    getItemName: (props, index) => {
      return `Event #${index + 1}`;
    },
    cardDescription: item => {
      const selectedReports = Object.entries(item?.reports || {})
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => OFFICIAL_REPORT_TYPES[key]);
      if (item?.otherReports) {
        selectedReports.push(item.otherReports);
      }
      const reportsDescription = selectedReports.join(', ');
      return (
        <div>
          <p className="multiline-ellipsis-4">
            <strong>Description:</strong> {item?.details}
          </p>
          <p className="multiline-ellipsis-2">
            <strong>Location:</strong> {item?.location}
          </p>
          <p className="multiline-ellipsis-2">
            <strong>Date:</strong> {item?.timing}
          </p>
          <p className="multiline-ellipsis-2">
            <strong>Official Report:</strong> {reportsDescription}
          </p>
        </div>
      );
    },
    summaryAddButtonText: 'Add an event',
    alertMaxItems: maxEventsAlert,
    alertItemUpdated: props => {
      return `You’ve edited details about Event #${props.index + 1}`;
    },
    alertItemDeleted: props => {
      return `You’ve deleted details about Event #${props.index + 1}`;
    },
    cancelAddTitle: 'Are you sure you want to cancel adding this event?',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding this event',
    cancelEditButtonText: 'Cancel editing this event',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made on this screen.',
    cancelEditNo: 'No, continue editing',
    cancelEditTitle: 'Are you sure you want to cancel editing this event?',
    deleteTitle: 'Are you sure you want to delete this event?',
    deleteDescription:
      'If you delete this event, you’ll lose the information you entered about this event.',
    deleteYes: 'Yes, delete',
    deleteNo: 'No, keep this event',
  },
};

export const traumaticEventsPages = arrayBuilderPages(options, pageBuilder => ({
  eventsList: pageBuilder.summaryPage({
    title: titleWithTag(eventsListPageTitle, form0781HeadingTag),
    path: 'mental-health-form-0781/events-summary',
    depends: formData => isCompletingForm0781(formData),
    ContentBeforeButtons: (
      <div className="vads-u-margin-y--2p5">{mentalHealthSupportAlert()}</div>
    ),
  }),
  eventDetails: pageBuilder.itemPage({
    title: titleWithTag(eventDetailsPageTitle, form0781HeadingTag),
    path: 'mental-health-form-0781/:index/event-details',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: eventDetails.uiSchema,
    schema: eventDetails.schema,
  }),
  officialReport: pageBuilder.itemPage({
    title: titleWithTag(officialReportPageTitle, form0781HeadingTag),
    path: `mental-health-form-0781/:index/event-report`,
    depends: (formData, index) =>
      isCompletingForm0781(formData) && formData.events?.[index],
    uiSchema: officialReport.uiSchema,
    schema: officialReport.schema,
  }),
  policeReport: pageBuilder.itemPage({
    title: titleWithTag(policeReportLocationPageTitle, form0781HeadingTag),
    path: `mental-health-form-0781/:index/event-police-report`,
    depends: (formData, index) =>
      isCompletingForm0781(formData) &&
      formData.events?.[index]?.reports?.police,
    uiSchema: policeReport.uiSchema,
    schema: policeReport.schema,
  }),
}));
