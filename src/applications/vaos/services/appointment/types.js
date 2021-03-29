/**
 *
 * @summary
 * Appointments resources are created from several different data sources:
 *
 * - VistA and Video appointments from mobile appointment service (MAS)
 * - Community care appointments fetched from var-resources service
 * - VA and CC requests stored fetched from var-resources service
 *
 * Records from each of those sources are called appointments, ccAppointments,
 * and requests, respectively
 *
 * @typedef {Object} Appointment
 * @property {'Appointment'} resourceType Static resource type string
 * @property {string} id Mapped from appointment.id, request.id, or ccAppointment.id
 * @property {?string} created Mapped from request.createdDate, timezone is unclear
 * @property {?Object} cancelationReason Cancellation reason for a requestion, mapped from request.appointmentRequestDetailCode
 * @property {string} cancelationReason.text veteranMessage field mapped only for requests, used for Express Care only
 * @property {AppointmentStatus} status Status for an appointment, from first requested to completed
 * - Mapped from appointment.vdsAppointments[0].currentStatus or appointment.vvsAppointments[0].status.code for appointments.
 * - Mapped from request.status for requests
 * @property {?string} description Description of an appointment, generally the status description from the downstream system
 * - Mapped from appointment.vdsAppointments[0].currentStatus or appointment.vvsAppointments[0].status.code for appoinments
 * - Mapped from request.status for requests
 * - Mapped from appointment.vdsAppointments[0].currentStatus or appointment.vvsAppointments[0].status.code for appoinments
 * - Null for other types of appointments/requests
 * @property {?RequestType} type Type of care information for requests, undefined for appointments
 * @property {?string} start Start time for the appointment
 * - Mapped from ccAppointment.appointmentTime for CC appointments
 * - Mapped from appointment.vvsAppointments[0].dateTime for video appointments
 * - Mapped from appointment.startDate for VistA appointments
 * - Mapped from request.date for Express Care requests
 * @property {number} minutesDuration=60 The duration of the appointment or requested appointment
 * - Mapped from appointment.vdsAppointments[0].appointmentLength for VistA appointments
 * - Mapped from appointment.vvsAppointments[0].duration for video appointments.
 * @property {?string} comment Veteran or staff comments about appointments
 * - Mapped from ccAppointment.instructionsToVeteran for community care appointments
 * - Mapped from appointment.vdsAppointments[0].bookingNotes for VistA appointments
 * - Mapped from appointment.vvsAppointments[0].instructionsTitle for video appointments,
 * - Mapped from request.additionalInformation, but that only has content for Express Care requests
 * @property {?string} reason The reason given by patient for an appointment
 * - Mapped from request.reasonForVisit for Express Care requests
 * - Mapped from request.purposeForVisit for regular requests
 * - Empty for other appointment types
 * @property {VistaAppointmentParticipants | VARequestParticipants | CommunityCareParticipants} participant
 *   Array of resources participating in this appointment, used to store information like clinic and location
 * @property {VARequestContainedResources | CommunityCareRequestContainedResources | CommunityCareContainedResources} contained
 *   Array of fully defined resources for this appointment
 * @property {Object} legacyVAR Object containing untransformed data that we don't have a place for
 * @property {Object} legacyVAR.apiData This is the full appointment/request object. Generally, we shouldn't be pulling data from here
 * @property {?Object} legacyVAR.bestTimeToCall Array of best times to call (Morning, Afternoon, Eventing), mapped from request.bestTimetoCall
 * @property {?Array<RequestedPeriod>} requestedPeriods Mapped from request.optionDate and request.optionTime fields 1 through 3
 * @property {VideoData} videoData Information associated with video visits from Video Visit Service (via MAS)
 * @property {DerivedAppointmentData} vaos This object contains derived data or information we need that doesn't fit in the FHIR format
 */

