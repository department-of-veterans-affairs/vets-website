import React from 'react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import UrgentCareInformationPage from './UrgentCareInformationPage';

describe('VAOS Page: UrgentCareInformationPage', () => {
  beforeEach(() => mockFetch());

  it('should show page', async () => {
    // Arrange
    const store = createTestStore();

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      store,
    });

    // Assert
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Only schedule appointments for non-urgent needs/i,
      }),
    );
    expect(
      screen.getByText(
        /You can schedule or request non-urgent appointments for future dates./i,
      ),
    );
    expect(
      screen.getByRole('link', { name: /Start scheduling an appointment/i }),
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /If you need help sooner, use one of these urgent communications options:/i,
      }),
    );
    expect(screen.getByRole('link', { name: /urgent care facility/i }));
    expect(
      screen.getByRole('link', {
        name: /Learn how to choose between urgent and emergency care/i,
      }),
    );
  });

  it('should continue to the type of care page', async () => {
    // Arrange
    const store = createTestStore();

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      store,
    });

    const link = screen.getByRole('link', {
      name: 'Start scheduling an appointment',
    });
    link.click();

    // Assert
    expect(screen.history.push.lastCall?.args[0]).to.equal(
      '/schedule/type-of-care',
    );
  });
});

describe('When user is registered at a single transitioning facility only', () => {
  beforeEach(() => mockFetch());

  it('should display migration warning alert', async () => {
    // Arrange
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: true }],
          // vapContactInfo: {
          //   residentialAddress: {
          //     addressLine1: '123 big sky st',
          //     city: 'Cincinnati',
          //     stateCode: 'OH',
          //     zipCode: '45220',
          //     latitude: 39.1,
          //     longitude: -84.6,
          //   },
          // },
          migrationSchedules: [
            {
              migrationDate: '2026-05-01',
              facilities: [
                {
                  facilityId: '983',
                  facilityName: 'Test VA Medical Center 1',
                },
              ],
              phases: {
                current: 'p1',
                p0: 'March 1, 2026',
                p1: 'March 15, 2026',
                p2: 'April 1, 2026',
                p3: 'April 24, 2026',
                p4: 'April 27, 2026',
                p5: 'May 1, 2026', // Migration start
                p6: 'May 3, 2026',
                p7: 'May 8, 2026', // Migration end
              },
            },
            {
              migrationDate: '2026-03-01',
              facilities: [
                {
                  id: '565',
                  name: 'One More VA Medical Center',
                },
              ],
              phases: {
                current: 'p5',
                p0: 'January 1, 2026',
                p1: 'January 15, 2026',
                p2: 'February 1, 2026',
                p3: 'February 24, 2026',
                p4: 'February 27, 2026',
                p5: 'March 1, 2026',
                p6: 'March 3, 2026',
                p7: 'March 8, 2026',
              },
            },
          ],
        },
      },
    };

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      initialState,
    });
    screen.debug();
    screen.getByText(/From 2026/i);
    screen.getByRole('link', {
      name: /Find a VA health facility Link opens in a new tab/i,
    });
  });

  it('should display migration error alert without scheduling link', async () => {
    // Arrange
    const initialState = {
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: true }],
          migrationSchedules: [
            {
              migrationDate: '2026-05-01',
              facilities: [
                {
                  facilityId: '983',
                  facilityName: 'Test VA Medical Center 1',
                },
              ],
              phases: {
                current: 'p2',
                p0: 'March 1, 2026',
                p1: 'March 15, 2026',
                p2: 'April 1, 2026',
                p3: 'April 24, 2026',
                p4: 'April 27, 2026',
                p5: 'May 1, 2026', // Migration start
                p6: 'May 3, 2026',
                p7: 'May 8, 2026', // Migration end
              },
            },
            {
              migrationDate: '2026-03-01',
              facilities: [
                {
                  id: '565',
                  name: 'One More VA Medical Center',
                },
              ],
              phases: {
                current: 'p5',
                p0: 'January 1, 2026',
                p1: 'January 15, 2026',
                p2: 'February 1, 2026',
                p3: 'February 24, 2026',
                p4: 'February 27, 2026',
                p5: 'March 1, 2026',
                p6: 'March 3, 2026',
                p7: 'March 8, 2026',
              },
            },
          ],
        },
      },
    };

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      initialState,
    });

    // Assert
    screen.getByRole('heading', {
      name: /You can.t schedule at Test VA Medical Center 1 right now/i,
    });
    screen.getByText(/Scheduling online is unavailable until/i);
    screen.getByRole('link', {
      name: /Find a VA health facility Link opens in a new tab/i,
    });
  });
});

