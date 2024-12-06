export const birmingham = {
  banners: [
    {
      id: 28,
      entityId: 75239,
      entityBundle: 'full_width_banner_alert',
      headline: 'Birmingham Outpatient Clinic (Annex) Parking Deck Alert',
      alertType: 'information',
      showClose: false,
      content:
        '<p>Please be aware of the current renovations for the Birmingham Outpatient Clinic (Annex) Parking deck over the next six to seven months. Contractors will initiate construction from the top of the parking deck, progressing downwards through each floor in the following weeks and months.</p>\n',
      context: [
        {
          entity: {
            title: 'Operating status | VA Birmingham health care',
            entityUrl: {
              path: '/birmingham-health-care/operating-status',
            },
            fieldOffice: {
              entity: {
                title: 'VA Birmingham health care',
                entityUrl: {
                  path: '/birmingham-health-care',
                },
                fieldVamcEhrSystem: 'vista',
              },
            },
          },
        },
      ],
      operatingStatusCta: true,
      emailUpdatesButton: true,
      findFacilitiesCta: false,
      limitSubpageInheritance: false,
      createdAt: '2024-12-04T17:36:13.306Z',
      updatedAt: '2024-12-04T17:36:13.306Z',
    },
  ],
  path: '/birmingham-health-care/operating-status',
  bannerType: 'full_width_banner_alert',
};

export const maine = {
  banners: [
    {
      id: 17,
      entityId: 72825,
      entityBundle: 'full_width_banner_alert',
      headline: 'No-Cost VA Flu/COVID Shots for Eligible Veterans',
      alertType: 'information',
      showClose: true,
      content:
        '<p>Visit one of VA Maine\'s upcoming Drive-Up Flu/COVID events to get your flu shot this flu season: <a href="https://www.va.gov/maine-health-care/news-releases/no-cost-va-flu-shots-for-eligible-veterans-0/"><strong>No-Cost VA Flu/COVID Shots for Eligible Veterans</strong>&nbsp;</a></p>\n',
      context: [
        {
          entity: {
            title: 'Operating status | VA Maine health care',
            entityUrl: { path: '/maine-health-care/operating-status' },
            fieldOffice: {
              entity: {
                title: 'VA Maine health care',
                entityUrl: { path: '/maine-health-care' },
                fieldVamcEhrSystem: 'vista',
              },
            },
          },
        },
      ],
      operatingStatusCta: false,
      emailUpdatesButton: false,
      findFacilitiesCta: false,
      limitSubpageInheritance: false,
      createdAt: '2024-12-04T17:36:13.248Z',
      updatedAt: '2024-12-04T17:36:13.248Z',
    },
  ],
  path: '/maine-health-care',
  bannerType: 'full_width_banner_alert',
};
