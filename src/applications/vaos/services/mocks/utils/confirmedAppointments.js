/* eslint-disable no-plusplus */
const { startOfDay } = require('date-fns');

/**
 * Finds the next business day (Monday-Friday) from the given date.
 *
 * @param {Date} [fromDate=new Date()] - The starting date to find the next business day from.
 * @returns {Date} The next business day date.
 */
const findNextBusinessDay = (fromDate = new Date()) => {
  const date = new Date(fromDate);

  // Start from the next day
  date.setDate(date.getDate() + 1);

  // Keep advancing until we hit a weekday (Monday = 1, Friday = 5)
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

/**
 * Generates a random alphanumeric ID with an optional prefix.
 *
 * @param {string} [prefix=''] - Optional prefix to prepend to the generated ID.
 * @returns {string} A random ID string of 8 characters plus the prefix.
 */
const generateRandomId = (prefix = '') => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a random date within business hours for a given month offset.
 *
 * @param {number} monthsOffset - The number of months to offset from the current month.
 * @returns {Date} A random date within business hours (8 AM - 5 PM, 15-minute intervals).
 */
const generateRandomBusinessDate = monthsOffset => {
  const now = new Date();
  const targetMonth = new Date(
    now.getFullYear(),
    now.getMonth() + monthsOffset,
    1,
  );

  // Random day in the month (1-28 to avoid month boundary issues)
  const randomDay = Math.floor(Math.random() * 28) + 1;

  // Random business hour (8 AM - 5 PM)
  const randomHour = Math.floor(Math.random() * 9) + 8;

  // Random 15-minute interval (0, 15, 30, 45)
  const randomMinuteInterval = Math.floor(Math.random() * 4) * 15;

  return new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    randomDay,
    randomHour,
    randomMinuteInterval, // Minutes in 15-minute intervals
    0, // Seconds
  );
};

/**
 * Formats a date for appointment data with optional hour offset.
 *
 * @param {Date} date - The date to format.
 * @param {number} [offsetHours=0] - Number of hours to offset the date.
 * @returns {string} ISO string formatted date without milliseconds.
 */
