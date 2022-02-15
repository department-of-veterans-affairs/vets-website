import DeselectableObjectField from '@@profile/components/personal-information/DeselectableObjectField';

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
      ),
    ).to.deep.equal(expected);
  });

  it('should set preferNotToAnswer to false if any other option is set to true', () => {
    const initial = {
      woman: false,
      man: false,
      transgenderWoman: false,
      transgenderMan: false,
      nonBinary: false,
      preferNotToAnswer: true,
      genderNotListed: false,
    };

    const expected = {
      woman: true,
      man: false,
      transgenderWoman: false,
      transgenderMan: false,
      nonBinary: false,
      preferNotToAnswer: false,
      genderNotListed: false,
    };

    expect(
      DeselectableObjectField.deselectBasedOnValue('woman', true, initial),
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
      DeselectableObjectField.deselectBasedOnValue('man', true, initial),
    ).to.deep.equal(expected);
  });
});
