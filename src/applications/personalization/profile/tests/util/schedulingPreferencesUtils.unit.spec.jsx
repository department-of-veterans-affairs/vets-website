import { expect } from 'chai';
import * as schedulingPreferencesUtils from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { FIELD_NAMES } from '@@vap-svc/constants';

describe('Profile utils', () => {
  describe('scheduling preferences utils', () => {
    describe('getSchedulingPreferenceInitialFormValues', () => {
      it('returns data value when data is provided', () => {
        const data = { [FIELD_NAMES.APPOINTMENT_PREFERENCE_1]: 'yes' };
        const result = schedulingPreferencesUtils.getSchedulingPreferenceInitialFormValues(
          FIELD_NAMES.APPOINTMENT_PREFERENCE_1,
          data,
        );
        expect(result).to.deep.equal({
          needsHelpSchedulingAppointments: 'yes',
        });
      });

      it('returns empty string when no data is provided', () => {
        const result = schedulingPreferencesUtils.getSchedulingPreferenceInitialFormValues(
          FIELD_NAMES.APPOINTMENT_PREFERENCE_1,
          null,
        );
        expect(result).to.deep.equal({ needsHelpSchedulingAppointments: '' });
      });
    });

    describe('schedulingPreferencesUiSchema', () => {
      it('returns radio UI schema for inline scheduling preference fields', () => {
        const result = schedulingPreferencesUtils.schedulingPreferencesUiSchema(
          FIELD_NAMES.APPOINTMENT_PREFERENCE_1,
        );
        expect(result).to.have.property(FIELD_NAMES.APPOINTMENT_PREFERENCE_1);
        expect(result[FIELD_NAMES.APPOINTMENT_PREFERENCE_1]).to.have.property(
          'ui:widget',
          'radio',
        );
        expect(result[FIELD_NAMES.APPOINTMENT_PREFERENCE_1]).to.have.property(
          'ui:options',
        );
      });

      it('returns empty schema for subtask scheduling preference fields', () => {
        const result = schedulingPreferencesUtils.schedulingPreferencesUiSchema(
          FIELD_NAMES.CONTACT_PREFERENCE_1,
        );
        expect(result).to.deep.equal({
          [FIELD_NAMES.CONTACT_PREFERENCE_1]: {},
        });
      });
    });

    describe('schedulingPreferencesFormSchema', () => {
      it('returns radio form schema for inline scheduling preference fields', () => {
        const result = schedulingPreferencesUtils.schedulingPreferencesFormSchema(
          FIELD_NAMES.APPOINTMENT_PREFERENCE_1,
        );
        expect(result).to.have.property('type', 'object');
        expect(result).to.have.property('properties');
        expect(result.properties).to.have.property(
          FIELD_NAMES.APPOINTMENT_PREFERENCE_1,
        );
        expect(
          result.properties[FIELD_NAMES.APPOINTMENT_PREFERENCE_1],
        ).to.have.property('type', 'string');
        expect(
          result.properties[FIELD_NAMES.APPOINTMENT_PREFERENCE_1],
        ).to.have.property('enum');
      });

      it('returns empty schema for subtask scheduling preference fields', () => {
        const result = schedulingPreferencesUtils.schedulingPreferencesFormSchema(
          FIELD_NAMES.CONTACT_PREFERENCE_1,
        );
        expect(result).to.deep.equal({
          type: 'object',
          properties: {},
        });
      });
    });
  });
});
