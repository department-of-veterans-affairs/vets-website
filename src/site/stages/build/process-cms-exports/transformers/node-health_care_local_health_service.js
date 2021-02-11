/* eslint-disable camelcase */
const { getDrupalValue, getWysiwygString } = require('./helpers');

const getFieldFacilityLocationObject = ({ title, entityUrl }) =>
  typeof title === 'object'
    ? {
        entity: {
          title: getDrupalValue(title),
          entityUrl,
        },
      }
    : {
        entity: {
          title,
          entityUrl,
        },
      };

const transform = entity => ({
  entity: {
    entityType: 'node',
    entityBundle: 'health_care_local_health_service',
    title: getDrupalValue(entity.title),
    fieldBody: {
      processed: getWysiwygString(getDrupalValue(entity.fieldBody)),
    },
    fieldRegionalHealthService:
      entity.fieldRegionalHealthService.length > 0
        ? {
            entity: {
              entityUrl: entity.fieldRegionalHealthService[0].entityUrl,
              fieldBody: entity.fieldRegionalHealthService[0].fieldBody,
              fieldServiceNameAndDescripti:
                entity.fieldRegionalHealthService[0]
                  .fieldServiceNameAndDescripti,
            },
          }
        : {},
    fieldServiceLocation: entity.fieldServiceLocation.map(locationData => ({
      entity: locationData,
    })),
    fieldHserviceApptLeadin: getDrupalValue(entity.fieldHserviceApptLeadin),
    fieldHserviceApptIntroSelect: getDrupalValue(
      entity.fieldHserviceApptIntroSelect,
    ),
    fieldOnlineSchedulingAvailabl: getDrupalValue(
      entity.fieldOnlineSchedulingAvailabl,
    ),
    fieldReferralRequired: getDrupalValue(entity.fieldReferralRequired),
    fieldWalkInsAccepted: getDrupalValue(entity.fieldWalkInsAccepted),
    fieldPhoneNumbersParagraph: entity.fieldPhoneNumbersParagraph.map(
      phoneData => ({
        entity: {
          fieldPhoneExtension: phoneData.fieldPhoneExtension,
          fieldPhoneLabel: phoneData.fieldPhoneLabel,
          fieldPhoneNumber: phoneData.fieldPhoneNumber,
          fieldPhoneNumberType: phoneData.fieldPhoneNumberType,
        },
      }),
    ),
    fieldFacilityLocation: entity.fieldFacilityLocation[0]
      ? getFieldFacilityLocationObject(entity.fieldFacilityLocation[0])
      : null,
  },
});
module.exports = {
  filter: [
    'title',
    'field_facility_location',
    'field_body',
    'field_regional_health_service',
    'field_service_location',
    'field_hservice_appt_leadin',
    'field_hservice_appt_intro_select',
    'field_online_scheduling_availabl',
    'field_referral_required',
    'field_walk_ins_accepted',
    'field_phone_numbers_paragraph',
  ],
  transform,
};
