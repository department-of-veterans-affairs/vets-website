import DeselectableObjectField from '@@vap-svc/components/DeselectableObjectField';
import { personalInformationFormSchemas } from '@@vap-svc/util/personal-information/personalInformationUtils';

import { expect } from 'chai';

describe('PersonalInformation', () => {
  it('should set all other options to false when preferNotToAnswer is true', () => {
    const initial = {
      woman: true,
      man: true,
      transgenderWoman: true,
      transgenderMan: true,
      nonBinary: true,
      preferNotToAnswer: false,
      genderNotListed: true,
    };

    const expected = {
      woman: false,
      man: false,
      transgenderWoman: false,
      transgenderMan: false,
      nonBinary: false,
      preferNotToAnswer: true,
      genderNotListed: false,
    };

    expect(
      DeselectableObjectField.deselectBasedOnValue(
        'preferNotToAnswer',
        true,
        initial,
        personalInformationFormSchemas.genderIdentity.properties,
      ),
    ).to.deep.equal(expected);
  });

  it('should set preferNotToAnswer to false if any other option is set to true', () => {
    const initial = {
      woman: false,
      preferNotToAnswer: true,
    };

    const expected = {
      woman: true,
      preferNotToAnswer: false,
    };

    expect(
      DeselectableObjectField.deselectBasedOnValue(
        'woman',
        true,
        initial,
        personalInformationFormSchemas.genderIdentity.properties,
      ),
    ).to.deep.equal(expected);
  });

  it('should set *NotListedText field to blank string when preferNotToAnswer is true', () => {
    const initial = {
      preferNotToAnswer: false,
      sexualOrientationNotListedText: 'test text',
    };

    const expected = {
      preferNotToAnswer: true,
      sexualOrientationNotListedText: '',
    };

    expect(
      DeselectableObjectField.deselectBasedOnValue(
        'preferNotToAnswer',
        true,
        initial,
        personalInformationFormSchemas.sexualOrientation.properties,
      ),
    ).to.deep.equal(expected);
  });

  it('should treat a normal selection (man) without preferNotToAnswer involved in a default manner and not unset anything special', () => {
    const initial = {
      woman: false,
      man: false,
      transgenderWoman: false,
      transgenderMan: true,
      nonBinary: false,
      preferNotToAnswer: false,
      genderNotListed: false,
    };

    const expected = {
      woman: false,
      man: true,
      transgenderWoman: false,
      transgenderMan: true,
      nonBinary: false,
      preferNotToAnswer: false,
      genderNotListed: false,
    };

    expect(
      DeselectableObjectField.deselectBasedOnValue(
        'man',
        true,
        initial,
        personalInformationFormSchemas.genderIdentity.properties,
      ),
    ).to.deep.equal(expected);
  });
});