/**
 * @typedef {Object} VideoData
 * @property {boolean} isVideo If the appointment is a video appointment
 * @property {?string} facilityId The location id of the video appointment
 * - Mapped from appt.sta6aid for clinic based appointments or appt.facilityId for other video appointment types
 * @property {?Array<VideoProvider>} providers Array of providers included in the video visit, mapped from appt.vvsAppointments[0].providers
 * @property {'ADHOC'|'MOBILE_GFE'|'CLINIC_BASED'|'STORE_FORWARD'|'MOBILE_ANY'} kind Video visit type
 * - Mapped from appointment.vvsAppointments[0].appointmentKind
 * @property {?string} url The url for the video visit
 * - Mapped from appointment.vvsAppointments[0].patients[0].virtualMeetingRoom.url
 * @property {?boolean} isAtlas True if the appointment is an ATLAS video appointment
 * @property {?AtlasLocation} atlasLocation The ATLAS location information
 * @property {?string} atlasConfirmationCode The ATLAS confirmation code
 * - Mapped from appointment.vvsAppointments[0].tasInfo.confirmationCode
 * @property {?number} duration The duration of the video appointment
 * - Mapped from appointment.vvsAppointments[0].duration
 * @property {?string} status The status of the video appointment
 * - Mapped from appointment.vvsAppointments[0].status.code
 */

/**
 * @typedef {Object} VideoProvider
 * @property {Object} name The name of the provider
 * @property {string} name.first The first name of the provider
 * - Mapped from appointment.vvsAppointments[0].providers[].name.first
 * @property {string} name.last The last name of the provider
 * - Mapped from appointment.vvsAppointments[0].providers[].name.last
 * @property {string} display The first and last name of the provider concatenated
 */

/**
 * @summary
 * - booked: Used for all community care appointments and any non-cancelled VistA appointments
 * - cancelled: Mapped from cancelled for requests, or the set of cancelled statuses for appointments
 * - proposed: Mapped from the Submitted status for requests
 * - pending:  Mapped from the Escalated status on Express Care requests
 * - fulfilled: Mapped from the Resolved status for Express Care requests
 *
 * @typedef {'booked'|'cancelled'|'proposed'|'pending'|'fulfilled'} AppointmentStatus
 */

/**
 * @typedef {Object} DerivedAppointmentData
 * @property {string} appointmentType The type of appointment or request this is
 * - **ccRequest**: Chosen for any item that has a request.typeOfCareId starting with CC
 * - **ccAppointment**: Chosen for any item with an ccAppointment.appointmentTime field or a communityCare flag set to true
 * - **request**: Chosen for any item with a request.typeOfCareId field that doesn't start with CC
 * - **vaAppointment**: Chosen for any item with an appointment.vvsAppointments[0] array or a clinicId and a falsy appointment.communityCare flag
 * @property {boolean} isCommunityCare Set to true if request.appointmentType above is either ccRequest or ccAppointment
 * @property {?boolean} isPastAppointment Set to true if the appointment is in the past, undefined for requests
 * @property {?string} timeZone Mapped to request.timeZone for community care requests, null or undefined otherwise
 * @property {?boolean} isPhoneAppointment Mapped from appointment.phoneOnly field for VistA appointments, undefined otherwise
 * @property {?boolean} isExpressCare Set to true if request.typeOfCareId is CR1
 * @property {boolean} isVideo Set to true for video appointments or requests. Will be true if request.visitType is set to
 *   video conference, or appointment.vvsAppointments has an item
 */

/**
 * @summary
 * These dates will either have a midnight to Noon start and end time, or a Noon to midnight timeframe,
 * dependening on if the user chose AM or PM
 *
 * @typedef {Object} RequestedPeriod
 * @property {string} start Date in ISO format
 * @property {string} end Date in ISO format
 */

/**
 * @summary
 * Holds type of care information for requests
 *
 * @typedef {Object} RequestType
 * @property {Array} coding Single item array
 * @property {string} coding[].code Mapped from request.typeOfCareId
 * @property {string} coding[].display Mapped from request.appointmentType
 */

/**
 * @summary
 * Participant array contents when appointment is a VistA based appointment
 *
 * @typedef {Array<ClinicReference|FacilityReference>} VistaAppointmentParticipants
 */

/**
 * @typedef {Object} ClinicReference
 * @property {Object} actor
 * @property {string} actor.reference Mapped to HealthcareService/${appointment.facilityId}_${appointment.clinicId}
 *
 * Clinics are uniquely identified by a combination of the VistA site/instance id and the clinic id
 * @property {string} actor.display Clinic name, mapped from appointment.clinicFriendlyName or appointment.vdsAppointments[0].clinic.name
 */

