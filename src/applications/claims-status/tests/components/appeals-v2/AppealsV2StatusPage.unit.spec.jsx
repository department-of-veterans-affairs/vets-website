import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  MemoryRouter,
  Outlet,
  Routes,
  Route,
} from 'react-router-dom-v5-compat';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { mockData } from '../../../utils/helpers';
import { APPEAL_ACTIONS } from '../../../utils/appeals-v2-helpers';

import AppealsV2StatusPage from '../../../containers/AppealsV2StatusPage';

const defaultAppeal = mockData.data[0];
const onDocketAppeal = mockData.data[1];
const supplementalClaim = mockData.data[3];
const higherLevelReview = mockData.data[4];
const amaAppeal = mockData.data[5];
const closedAmaAppeal = mockData.data[6];

const store = createStore(() => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    claim_letters_access: true,
  },
}));

const docketHeader = 'How long until a judge is ready for your appeal?';

describe('<AppealsV2StatusPage>', () => {
  it('renders', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[defaultAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect($('#tabPanelv2status', container)).to.exist;
  });

  it('should render the <Timeline> component', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[defaultAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect($('ol#appeal-timeline', container)).to.exist;
  });

  it('should render a <CurrentStatus> component', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[defaultAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    screen.getByText('Current status');
  });

  it('should render the <AlertsList> component', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[defaultAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect($('ul.alerts-list', container)).to.exist;
  });

  it('should render the <WhatsNext> component', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[onDocketAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    screen.getByText('What happens next?');
  });

  it('should render a <Docket> when applicable', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[onDocketAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    screen.getByText(docketHeader);
  });

  it('should not render a <Docket> when appeal status is a forbidden type', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[defaultAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });

  it('should not render a <Docket> when appeal type is a forbidden type', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const appeal = {
      ...defaultAppeal,
      attributes: {
        ...defaultAppeal.attributes,
        type: APPEAL_ACTIONS.cue,
      },
    };

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[appeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });

  it('should not render a <Docket> when appeal is closed', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const appeal = {
      ...defaultAppeal,
      attributes: { ...defaultAppeal.attributes, active: false },
    };

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[appeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });

  it('should not render a <Docket> when appeal is a Supplemental Claim', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[supplementalClaim]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });

  it('should not render a <Docket> when appeal is a Higher-Level Review', () => {
    // The appeal in defaultProps has a status of pending_soc, so the docket shouldn't be shown
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[higherLevelReview]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });

  it('should render a <Docket> when appeal is a Board Appeal', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[amaAppeal]} />}>
            <Route index element={<AppealsV2StatusPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    screen.getByText(docketHeader);
  });

  it('should not render a <Docket> when a Board Appeal has left the Board', () => {
    const appeal = {
      ...closedAmaAppeal,
      attributes: {
        ...closedAmaAppeal.attributes,
        active: true,
        location: 'aoj',
      },
    };

    const elem = (
      <Provider store={store}>
        <AppealsV2StatusPage />
      </Provider>
    );

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[appeal]} />}>
            <Route index element={elem} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });

  it('should not render a <Docket> when appeal is a closed Board Appeal', () => {
    const elem = (
      <Provider store={store}>
        <AppealsV2StatusPage />
      </Provider>
    );

    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[closedAmaAppeal]} />}>
            <Route index element={elem} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(docketHeader)).to.not.be.true;
  });
});
