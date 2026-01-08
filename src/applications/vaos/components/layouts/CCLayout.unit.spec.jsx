import { expect } from 'chai';
import { subDays } from 'date-fns';
import React from 'react';
import MockAddress from '../../tests/fixtures/MockAddress';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import CCLayout from './CCLayout';

describe('VAOS Component: CCLayout', () => {
  const initialState = {};

  describe('When appointment information is missing', () => {
    it('should not display heading and text for empty data', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createCCResponse({
        localStartTime: new Date(),
      })
        .setCCLocation(null)
        .setCCTreatingSpecialty(null)
        .setPatientComments(null)
        .setTypeOfCare(null);
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );
      const nullAttributes = {
        type: 'COMMUNITY_CARE_APPOINTMENT',
        modality: 'communityCare',
        isCerner: false,
        'fields-load-success': '',
        'fields-load-fail': 'type-of-care,provider',
      };

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(screen.queryByRole('heading', { level: 2, name: /What/i })).not.to
        .exist;

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Provider information not available/i));
      expect(screen.getByText(/Treatment specialty not available/i));
      expect(screen.getByText(/Address not available/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).not
        .to.exist;

      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === 'span' &&
            content === 'Not available'
          );
        }),
      );
      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });
  });

  describe('When viewing upcoming appointment details', () => {
    it('should display CC layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createCCResponse({
        localStartTime: new Date(),
      })
        .setCCLocation(new MockAddress())
        .setCCTelecom('123-456-7890')
        .setCCTreatingSpecialty('Optometrist')
        .setPatientComments('This is a test:Additional information')
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );
      const nullAttributes = {
        type: 'COMMUNITY_CARE_APPOINTMENT',
        modality: 'communityCare',
        isCerner: false,
        'fields-load-success': 'type-of-care,provider',
        'fields-load-fail': '',
      };

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Community care appointment/i,
        }),
      );
      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).to.be.ok;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test Prov/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;
      const link = screen.getByRole('link', { name: /Directions/i });
      const href = link.getAttribute('href');
      const urlParams = new URLSearchParams(href);
      expect(urlParams.get('daddr')).to.be.ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Reason for appointment/i,
        }),
      );
      expect(screen.getByText(/This is a test:Additional information/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /Bring your insurance cards, a list of your medications, and other things to share with your provider/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
        ),
      ).to.be.ok;
      expect(
        screen.container.querySelector(
          'va-link[text="Find out what to bring to your appointment"]',
        ),
      ).to.be.ok;

      expect(screen.getByText(/Need to make changes/i));

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;

      expect(window.dataLayer).to.deep.include({
        event: 'vaos-null-states',
        ...nullAttributes,
      });
    });
  });

  describe('When viewing past appointment details', () => {
    it('should display CC layout', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createCCResponse({
        localStartTime: subDays(new Date(), 1),
        past: true,
      })
        .setCCLocation(new MockAddress())
        .setCCTelecom('123-456-7890')
        .setCCTreatingSpecialty('Optometrist')
        .setPatientComments('This is a test:Additional information')
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Past community care appointment/i,
        }),
      );
      expect(
        screen.getByRole('heading', { level: 2, name: /After-visit summary/i }),
      );

      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test Prov/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      screen.getByText((content, element) => {
        return (
          element.tagName?.toLowerCase() === 'span' &&
          content === 'City, State 12345'
        );
      });

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Reason for appointment/i,
        }),
      );
      expect(screen.getByText(/This is a test:Additional information/i));

      expect(
        screen.queryByRole('heading', {
          name: /Prepare for your appointment/i,
        }),
      ).not.to.exist;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.to.exist;
    });
  });

  describe('When viewing canceled appointment details', () => {
    it('should display CC layout when in the future', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createCCResponse({
        localStartTime: new Date(),
        future: true,
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setCCLocation(new MockAddress())
        .setCCTelecom('123-456-7890')
        .setCCTreatingSpecialty('Optometrist')
        .setPatientComments('This is a test:Additional information')
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled community care appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /If you still want this appointment, call your community care provider to schedule/i,
        ),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After-visit summary/i,
        }),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test Prov/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      screen.getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'span' &&
          content === 'City, State 12345'
        );
      });

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Reason for appointment/i,
        }),
      );
      expect(screen.getByText(/This is a test:Additional information/i));

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Prepare for your appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /Bring your insurance cards, a list of your medications, and other things to share with your provider/i,
        ),
      );
      expect(
        screen.container.querySelector(
          'va-link[href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"]',
        ),
      ).to.be.ok;
      expect(
        screen.container.querySelector(
          'va-link[text="Find out what to bring to your appointment"]',
        ),
      ).to.be.ok;

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.exist;
    });

    it('should display CC layout when in the past', async () => {
      // Arrange
      const store = createTestStore(initialState);
      const response = MockAppointmentResponse.createCCResponse({
        localStartTime: subDays(new Date(), 1),
        past: true,
        status: APPOINTMENT_STATUS.cancelled,
      })
        .setCCLocation(new MockAddress())
        .setCCTelecom('123-456-7890')
        .setCCTreatingSpecialty('Optometrist')
        .setPatientComments('This is a test:Additional information')
        .setPractitioner();
      const appointment = MockAppointmentResponse.getTransformedResponse(
        response,
      );

      // Act
      const screen = renderWithStoreAndRouter(<CCLayout data={appointment} />, {
        store,
      });

      // Assert
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /Canceled community care appointment/i,
        }),
      );
      expect(
        screen.getByText(
          /If you still want this appointment, call your community care provider to schedule/i,
        ),
      );
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: /After-visit summary/i,
        }),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /When/i }));
      expect(
        screen.container.querySelector('va-button[text="Add to calendar"]'),
      ).not.to.exist;

      expect(screen.getByRole('heading', { level: 2, name: /What/i }));
      expect(screen.getByText(/Primary care/i));

      expect(screen.getByRole('heading', { level: 2, name: /Provider/ }));
      expect(screen.getByText(/Test Prov/i));
      expect(screen.getByText(/Optometrist/i));
      expect(screen.getByText(/line 1/i));
      screen.getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'span' &&
          content === 'City, State 12345'
        );
      });

      expect(screen.container.querySelector('va-icon[icon="directions"]')).to.be
        .ok;

      expect(
        screen.container.querySelector('va-telephone[contact="123-456-7890"]'),
      ).to.be.ok;

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Reason for appointment/i,
        }),
      );
      expect(screen.getByText(/This is a test:Additional information/i));

      expect(screen.container.querySelector('va-button[text="Print"]')).to.be
        .ok;
      expect(
        screen.container.querySelector('va-button[text="Cancel appointment"]'),
      ).not.exist;
    });
  });
});