/**
 * @typedef {Object} FacilityReference
 * @property {Object} actor
 * @property {string} actor.reference Mapped to Location/${appointment.sta6aid}
 *
 * It is intentionally not mapped to appointment.facilityId, because that is the VistA site/instance id.
 */

/**
 * @typedef {Object} RequestFacilityReference
 * @property {Object} actor
 * @property {string} actor.reference Mapped Location/${request.facility.facilityCode}
 *
 * It is intentionally not mapped to appointment.facilityId, because that is the VistA site/instance id.
 */

/**
 * @summary
 * Participant array contents when appointment is a VA appointment request
 *
 * @typedef {Array<RequestFacilityReference>} VARequestParticipants
 */

/**
 * @summary
 * Contained array contents when appointment is a community care appointment request
 *
 * @typedef {Array<RequestPatientResource|CommunityCarePractitionerResource>} CommunityCareRequestContainedResources
 */

/**
 * @typedef {Object} RequestPatientResource
 * @property {'Patient'} resourceType
 * @property {Object} name Name object for patient
 * @property {?string} name.text Mapped from request.patient.displayName or request.patient.firstName request.patient.lastName
 * @property {Array} telecom Patient phone and email, two item array
 * @property {Object} telecom.0 First item in telecom array
 * @property {'phone'} telecom.0.system Phone item in telecom array
 * @property {string} telecom.0.value Phone number, mapped from request.phoneNumber
 * @property {Object} telecom.1 Second item in telecom array
 * @property {'email'} telecom.1.system Email item in telecom array
 * @property {string} telecom.1.value Email address, mapped from request.email
 */
/**
 * @summary
 * Each preferred provider will have a Practioner resource, currently will just be one provider
 *
 * @typedef {Object} CommunityCarePractitionerResource
 * @property {'Practitioner'} resourceType
 * @property {string} id Mapped to cc-practitioner-${request.id}-${request.ccAppointmentRequest.preferredProviders.index}
 * @property {?Object} name Exists if request.ccAppointmentRequest.preferredProviders[].lastName is present
 * @property {string} name.text Mapped to request.ccAppointmentRequest.preferredProviders[].firstName and request.ccAppointmentRequest.preferredProviders[].lastName
 * @property {string} name.family Mapped to request.ccAppointmentRequest.preferredProviders[].lastName
 * @property {string} name.given Mapped to request.ccAppointmentRequest.preferredProviders[].firstName
 * @property {Array} practitionerRole Array of roles, we use this for storing the practice name
 * @property {string} practitionerRole[0].location[0].reference Mapped to Location/cc-location-${request.id}-${request.ccAppointmentRequest.preferredProviders.index}
 * @property {string} practitionerRole[0].location[0].display Mapped to request.ccAppointmentRequest.preferredProviders[].practiceName
 * @property {Array<CommunityCarePractitionerAddress>} address Single item array of addresses
 */

/**
 * @typedef {Object} CommunityCarePractitionerAddress
 * @property {Array<string>} line Address street lines, mapped from request.ccAppointmentRequest.preferredProviders[].address.street
 * @property {string} city Address city, mapped from request.ccAppointmentRequest.preferredProviders[].address.city
 * @property {string} state Address state, mapped from request.ccAppointmentRequest.preferredProviders[].address.state
 * @property {string} postalCode Address postal code, mapped from request.ccAppointmentRequest.preferredProviders[].address.zipCode
 */

/**
 * @summary
 * Location data for ATLAS appointments, mapped from appointment.tasInfo
 *
 * @typedef {Object} AtlasLocation
 *
 * @property {'Location'} resourceType Static Location resource type
 * @property {string} id Identifier for the ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.siteCode
 * @property {Object} address Address of ATLAS site
 * @property {string[]} address.line Street address lines for ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.siteCode
 * @property {string} address.city City for ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.address.city
 * @property {string} address.state State for ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.address.state
 * @property {string} address.postalCode Zip code for ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.address.zipCode
 * @property {Object} position Lat/long of ATLAS site
 * @property {number} longitude Longitude of ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.address.longitude
 * @property {number} latitude Latitude of ATLAS site
 * - Mapped from appointments.vvsAppointments[0].tasInfo.address.latitude
 *
 */