describe('When user is registered at multiple transitioning facilities only', () => {
  beforeEach(() => mockFetch());

  it('should display migration warning alert', async () => {
    // Arrange
    const initialState = {
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: true },
            { facilityId: '984', isCerner: true },
          ],
          migrationSchedules: [
            {
              migrationDate: '2026-05-01',
              facilities: [
                {
                  facilityId: '983',
                  facilityName: 'Test VA Medical Center 1',
                },
                {
                  facilityId: '984',
                  facilityName: 'Test VA Medical Center 2',
                },
              ],
              phases: {
                current: 'p1',
                p0: 'March 1, 2026',
                p1: 'March 15, 2026',
                p2: 'April 1, 2026',
                p3: 'April 24, 2026',
                p4: 'April 27, 2026',
                p5: 'May 1, 2026', // Migration start
                p6: 'May 3, 2026',
                p7: 'May 8, 2026', // Migration end
              },
            },
            {
              migrationDate: '2026-03-01',
              facilities: [
                {
                  id: '565',
                  name: 'One More VA Medical Center',
                },
              ],
              phases: {
                current: 'p5',
                p0: 'January 1, 2026',
                p1: 'January 15, 2026',
                p2: 'February 1, 2026',
                p3: 'February 24, 2026',
                p4: 'February 27, 2026',
                p5: 'March 1, 2026',
                p6: 'March 3, 2026',
                p7: 'March 8, 2026',
              },
            },
          ],
        },
      },
    };

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      initialState,
    });

    // Assert
    expect(screen.getByText(/From 2026/i)).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: /Find a VA health facility Link opens in a new tab/i,
      }),
    ).to.be.ok;
    expect(
      screen.queryByRole('link', { name: /Start scheduling an appointment/ }),
    ).not.to.exist;
  });

  it('should display migration error alert without scheduling link', async () => {
    // Arrange
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: true,
      },
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: true },
            { facilityId: '984', isCerner: true },
          ],
          migrationSchedules: [
            {
              migrationDate: '2026-05-01',
              facilities: [
                {
                  facilityId: '983',
                  facilityName: 'Test VA Medical Center 1',
                },
                {
                  facilityId: '984',
                  facilityName: 'Test VA Medical Center 2',
                },
              ],
              phases: {
                current: 'p2',
                p0: 'March 1, 2026',
                p1: 'March 15, 2026',
                p2: 'April 1, 2026',
                p3: 'April 24, 2026',
                p4: 'April 27, 2026',
                p5: 'May 1, 2026', // Migration start
                p6: 'May 3, 2026',
                p7: 'May 8, 2026', // Migration end
              },
            },
            {
              migrationDate: '2026-03-01',
              facilities: [
                {
                  id: '565',
                  name: 'One More VA Medical Center',
                },
              ],
              phases: {
                current: 'p5',
                p0: 'January 1, 2026',
                p1: 'January 15, 2026',
                p2: 'February 1, 2026',
                p3: 'February 24, 2026',
                p4: 'February 27, 2026',
                p5: 'March 1, 2026',
                p6: 'March 3, 2026',
                p7: 'March 8, 2026',
              },
            },
          ],
        },
      },
    };

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      initialState,
    });

    // Assert
    expect(
      screen.getByRole('heading', {
        name: /You can.t schedule at some facilities right now/i,
      }),
    ).to.be.ok;
    expect(screen.getByText(/Scheduling online is unavailable until/i)).to.be
      .ok;
    expect(screen.getByText(/Test VA Medical Center 1/)).to.be.ok;
    expect(screen.getByText(/Test VA Medical Center 2/)).to.be.ok;
    expect(
      screen.queryByRole('link', { name: /Start scheduling an appointment/ }),
    ).not.to.exist;
    expect(
      screen.getByRole('link', {
        name: /Find a VA health facility Link opens in a new tab/i,
      }),
    ).to.be.ok;
  });
});

describe('When user is registered at mixed transitioning/non-transitioning facilities', () => {
  const initialState = {
    user: {
      profile: {
        facilities: [
          { facilityId: '983', isCerner: true },
          { facilityId: '984', isCerner: true },
        ],
        migrationSchedules: [
          {
            migrationDate: '2026-05-01',
            facilities: [
              {
                facilityId: '983',
                facilityName: 'Test VA Medical Center 1',
              },
            ],
            phases: {
              current: 'p2',
              p0: 'March 1, 2026',
              p1: 'March 15, 2026',
              p2: 'April 1, 2026',
              p3: 'April 24, 2026',
              p4: 'April 27, 2026',
              p5: 'May 1, 2026', // Migration start
              p6: 'May 3, 2026',
              p7: 'May 8, 2026', // Migration end
            },
          },
          {
            migrationDate: '2026-03-01',
            facilities: [
              {
                id: '565',
                name: 'One More VA Medical Center',
              },
            ],
            phases: {
              current: 'p5',
              p0: 'January 1, 2026',
              p1: 'January 15, 2026',
              p2: 'February 1, 2026',
              p3: 'February 24, 2026',
              p4: 'February 27, 2026',
              p5: 'March 1, 2026',
              p6: 'March 3, 2026',
              p7: 'March 8, 2026',
            },
          },
        ],
      },
    },
  };
  beforeEach(() => mockFetch());

  it('should display migration warning alert', async () => {});

  it('should display migration warning alert with scheduling link', async () => {
    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      initialState,
    });

    // Assert
    expect(
      screen.getByRole('heading', {
        name: /You can.t schedule at Test VA Medical Center 1 right now/i,
      }),
    ).to.be.ok;
    expect(screen.getByText(/Scheduling online is unavailable until/i)).to.be
      .ok;
    expect(
      screen.queryByRole('link', { name: /Start scheduling an appointment/ }),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: /Find a VA health facility Link opens in a new tab/i,
      }),
    ).to.be.ok;
  });
});
