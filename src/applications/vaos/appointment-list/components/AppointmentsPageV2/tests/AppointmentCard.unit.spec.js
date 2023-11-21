import React from 'react';
import { expect } from 'chai';
import { focusElement } from 'platform/utilities/ui';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '../AppointmentCard';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';
import { SPACE_BAR } from '../../../../utils/constants';
import { getVAAppointmentLocationId } from '../../../../services/appointment';
import { useHistory } from 'react-router-dom';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  vaos: {
    isPastAppointment: true,
  },
  location: {
    vistaId: '983',
    clinicId: '848',
    stationId: '983',
    clinicName: 'CHY PC VAR2',
  },
};

const facilityData = new Facility();
function handleClick({ history, link, idClickable }) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

function handleKeyDown({ history, link, idClickable }) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

describe('AppointmentCard component', () => {
  const initialState = { featureToggles: {} };
  const history = useHistory();
  const link = <a href="#">Test Link</a>;

  it('should render comment in AppointmentCard', async () => {
    const appointment = {
      ...appointmentData,
      videoData: {
        isVideo: true,
        isAtlas: false,
        extension: { patientHasMobileGfe: true },
        kind: 'MOBILE_ANY',
      },
      vaos: {
        isPastAppointment: true,
      },
    };

    const facilityId = getVAAppointmentLocationId(appointment);
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

    // const props = { appointment, facilityData };
    const wrapper = renderWithStoreAndRouter(
      <AppointmentCard
        appointment={appointment}
        facility={facilityData[facilityId]}
        link={link}
        handleClick={() => handleClick({ history, link, idClickable })}
        handleKeyDown={() => handleKeyDown({ history, link, idClickable })}
      />,
      {
        initialState,
      },
    );

    expect(
      await wrapper.queryByRole('heading', {
        level: 2,
        name: 'You shared these details about your concern',
      }),
    ).to.be.null;
  });
});
