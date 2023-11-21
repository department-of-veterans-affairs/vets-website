import React from 'react';
import { expect } from 'chai';
import { focusElement } from 'platform/utilities/ui';
// import { useHistory } from 'react-router-dom';
// eslint-disable-next-line no-restricted-imports
import { createMemoryHistory } from 'history';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import AppointmentCard from '../AppointmentCard';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';
import { SPACE_BAR } from '../../../../utils/constants';
import { getVAAppointmentLocationId } from '../../../../services/appointment';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  comment: 'Medication Review',
  id: '1234',
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

    const history = createMemoryHistory();
    // const history = useHistory();
    history.push('/home');
    const link = <a href="#">Test Link</a>;
    const facilityId = getVAAppointmentLocationId(appointment);
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

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

  it('should render comment in AppointmentCard', async () => {
    const appointment = {
      ...appointmentData,
      videoData: true,
      vaos: {
        isPastAppointment: true,
      },
    };

    const history = createMemoryHistory();
    // const history = useHistory();
    history.push('/home');
    const link = <a href="#">Test Link</a>;
    const facilityId = getVAAppointmentLocationId(appointment);
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

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
