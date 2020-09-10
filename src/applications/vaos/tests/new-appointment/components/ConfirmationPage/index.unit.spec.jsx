import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import sinon from 'sinon';
import { ConfirmationPage } from '../../../../new-appointment/components/ConfirmationPage';
import reducers from '../../../../redux/reducer';
import { FLOW_TYPES } from '../../../../utils/constants';
import { renderWithStoreAndRouter } from '../../../mocks/setup';

const start = moment.now();
const end = start;

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

const closeConfirmationPage = sinon.spy();
const fetchFacilityDetails = sinon.spy();
const startNewAppointmentFlow = sinon.spy();

describe('VAOS <ConfirmationPage>', () => {
  it('should render appointment direct schedule view', async () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };

    const screen = renderWithStoreAndRouter(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        flowType={flowType}
        data={data}
        slot={{ start, end }}
        systemId="578"
      />,
      {
        initialState,
        reducers,
      },
    );

    screen.getByText(/Your appointment has been scheduled./i);
    screen.getByText(moment().format('MMMM D, YYYY [at] h:mm a CT'));
  });

  it('should render appointment request view', async () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };

    const screen = renderWithStoreAndRouter(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
        reducers,
      },
    );

    screen.getByText(/Your appointment request has been submitted./i);
  });

  it('should render new appointment page when "New appointment" button is clicked', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };

    const screen = renderWithStoreAndRouter(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        startNewAppointmentFlow={startNewAppointmentFlow}
        flowType={flowType}
        data={data}
      />,
      {
        initialState,
        reducers,
      },
    );

    // Simulate user clicking button
    const button = screen.getByText(/New appointment/i);
    userEvent.click(button);

    // Expect router to route to new appointment page
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('new-appointment');
  });

  it('should render appointment list page when "View your appointments" button is clicked', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {
      typeOfCareId: '323',
      vaFacility: '983',
    };

    const screen = renderWithStoreAndRouter(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        closeConfirmationPage={closeConfirmationPage}
        flowType={flowType}
        data={data}
        startNewAppointmentFlow={startNewAppointmentFlow}
        slot={{ start, end }}
      />,
      {
        initialState,
        reducers,
      },
    );

    // Simulate user clicking button
    const button = screen.getByText(/View your appointments/i);
    userEvent.click(button);

    // Expect router to route to new appointment page
    expect(screen.history.push.called).to.be.true;
    expect(screen.history.push.getCall(0).args[0]).to.equal('/');
  });

  it('should redirect to new appointment page if no form data', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};
    const history = {
      replace: sinon.spy(),
    };

    renderWithStoreAndRouter(
      <ConfirmationPage
        fetchFacilityDetails={fetchFacilityDetails}
        flowType={flowType}
        data={data}
        history={history}
      />,
      {
        initialState,
        reducers,
      },
    );

    // Expect router to route to new appointment page
    expect(history.replace.called).to.be.true;
    expect(history.replace.getCall(0).args[0]).to.equal('/new-appointment');
  });
});
