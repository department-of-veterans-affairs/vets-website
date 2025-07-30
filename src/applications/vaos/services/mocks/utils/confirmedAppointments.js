// Helper function to generate random IDs
const generateRandomId = (prefix = '') => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to generate random dates in business hours
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

  return new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    randomDay,
    randomHour,
    0, // Minutes
    0, // Seconds
  );
};

// Helper function to format dates
const formatAppointmentDate = (date, offsetHours = 0) => {
  const adjustedDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
  return adjustedDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

// Helper function to format local time
const formatLocalTime = (date, timezone = '-06:00') => {
  const localDate = new Date(date.getTime() - 6 * 60 * 60 * 1000); // Assume Central Time
  return localDate.toISOString().replace('Z', `.000${timezone}`);
};

// Appointment status configurations
const appointmentStatuses = {
  booked: {
    status: 'booked',
    weight: 0.85, // 85% of appointments are booked
    cancellable: isPast => !isPast, // Future appointments can be cancelled
    vistaStatus: ['FUTURE'],
    cancelationReason: null,
  },
  cancelled: {
    status: 'cancelled',
    weight: 0.15, // 15% of appointments are cancelled
    cancellable: false, // Cancelled appointments cannot be cancelled again
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

// Helper function to determine appointment status
const getAppointmentStatus = isPast => {
  const rand = Math.random();
  let cumulative = 0;

  for (const [statusKey, config] of Object.entries(appointmentStatuses)) {
    cumulative += config.weight;
    if (rand <= cumulative) {
      const isCancelled = statusKey === 'cancelled';
      const cancellable =
        typeof config.cancellable === 'function'
          ? config.cancellable(isPast)
          : config.cancellable;

      let cancelationReason = null;
      let vistaStatus = config.vistaStatus[0]; // Default vista status

      if (isCancelled) {
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
      } else if (isPast) {
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
    cancellable: !isPast,
    cancelationReason: null,
    vistaStatus: isPast ? ['CHECKED OUT'] : ['FUTURE'],
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
      const isPast = startDate < new Date();
      const statusInfo = getAppointmentStatus(isPast);

      return {
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
          status: statusInfo.status,
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
          cancellable: true,
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
          past: isPast,
          pending: false,
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
      const isPast = startDate < new Date();
      const statusInfo = getAppointmentStatus(isPast);

      return {
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
          status: statusInfo.status,
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
          past: isPast,
          pending: false,
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
      const isPast = startDate < new Date();
      const statusInfo = getAppointmentStatus(isPast);

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
          cancellable: statusInfo.cancellable,
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
          past: isPast,
          pending: false,
        },
      };
    },
  },
};

const getMockConfirmedAppointments = (options = {}) => {
  const {
    futureMonths = 6,
    pastMonths = 3,
    appointmentsPerMonth = 2,
    appointmentTypes = ['clinic', 'phone', 'telehealth'],
    serviceTypes: requestedServiceTypes = [
      'primaryCare',
      'outpatientMentalHealth',
      'audiology',
      'covid',
    ],
    locationId = '983',
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
};
