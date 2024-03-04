// import React from 'react';
// import { expect } from 'chai';
// import { render } from '@testing-library/react';

// import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';

// import MHVDowntime from '../../containers/MHVDowntime';

// describe('MHVDowntime', () => {
//   it('renders MHVDown when a service is down', () => {
//     const now = new Date();
//     const later = new Date(now).setHours(now.getHours() + 4);

//     const mockServiceProps = {
//       endTime: later,
//       startTime: now,
//       externalService: 'mhv_sm',
//     };
//     const mockProps = {
//       status: externalServiceStatus.down,
//       ...mockServiceProps,
//     };
//     const { getByRole, getByText } = render(<MHVDowntime {...mockProps} />);
//     getByRole('heading', { level: 3, name: 'Maintenance on My HealtheVet' });
//     getByText(/some of our health tools/i);
//   });

//  it('renders MHVDowntimeApproaching and children when a service is going down within an hour', () => {
//     // Create a starting datetime 30 minutes into the future, though `status` is what really controls what renders
//     const soon = new Date(Date.now());
//     soon.setMinutes(soon.getMinutes() + 30);
//     const later = new Date(soon).setHours(soon.getHours() + 4);

//     const mockServiceProps = {
//       endTime: later,
//       startTime: soon,
//       externalService: 'mhv_sm',
//     };
//     const mockProps = {
//       status: externalServiceStatus.downtimeApproaching,
//       children: <p>Child content lives here.</p>,
//       ...mockServiceProps,
//     };
//     const { getByRole, getByText } = render(<MHVDowntime {...mockProps} />);
//     getByRole('heading', {
//       level: 3,
//       name: 'Upcoming maintenance on My HealtheVet',
//     });
//     getByText(/you may have trouble using some of our health tools/i);
//     getByText(/child content lives here/i);
//   });

//   it('renders child content when no matching services are down', () => {
//     const mockServiceProps = {
//       endTime: undefined,
//       startTime: undefined,
//       externalService: undefined,
//     };
//     const mockProps = {
//       children: <p>Child content renders</p>,
//       status: externalServiceStatus.ok,
//       ...mockServiceProps,
//     };
//     const { getByText } = render(<MHVDowntime {...mockProps} />);
//     getByText('Child content renders');
//   });

//   it('renders content with vague time interval and no start/end time if no valid dates provided', () => {
//     const mockServiceProps = {
//       endTime: {},
//       startTime: undefined,
//       externalService: 'mhv_sm',
//     };
//     const mockProps = {
//       status: externalServiceStatus.downtimeApproaching,
//       ...mockServiceProps,
//     };

//     const { getByText, queryByText } = render(<MHVDowntime {...mockProps} />);
//     getByText(/The maintenance will last some time/i);
//     getByText(
//       /During this time, you may have trouble using some of our health tools/i,
//     );
//     expect(queryByText('July 4, 2019 at 9:00 a.m. ET')).to.be.null;
//     expect(queryByText('July 5, 2019 at 3:00 a.m. ET')).to.be.null;
//   });

//   it('renders content with vague time interval and start time if end time does not exist', () => {
//     const mockServiceProps = {
//       endTime: {},
//       startTime: new Date('July 4, 2019 09:00:00 EDT'),
//       externalService: 'mhv_sm',
//     };
//     const mockProps = {
//       status: externalServiceStatus.downtimeApproaching,
//       ...mockServiceProps,
//     };

//     const { getByText, queryByText } = render(<MHVDowntime {...mockProps} />);
//     getByText(/The maintenance will last some time/i);
//     getByText(
//       /During this time, you may have trouble using some of our health tools/i,
//     );
//     getByText('July 4, 2019 at 9:00 a.m. ET');
//     expect(queryByText('July 5, 2019 at 3:00 a.m. ET')).to.be.null;
//   });

//   it('renders content with vague time interval and end time if start time does not exist', () => {
//     const mockServiceProps = {
//       endTime: new Date('July 7, 2019 09:00:00 EDT'),
//       startTime: { toDate: () => 'FAKE' },
//       externalService: 'mhv_sm',
//     };
//     const mockProps = {
//       status: externalServiceStatus.downtimeApproaching,
//       ...mockServiceProps,
//     };

//     const { getByText } = render(<MHVDowntime {...mockProps} />);
//     getByText(/The maintenance will last some time/i);
//     getByText(
//       /During this time, you may have trouble using some of our health tools/i,
//     );
//     getByText('July 7, 2019 at 9:00 a.m. ET');
//   });
// });
