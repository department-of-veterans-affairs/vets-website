import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { FLOW_TYPES } from '../../../../utils/constants';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '../../../mocks/setup';
import reducers from '../../../../redux/reducer';
import moment from 'moment';

import { ConfirmationPage } from '../../../../new-appointment/components/ConfirmationPage';

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

// Fixes error:
// Unable to find an element with the text: Hello world.
// This could be because the text is broken up by multiple elements.
// In this case, you can provide a function for your text
// matcher to make your matcher more flexible.
// see https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
const withHtmlTags = query => {
  return (content, node) => {
    const hasText = n => {
      return n.textContent === query;
    };
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(
      child => !hasText(child),
    );
    return nodeHasText && childrenDontHaveText;
  };
};

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

    await screen.findAllByText(/Your appointment has been scheduled/i);
    await screen.findByText(
      withHtmlTags(moment().format('MMMM D, YYYY [at] h:mm a CT')),
    );
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

    await screen.findByText(
      withHtmlTags('Your appointment request has been submitted'),
    );
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
    fireEvent.click(button);

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
    fireEvent.click(button);

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
