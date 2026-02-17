import { expect } from 'chai';
import * as schedulingPreferencesUtils from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import { FIELD_NAMES } from '@@vap-svc/constants/schedulingPreferencesConstants';

describe('Profile utils', () => {
  describe('scheduling preferences utils', () => {
    describe('getSchedulingPreferenceInitialFormValues', () => {
      it('returns data value when data is provided', () => {
        const data = { [FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING]: 'yes' };
        const result =
          schedulingPreferencesUtils.getSchedulingPreferenceInitialFormValues(
            FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
            data,
          );
        expect(result).to.deep.equal({
          needsHelpSchedulingAppointments: 'yes',
        });
      });

      it('returns empty string when no data is provided', () => {
        const result =
          schedulingPreferencesUtils.getSchedulingPreferenceInitialFormValues(
            FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
            null,
          );
        expect(result).to.deep.equal({ needsHelpSchedulingAppointments: '' });
      });
    });

    describe('schedulingPreferencesUiSchema', () => {
      it('returns radio UI schema for inline scheduling preference fields', () => {
        const result = schedulingPreferencesUtils.schedulingPreferencesUiSchema(
          FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
        );
        expect(result).to.have.property(
          FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
        );
        expect(
          result[FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING],
        ).to.have.property('ui:widget', 'radio');
        expect(
          result[FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING],
        ).to.have.property('ui:options');
      });
    });

    describe('schedulingPreferencesFormSchema', () => {
      it('returns radio form schema for inline scheduling preference fields', () => {
        const result =
          schedulingPreferencesUtils.schedulingPreferencesFormSchema(
            FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
          );
        expect(result).to.have.property('type', 'object');
        expect(result).to.have.property('properties');
        expect(result.properties).to.have.property(
          FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING,
        );
        expect(
          result.properties[FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING],
        ).to.have.property('type', 'string');
        expect(
          result.properties[FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING],
        ).to.have.property('enum');
      });
    });

    describe('sortDaysAndTimes', () => {
      it('returns sorted days and times', () => {
        const unsortedDaysAndTimes = {
          Friday: ['afternoon', 'morning'],
          Monday: ['morning'],
          Wednesday: ['afternoon'],
          Tuesday: ['morning', 'afternoon'],
        };

        const sortedDaysAndTimes = [
          ['Monday', ['morning']],
          ['Tuesday', ['morning', 'afternoon']],
          ['Wednesday', ['afternoon']],
          ['Friday', ['morning', 'afternoon']],
        ];

        const result =
          schedulingPreferencesUtils.sortDaysAndTimes(unsortedDaysAndTimes);
        expect(result).to.deep.equal(sortedDaysAndTimes);
      });
    });
  });
});
