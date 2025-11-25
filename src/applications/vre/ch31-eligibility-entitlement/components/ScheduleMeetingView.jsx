import React, { useState } from 'react';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaAdditionalInfo,
  VaLink,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const MEETING_TYPE_OPTIONS = {
  ONLINE_MEETING: 'online meeting',
  IN_PERSON_APPOINTMENT: 'in-person appointment',
};

const meetingTypeRadioGroupName = 'meeting_type_preference';

const ORIENTATION_ONLINE_OPTIONS = {
  YES: 'Yes, I prefer completing the Orientation online by watching the video',
  NO: 'No',
};

const orientationOnlineRadioGroupName = 'orientation_online_preference';

export default function ScheduleMeetingView({ setWatchVideoView }) {
  const [meetingTypeRadioValue, setMeetingTypeRadioValue] = useState(
    MEETING_TYPE_OPTIONS.ONLINE_MEETING,
  );
  const [
    orientationOnlineRadioValue,
    setOrientationOnlineRadioValue,
  ] = useState();
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);

  return (
    <>
      <p>You have selected to schedule a meeting with your local RO.</p>
      <p>
        You can either meet them in person, at their office, or you can meet
        them online. Please, select your preference from the radio button down
        below.
      </p>
      <VaRadio
        label="My preference is to:"
        onVaValueChange={e => setMeetingTypeRadioValue(e.detail.value)}
      >
        <VaRadioOption
          label={MEETING_TYPE_OPTIONS.ONLINE_MEETING}
          checked
          name={meetingTypeRadioGroupName}
          value={MEETING_TYPE_OPTIONS.ONLINE_MEETING}
        />
        <VaRadioOption
          label={MEETING_TYPE_OPTIONS.IN_PERSON_APPOINTMENT}
          name={meetingTypeRadioGroupName}
          value={MEETING_TYPE_OPTIONS.IN_PERSON_APPOINTMENT}
        />
      </VaRadio>

      {meetingTypeRadioValue === MEETING_TYPE_OPTIONS.ONLINE_MEETING && (
        <VaAdditionalInfo
          trigger="Additional Information"
          className="vads-u-margin-bottom--1"
        >
          <p>
            Telecounseling uses the VA Video Connect application, which is
            accessible on any web-enabled device, such as a smartphone, tablet,
            or laptop computer, with a webcam and microphone. You will need to
            download the free application and click on Telecounseling link to
            start the meeting. You may contact the National Telehealth
            Technology Helpdesk (NTTHD) at{' '}
            <VaLink href="tel:+18555197116" text="855-519-7116" />,
            Monday-Saturday, 7am-11pm (ET) for technical difficulties or
            additional technical support.
          </p>
          <p>View orientation video at</p>
          <p>
            <VaLink
              href="https://www.websitegoeshere.com"
              text="https://www.websitegoeshere.com"
              external
            />
          </p>
          <p>
            Note: During the Telecounseling initial evaluation appointment, you
            must be in a private setting to ensure confidentiality of your
            personal information and to avoid any distractions. If you wish to
            have anyone present during your appointment, you must sign a release
            of information before the person may attend your appointment. The
            setting must also provide sufficient lightning and noise control. If
            you are driving or a passenger in an automobile during the scheduled
            appointment, the meeting will be immediately canceled or
            rescheduled.
          </p>
        </VaAdditionalInfo>
      )}
      {meetingTypeRadioValue === MEETING_TYPE_OPTIONS.IN_PERSON_APPOINTMENT && (
        <VaAdditionalInfo
          trigger="Additional Information"
          className="vads-u-margin-bottom--1"
        >
          <p>
            If your appointment is in-person appointment at a specified location
          </p>
          <p>
            a) Plan for the initial evaluation appointment to last two hours or
            more as the appointment may also involve career assessment, if you
            did not complete the online career assessment.
          </p>
          <p>b) Do not bring unaccompanied minor children with you.</p>
          <p>
            c) If you have not submitted your required documents prior to your
            scheduled initial evaluation, you may bring the documents outlined.
          </p>
        </VaAdditionalInfo>
      )}
      <VaButton
        onClick={() => {
          if (meetingTypeRadioValue === MEETING_TYPE_OPTIONS.ONLINE_MEETING) {
            setShowSchedulerModal(true);
          }
        }}
        text="Submit"
      />
      {meetingTypeRadioValue && (
        <>
          <VaRadio
            label="Still want to complete your Orientation Online?"
            onVaValueChange={e =>
              setOrientationOnlineRadioValue(e.detail.value)
            }
          >
            <VaRadioOption
              label={ORIENTATION_ONLINE_OPTIONS.NO}
              name={orientationOnlineRadioGroupName}
              value={ORIENTATION_ONLINE_OPTIONS.NO}
            />
            <VaRadioOption
              label={ORIENTATION_ONLINE_OPTIONS.YES}
              name={orientationOnlineRadioGroupName}
              value={ORIENTATION_ONLINE_OPTIONS.YES}
            />
          </VaRadio>
          <VaButton
            onClick={() => {
              if (
                orientationOnlineRadioValue === ORIENTATION_ONLINE_OPTIONS.YES
              ) {
                setWatchVideoView();
              }
            }}
            text="Submit"
          />
        </>
      )}
      <VaModal
        modalTitle="You're leaving VA.gov"
        onCloseEvent={() => setShowSchedulerModal(false)}
        onPrimaryButtonClick={() => {}}
        onSecondaryButtonClick={() => setShowSchedulerModal(false)}
        primaryButtonText="Open Scheduler"
        secondaryButtonText="Go Back"
        visible={showSchedulerModal}
      >
        <p>
          You are about to open the scheduling tool in a new browser tab. This
          site is not part of VA.gov, but you can return here at any time.
        </p>
      </VaModal>
    </>
  );
}

ScheduleMeetingView.propTypes = {
  setWatchVideoView: PropTypes.func.isRequired,
};