const formatAppointmentDate = (date, offsetHours = 0) => {
  const adjustedDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
  return adjustedDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Formats a date to local time with timezone offset.
 *
 * @param {Date} date - The date to format.
 * @param {string} [timezone='-06:00'] - The timezone offset string.
 * @returns {string} ISO string formatted date with timezone offset.
 */
const formatLocalTime = (date, timezone = '-06:00') => {
  const localDate = new Date(date.getTime() - 6 * 60 * 60 * 1000); // Assume Central Time
  return localDate.toISOString().replace('Z', `.000${timezone}`);
};

// Appointment status configurations
const appointmentStatuses = {
  booked: {
    status: 'booked',
    weight: 0.85, // 85% of appointments are booked
    vistaStatus: ['FUTURE'],
    cancelationReason: null,
  },
  cancelled: {
    status: 'cancelled',
    weight: 0.15, // 15% of appointments are cancelled
    vistaStatus: ['CANCELLED BY PATIENT', 'CANCELLED BY CLINIC'],
    cancelationReason: [
      {
        coding: [
          {
            system: 'http://www.va.gov/Terminology/VistADefinedTerms/409.2',
            code: 'pat',
            display: 'The appointment was cancelled by the patient',
          },
        ],
      },
      {
        coding: [
          {
            system: 'http://www.va.gov/Terminology/VistADefinedTerms/409.2',
            code: 'clinic',
            display: 'The appointment was cancelled by the clinic',
          },
        ],
      },
      null, // Some cancelled appointments have no reason
    ],
  },
};

/**
 * Determines if the appointment is a CNP appointment.
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} Whether the appointment is a CNP appointment.
 */
const isCNP = appointment => {
  const serviceCategory = (appointment.serviceCategory || []).map(
    category => category.text,
  );
  return serviceCategory.includes('Compensation & Pension');
};

/**
 * Determines if the appointment is a COVID appointment.
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} Whether the appointment is a COVID appointment.
 */
const isCovid = appointment => {
  return appointment.serviceType === 'covid';
};

/**
 * Determines if the appointment is a past appointment.
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} Whether the appointment is a past appointment.
 */
const isPast = appointment => {
  return appointment.past;
};

/**
 * Determines if the appointment is a cancelled appointment.
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} Whether the appointment is a cancelled appointment.
 */
const isCancelled = appointment => {
  return appointment.status === 'cancelled';
};

/**
 * Determines if the appointment is a booked CC appointment.
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} Whether the appointment is a booked CC appointment.
 */
const isBookedCC = appointment => {
  return appointment.kind === 'cc' && appointment.status === 'booked';
};

/**
 * Determines if the appointment is a telehealth appointment.
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} Whether the appointment is a telehealth appointment.
 */
const isTelehealth = appointment => {
  return appointment.kind === 'telehealth';
};

/**
 * Determines appointment cancelable status.
 * Appointments cannot be cancelled if they are:
 * - CNP (Compensation & Pension)
 * - Covid
 * - Past
 * - Cancelled
 * - Telehealth
 * - CC and booked
 *
 * @param {object} appointment - The appointment object.
 * @returns {boolean} The cancelable status.
 */
const getCancellableStatus = appointment => {
  return (
    !isPast(appointment) &&
    !isCancelled(appointment) &&
    !isBookedCC(appointment) &&
    !isTelehealth(appointment) &&
    !isCNP(appointment) &&
    !isCovid(appointment)
  );
};

/**
 * Determines appointment status based on weighted probabilities.
 *
 * @param {object} appointment - The appointment object.
 * @param {boolean} isPastAppointment - Whether the appointment is in the past.
 * @returns {Object} Object containing status, cancellable flag, cancellation reason, and vista status.
 */
const getAppointmentStatus = (appointment, isPastAppointment) => {
  const rand = Math.random();
  let cumulative = 0;

  for (const [statusKey, config] of Object.entries(appointmentStatuses)) {
    cumulative += config.weight;
    if (rand <= cumulative) {
      const isCancelledAppointment = statusKey === 'cancelled';
      const cancellable = getCancellableStatus(appointment);

      let cancelationReason = null;
      let vistaStatus = config.vistaStatus[0]; // Default vista status

      if (isCancelledAppointment) {
        // Random cancellation reason for cancelled appointments
        const reasons = config.cancelationReason;
        cancelationReason = reasons[Math.floor(Math.random() * reasons.length)];

        // Choose vista status based on cancellation reason
        if (cancelationReason?.coding?.[0]?.code === 'pat') {
          vistaStatus = 'CANCELLED BY PATIENT';
        } else if (cancelationReason?.coding?.[0]?.code === 'clinic') {
          vistaStatus = 'CANCELLED BY CLINIC';
        } else {
          vistaStatus =
            config.vistaStatus[
              Math.floor(Math.random() * config.vistaStatus.length)
            ];
        }
      } else if (isPastAppointment) {
        vistaStatus = 'CHECKED OUT';
      }

      return {
        status: config.status,
        cancellable,
        cancelationReason,
        vistaStatus: [vistaStatus],
      };
    }
  }

  // Fallback to booked status
  return {
    status: 'booked',
    cancellable: getCancellableStatus(appointment),
    cancelationReason: null,
    vistaStatus: isPastAppointment ? ['CHECKED OUT'] : ['FUTURE'],
  };
};

// Practitioner templates
const practitioners = [
  {
    name: { family: 'Smith', given: ['Dr. John'] },
    identifier: '1801312053',
  },
  {
    name: { family: 'Johnson', given: ['Dr. Sarah'] },
    identifier: '1801312054',
  },
  {
    name: { family: 'Williams', given: ['Dr. Michael'] },
    identifier: '1801312055',
  },
  {
    name: { family: 'Brown', given: ['Dr. Emily'] },
    identifier: '1801312056',
  },
  {
    name: { family: 'Davis', given: ['Dr. Robert'] },
    identifier: '1801312057',
  },
];

// Service type configurations
const serviceTypes = {
  primaryCare: {
    name: 'Primary Care',
    duration: 60,
    clinics: ['455', '437', '849'],
    description: 'Primary care appointment',
  },
  outpatientMentalHealth: {
    name: 'Mental Health',
    duration: 60,
    clinics: ['1049', '848', '950'],
    description: 'Mental health consultation',
  },
  audiology: {
    name: 'Audiology',
    duration: 45,
    clinics: ['723', '724', '725'],
    description: 'Hearing evaluation and care',
  },
  covid: {
    name: 'COVID-19',
    duration: 30,
    clinics: ['437', '438', '439'],
    description: 'COVID-19 vaccination or screening',
  },
  foodAndNutrition: {
    name: 'Nutrition',
    duration: 45,
    clinics: ['601', '602', '603'],
    description: 'Nutrition counseling',
  },
  optometry: {
    name: 'Eye Care',
    duration: 45,
    clinics: ['501', '502', '503'],
    description: 'Eye examination and care',
  },
  amputation: {
    name: 'Amputation Care',
    duration: 60,
    clinics: ['801', '802', '803'],
    description: 'Specialized amputation care',
  },
  cpap: {
    name: 'CPAP',
    duration: 30,
    clinics: ['701', '702', '703'],
    description: 'CPAP equipment and consultation',
  },
  clinicalPharmacyPrimaryCare: {
    name: 'Clinical Pharmacy',
    duration: 30,
    clinics: ['901', '902', '903'],
    description: 'Pharmacy consultation',
  },
};

// Appointment type templates
const appointmentTemplates = {
  cc: {
    getTemplate: (_, startDate) => {
      const appointmentId = generateRandomId();
      const isPastAppointment = startDate < new Date();

      // Create temporary appointment to determine status
      const temporaryAppointment = {
        id: appointmentId,
        type: 'appointments',
        attributes: {
          kind: 'cc',
          modality: 'communityCareEps',
          past: isPastAppointment,
        },
      };

      // Get status info (15% chance of cancelled)
      const statusInfo = getAppointmentStatus(
        temporaryAppointment.attributes,
        isPastAppointment,
      );

      return {
        id: appointmentId,
        type: 'appointments',
        attributes: {
          id: appointmentId,
          status: statusInfo.status,
          cancelationReason: statusInfo.cancelationReason,
          patientIcn: null,
          modality: 'communityCareEps',
          kind: 'cc',
          type: 'COMMUNITY_CARE_APPOINTMENT',
          start: formatAppointmentDate(startDate),
          past: isPastAppointment,
          future: startDate > new Date(),
          lastRetrieved: new Date().toISOString(),
          isLatest: true,
          cancellable: false, // CC appointments that are booked are not cancellable
          referralId: `VA${Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(10, '0')}`,
          provider: {
            id: appointmentId,
            name: 'Dr. Smith @ Acme Cardiology - Anywhere, USA',
            practice: 'Acme Cardiology',
            phone: '555-555-0001',
            location: {
              name: 'Temple University Hospital - Jeanes Campus',
              address: '7500 CENTRAL AVE, STE 108, PHILADELPHIA, PA 19111-2430',
              latitude: 40.06999282694126,
              longitude: -75.08769957031448,
              timezone: 'America/New_York',
            },
          },
          location: {
            id: appointmentId,
            type: 'appointments',
            attributes: {
              name: 'Temple University Hospital - Jeanes Campus',
              timezone: {
                timeZoneId: 'America/New_York',
              },
            },
          },
        },
      };
    },
  },
  clinic: {
    getTemplate: (serviceType, startDate, locationId = '983') => {
      const serviceConfig = serviceTypes[serviceType];
      const endDate = new Date(
        startDate.getTime() + serviceConfig.duration * 60 * 1000,
      );
      const clinic =
        serviceConfig.clinics[
          Math.floor(Math.random() * serviceConfig.clinics.length)
        ];
      const practitioner =
        practitioners[Math.floor(Math.random() * practitioners.length)];
      const appointmentId = generateRandomId();
      const isPastAppointment = startDate < new Date();
      const temporaryAppointment = {
        id: appointmentId,
        type: 'appointments',
        attributes: {
          id: appointmentId.substring(0, 6),
          identifier: [
            {
              system: 'Appointment/',
              value: generateRandomId('41393833'),
            },
            {
              system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_84',
              value: `${locationId}:${clinic}`,
            },
          ],
          kind: 'clinic',
          type: 'VA',
          modality: 'vaInPerson',
          serviceType,
          serviceTypes: [
            {
              coding: [
                {
                  system:
                    'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
                  code: serviceType,
                },
              ],
            },
          ],
          serviceCategory: [
            {
              coding: [
                {
                  system:
                    'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
                  code: 'REGULAR',
                  display: 'REGULAR',
                },
              ],
              text: 'REGULAR',
            },
          ],
          patientIcn: '1012845331V153043',
          locationId,
          clinic,
          start: formatAppointmentDate(startDate),
          end: formatAppointmentDate(endDate),
          minutesDuration: serviceConfig.duration,
          practitioners: [
            {
              identifier: [
                {
                  system: null,
                  value: practitioner.identifier,
                },
              ],
              name: practitioner.name,
              practiceName: null,
            },
          ],
          slot: {
            id: generateRandomId('323032333130'),
            start: formatAppointmentDate(startDate),
            end: formatAppointmentDate(endDate),
          },
          created: formatAppointmentDate(new Date()),
          extension: {
            ccLocation: {
              address: {},
            },
            vistaStatus: ['FUTURE'],
            preCheckinAllowed: false,
            eCheckinAllowed: true,
          },
          localStartTime: formatLocalTime(startDate),
          avsPath: null,
          serviceName: serviceConfig.name.toUpperCase(),
          friendlyLocationName: 'Cheyenne VA Medical Center',
          past: isPastAppointment,
          pending: false,
        },
      };
      const statusInfo = getAppointmentStatus(
        temporaryAppointment.attributes,
        isPastAppointment,
      );

      return {
        id: appointmentId,
        type: 'appointments',
        attributes: {
          ...temporaryAppointment.attributes,
          status: statusInfo.status,
          cancellable: statusInfo.cancellable,
          cancelationReason: statusInfo.cancelationReason,
          extension: {
            ...temporaryAppointment.attributes.extension,
            vistaStatus: statusInfo.vistaStatus,
          },
        },
      };
    },
  },

  phone: {
    getTemplate: (serviceType, startDate, locationId = '983') => {
      const serviceConfig = serviceTypes[serviceType];
      const endDate = new Date(
        startDate.getTime() + Math.min(serviceConfig.duration, 30) * 60 * 1000,
      ); // Phone calls typically shorter
      const clinic =
        serviceConfig.clinics[
          Math.floor(Math.random() * serviceConfig.clinics.length)
        ];
      const practitioner =
        practitioners[Math.floor(Math.random() * practitioners.length)];
      const appointmentId = generateRandomId();
      const isPastAppointment = startDate < new Date();
      const temporaryAppointment = {
        id: appointmentId,
        type: 'appointments',
        attributes: {
          id: appointmentId.substring(0, 6),
          identifier: [
            {
              system: 'Appointment/',
              value: generateRandomId('41393833'),
            },
            {
              system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_84',
              value: `${locationId}:${clinic}`,
            },
          ],
          kind: 'phone',
          type: 'VA',
          serviceType,
          serviceTypes: [
            {
              coding: [
                {
                  system:
                    'http://veteran.apps.va.gov/terminologies/fhir/CodeSystem/vats-service-type',
                  code: serviceType,
                },
              ],
            },
          ],
          serviceCategory: [
            {
              coding: [
                {
                  system:
                    'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
                  code: 'REGULAR',
                  display: 'REGULAR',
                },
              ],
              text: 'REGULAR',
            },
          ],
          patientIcn: '1012845331V153043',
          locationId,
          clinic,
          start: formatAppointmentDate(startDate),
          end: formatAppointmentDate(endDate),
          minutesDuration: Math.min(serviceConfig.duration, 30),
          practitioners: [
            {
              identifier: [
                {
                  system: null,
                  value: practitioner.identifier,
                },
              ],
              name: practitioner.name,
              practiceName: null,
            },
          ],
          slot: {
            id: generateRandomId('323032333130'),
            start: formatAppointmentDate(startDate),
            end: formatAppointmentDate(endDate),
          },
          created: formatAppointmentDate(new Date()),
          localStartTime: formatLocalTime(startDate),
          serviceName: serviceConfig.name.toUpperCase(),
          friendlyLocationName: 'Cheyenne VA Medical Center',
          contact: {
            telecom: [
              {
                type: 'phone',
                value: '555-123-4567',
              },
            ],
          },
          modality: 'vaPhone',
          past: isPastAppointment,
          pending: false,
        },
      };
      const statusInfo = getAppointmentStatus(
        temporaryAppointment.attributes,
        isPastAppointment,
      );

      return {
        id: appointmentId,
        type: 'appointments',
        attributes: {
          ...temporaryAppointment.attributes,
          status: statusInfo.status,
          cancellable: statusInfo.cancellable,
          cancelationReason: statusInfo.cancelationReason,
          extension: {
            ccLocation: {
              address: {},
            },
            vistaStatus: statusInfo.vistaStatus,
            preCheckinAllowed: false,
            eCheckinAllowed: false,
          },
        },
      };
    },
  },

  telehealth: {
    getTemplate: (serviceType, startDate, locationId = '983') => {
      const serviceConfig = serviceTypes[serviceType];
      const endDate = new Date(
        startDate.getTime() + serviceConfig.duration * 60 * 1000,
      );
      const clinic =
        serviceConfig.clinics[
          Math.floor(Math.random() * serviceConfig.clinics.length)
        ];
      const practitioner =
        practitioners[Math.floor(Math.random() * practitioners.length)];
      const appointmentId = generateRandomId();
      const isPastAppointment = startDate < new Date();
      const statusInfo = getAppointmentStatus({}, isPastAppointment);

      const modalityOptions = [
        'vaVideoCareAtHome',
        'vaVideoCareAtAnAtlasLocation',
        'vaVideoCareAtAVaLocation',
      ];
      const modality =
        modalityOptions[Math.floor(Math.random() * modalityOptions.length)];

      return {
        id: appointmentId,
        type: 'Appointment',
        attributes: {
          clinic,
          comment: '',
          contact: {
            telecom: [
              {
                type: 'email',
                value: null,
              },
            ],
          },
          description: `Upcoming ${
            modality === 'vaVideoCareAtHome' ? 'at home' : 'video'
          } telehealth appointment`,
          end: formatAppointmentDate(endDate),
          id: appointmentId,
          kind: 'telehealth',
          type: 'VA',
          modality,
          locationId,
          minutesDuration: serviceConfig.duration,
          patientIcn: '1012845331V153043',
          patientInstruction:
            'Please join the video call 5 minutes before your scheduled time',
          practitioners: [
            {
              identifier: [
                {
                  system: null,
                  value: practitioner.identifier,
                },
              ],
              name: practitioner.name,
              practiceName: null,
            },
          ],
          physicalLocation: null,
          preferredTimesForPhoneCall: [],
          priority: 0,
          reasonCode: {},
          requestedPeriods: null,
          serviceType,
          start: formatAppointmentDate(startDate),
          status: statusInfo.status,
          created: formatAppointmentDate(new Date()),
          cancellable: false, // Telehealth appointments are not cancellable
          cancelationReason: statusInfo.cancelationReason,
          localStartTime: formatLocalTime(startDate),
          telehealth: {
            url: 'https://va.webex.com/meet/sample_meeting_link',
            atlas:
              modality === 'vaVideoCareAtAnAtlasLocation'
                ? {
                    siteCode: 'ATL123',
                    address: {
                      street: '123 Atlas Location St',
                      city: 'Atlanta',
                      state: 'GA',
                      zipCode: '30309',
                    },
                  }
                : null,
            vvsKind:
              modality === 'vaVideoCareAtAVaLocation'
                ? 'CLINIC_BASED'
                : 'ADHOC',
          },
          location: {
            vistaId: locationId,
            id: locationId,
            name: 'Cheyenne VA Medical Center',
            address: {
              street: '2360 E Pershing Blvd',
              city: 'Cheyenne',
              state: 'WY',
              zipCode: '82001',
            },
            phone: {
              main: '307-778-7550',
            },
            url: null,
            code: 'CHY',
            display: 'Cheyenne VA Medical Center',
            physicalAddress: {
              line: ['2360 E Pershing Blvd'],
              city: 'Cheyenne',
              state: 'WY',
              postalCode: '82001',
            },
            healthService: ['Audiology', 'PrimaryCare', 'MentalHealthCare'],
            operatingStatus: {
              code: 'NORMAL',
            },
          },
          vistaStatus: statusInfo.vistaStatus,
          past: isPastAppointment,
          pending: false,
        },
      };
    },
  },
};

/**
 * Generates mock confirmed appointments data for testing purposes.
 *
 * @param {Object} [options={}] - Configuration options for generating appointments.
 * @param {number} [options.futureMonths=6] - Number of future months to generate appointments for.
 * @param {number} [options.pastMonths=3] - Number of past months to generate appointments for.
 * @param {number} [options.appointmentsPerMonth=2] - Average number of appointments per month.
 * @param {string[]} [options.appointmentTypes=['clinic', 'phone', 'telehealth']] - Types of appointments to generate.
 * @param {string[]} [options.serviceTypes] - Service types for appointments.
 * @param {string} [options.locationId='983'] - Location ID for appointments.
 * @param {string[]} [options.requiredAppointmentDates] - Specific dates that must have appointments.
 * @returns {Object} Object containing an array of mock appointment data.
 */
const getMockConfirmedAppointments = (options = {}) => {
  const {
    futureMonths = 6,
    pastMonths = 3,
    appointmentsPerMonth = 2,
    appointmentTypes = ['clinic', 'phone', 'telehealth', 'cc'],
    serviceTypes: requestedServiceTypes = [
      'primaryCare',
      'outpatientMentalHealth',
      'audiology',
      'covid',
    ],
    locationId = '983',
    requiredAppointmentDates = [
      startOfDay(findNextBusinessDay()).toISOString(),
    ],
  } = options;

  const appointments = [];
  const totalMonths = futureMonths + pastMonths;
  const totalAppointments = Math.floor(totalMonths * appointmentsPerMonth);

  // Generate appointments distributed across the time range
  for (let i = 0; i < totalAppointments; i++) {
    // Randomly distribute across past and future
    const monthOffset = Math.random() * totalMonths - pastMonths;
    const appointmentDate = generateRandomBusinessDate(monthOffset);

    // Randomly select appointment type and service type
    const appointmentType =
      appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const serviceType =
      requestedServiceTypes[
        Math.floor(Math.random() * requestedServiceTypes.length)
      ];

    // Generate the appointment using the appropriate template
    const appointment = appointmentTemplates[appointmentType].getTemplate(
      serviceType,
      appointmentDate,
      locationId,
    );

    appointments.push(appointment);
  }

  // Generate required appointments for specific dates
  requiredAppointmentDates.forEach(dateString => {
    const appointmentDate = new Date(dateString);

    // Set to a business hour with 15-minute interval
    const randomHour = Math.floor(Math.random() * 9) + 8; // 8 AM - 4 PM
    const randomMinuteInterval = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    appointmentDate.setHours(randomHour, randomMinuteInterval, 0, 0);

    // Randomly select appointment type and service type for required appointments
    const appointmentType =
      appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const serviceType =
      requestedServiceTypes[
        Math.floor(Math.random() * requestedServiceTypes.length)
      ];

    // Generate the required appointment using the appropriate template
    const requiredAppointment = appointmentTemplates[
      appointmentType
    ].getTemplate(serviceType, appointmentDate, locationId);

    appointments.push(requiredAppointment);
  });

  // Add a guaranteed cancelled CC EPS appointment for testing
  const cancelledCCDate = new Date();
  cancelledCCDate.setDate(cancelledCCDate.getDate() + 7); // 1 week from now
  cancelledCCDate.setHours(14, 30, 0, 0); // 2:30 PM

  const cancelledCCAppointment = appointmentTemplates.cc.getTemplate(
    'primaryCare',
    cancelledCCDate,
    locationId,
  );

  // Force this appointment to be cancelled
  cancelledCCAppointment.attributes.status = 'cancelled';
  cancelledCCAppointment.attributes.cancelationReason = {
    coding: [
      {
        system:
          'http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason',
        code: 'pat',
        display: 'Patient',
      },
    ],
  };
  cancelledCCAppointment.attributes.future = true;
  cancelledCCAppointment.attributes.past = false;

  appointments.push(cancelledCCAppointment);

  // Sort appointments by date (past first, then future)
  appointments.sort((a, b) => {
    const dateA = new Date(a.attributes.start);
    const dateB = new Date(b.attributes.start);
    return dateA - dateB;
  });

  return {
    data: appointments,
  };
};

module.exports = {
  getMockConfirmedAppointments,
  findNextBusinessDay,
};
