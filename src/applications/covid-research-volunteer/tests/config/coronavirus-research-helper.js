import {
  fillData,
  selectRadio,
  selectCheckbox,
  fillDate,
} from 'platform/testing/unit/schemaform-utils.jsx';

function populateFormData(form) {
  selectRadio(form, 'root_diagnosed', 'Y');
  selectRadio(form, 'root_closeContactPositive', 'YES');
  selectRadio(form, 'root_hospitalized', 'N');
  selectRadio(form, 'root_smokeOrVape', 'N');

  selectCheckbox(form, 'root_healthHistory_ALLERGY_VACCINE', true);
  selectCheckbox(form, 'root_healthHistory_LUNG_DISEASE', true);
  selectCheckbox(form, 'root_employmentStatus_NONE_OF_ABOVE', true);
  selectCheckbox(form, 'root_transportation_WORK_FROM_HOME', true);
  selectCheckbox(form, 'root_transportation_CAR', true);

  selectRadio(form, 'root_residentsInHome', 'ONE_TWO');
  selectRadio(form, 'root_closeContact', 'ONE_TEN');

  fillData(form, 'input#root_veteranFullName_first', 'test');
  fillData(form, 'input#root_veteranFullName_last', 'test');
  fillData(form, 'input#root_email', 'test@test.com');
  fillData(form, '[name="root_view:confirmEmail"]', 'test@test.com');
  fillData(form, 'input#root_phone', '777-888-9999');
  fillData(form, 'input#root_zipCode', '55555');

  fillDate(form, 'root_veteranDateOfBirth', '1984-09-24');

  fillData(form, 'input#root_heightFeet', '5');
  fillData(form, 'input#root_heightInches', '11');
  fillData(form, 'input#root_weight', '200');

  selectCheckbox(form, 'root_gender_SELF_IDENTIFY', true);
  selectCheckbox(form, 'root_raceEthnicityOrigin_NONE_OF_ABOVE', true);
}

module.exports = {
  populateFormData,
};
