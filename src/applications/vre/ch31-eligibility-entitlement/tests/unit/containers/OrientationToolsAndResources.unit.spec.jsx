/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import OrientationToolsAndResources from '../../../containers/OrientationToolsAndResources';

const sandbox = sinon.createSandbox();

const makeStore = state => {
  const dispatch = sandbox.spy();
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch,
  };
};

const renderPage = state =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter
        initialEntries={[
          '/careers-employment/your-vre-eligibility/orientation-tools-and-resources',
        ]}
      >
        <Route path="/careers-employment/your-vre-eligibility/orientation-tools-and-resources">
          <OrientationToolsAndResources />
        </Route>
      </MemoryRouter>
    </Provider>,
  );

const makeState = ({ toggleOn = true } = {}) => ({
  featureToggles: {
    loading: false,
    vre_eligibility_status_phase_2_updates: toggleOn,
  },
});

describe('<OrientationToolsAndResources>', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('renders the main heading and intro paragraph', () => {
    const { getByRole, getByText } = renderPage(makeState());
    getByRole('heading', { name: /Orientation Tools and Resources/i });
    getByText(/this page offers all resources/i);
  });

  it('renders all reading material cards and links', () => {
    const { getByText, container } = renderPage(makeState());
    getByText('Reading Material');
    expect(container.querySelectorAll('va-link')).to.have.length.greaterThan(0);
  });

  it('shows SelectPreferenceView by default', () => {
    const { getByText, container } = renderPage(makeState());
    getByText(/Orientation Completion/i);
    getByText(
      /You will need to complete your Orientation by either scheduling a meeting with your local RO, or by watching online the VA Orientation Video/i,
    );
    const vaRadio = container.querySelector(
      'va-radio[label="My preference is to:"]',
    );
    expect(vaRadio).to.exist;

    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
  });

  it('shows WatchVideoView when preference is set', () => {
    // Simulate selecting the Watch Video preference
    const { container, queryByText } = renderPage(makeState());
    const vaRadio = container.querySelector(
      'va-radio[label="My preference is to:"]',
    );
    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    const watchVideoOption = Array.from(radioOptions).find(
      opt =>
        opt.getAttribute('label') === 'Watch the VA Orientation Video online',
    );
    expect(watchVideoOption).to.exist;

    // Simulate click event on the va-radio-option
    watchVideoOption.click();

    // Optionally, assert that it is now checked
    expect(watchVideoOption.hasAttribute('checked'));
    const vaButton = container.querySelector('va-button[text="Submit"]');
    expect(vaButton).to.exist;

    // Simulate click event on the va-button
    vaButton.click();
    queryByText(/You have opted for the Video Tutorial/i);
  });

  it('shows ScheduleMeetingView when preference is set', () => {
    // Simulate selecting the Schedule Meeting preference
    const { container, queryByText } = renderPage(makeState());
    const vaRadio = container.querySelector(
      'va-radio[label="My preference is to:"]',
    );
    const radioOptions = vaRadio.querySelectorAll('va-radio-option');
    const scheduleMeetingOption = Array.from(radioOptions).find(
      opt =>
        opt.getAttribute('label') === 'Schedule a meeting with my local RO',
    );
    expect(scheduleMeetingOption).to.exist;

    // Simulate click event on the va-radio-option
    scheduleMeetingOption.click();

    // Optionally, assert that it is now checked
    expect(scheduleMeetingOption.hasAttribute('checked'));
    const vaButton = container.querySelector('va-button[text="Submit"]');
    expect(vaButton).to.exist;

    // Simulate click event on the va-button
    vaButton.click();
    queryByText(/You have selected to schedule a meeting with your local RO/i);
  });

  it('renders not available message when feature toggle is off', () => {
    const { getByText } = renderPage(makeState({ toggleOn: false }));
    getByText('Orientation Tools and Resources');
    getByText("This page isn't available right now.");
  });
});
