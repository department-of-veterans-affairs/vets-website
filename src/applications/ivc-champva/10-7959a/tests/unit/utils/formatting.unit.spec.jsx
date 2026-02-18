import { expect } from 'chai';
import {
  replaceStrValues,
  personalizeTitleByRole,
  personalizeTitleByName,
} from '../../../utils/helpers/formatting';

const apostrophe = '\u2019';

describe('10-7959a `replaceStrValues` util', () => {
  it('should return empty string when src is falsy', () => {
    expect(replaceStrValues('', 'x')).to.equal('');
    expect(replaceStrValues(null, 'x')).to.equal('');
    expect(replaceStrValues(undefined, 'x')).to.equal('');
    expect(replaceStrValues(0, 'x')).to.equal('');
    expect(replaceStrValues(false, 'x')).to.equal('');
  });

  it('should return empty string when val is falsy', () => {
    expect(replaceStrValues('Hello %s', '')).to.equal('');
    expect(replaceStrValues('Hello %s', null)).to.equal('');
    expect(replaceStrValues('Hello %s', undefined)).to.equal('');
    expect(replaceStrValues('Hello %s', 0)).to.equal('');
    expect(replaceStrValues('Hello %s', false)).to.equal('');
  });

  it('should replace a single placeholder with a non-array value', () => {
    expect(replaceStrValues('Hello, %s!', 'World')).to.equal('Hello, World!');
  });

  it('should replace using a custom placeholder token', () => {
    expect(replaceStrValues('A ~~ B', 'X', '~~')).to.equal('A X B');
  });

  it('should replace sequentially for array values (left-to-right)', () => {
    expect(replaceStrValues('%s-%s-%s', ['a', 'b', 'c'])).to.equal('a-b-c');
  });

  it('should keep leftover placeholders when there are fewer values than placeholders', () => {
    expect(replaceStrValues('%s-%s-%s', ['a', 'b'])).to.equal('a-b-%s');
  });

  it('should ignore extra values when there are more values than placeholders', () => {
    expect(replaceStrValues('%s', ['x', 'y', 'z'])).to.equal('x');
  });

  it('should do nothing when placeholder token is absent', () => {
    expect(replaceStrValues('hello world', 'X')).to.equal('hello world');
  });

  it('should replace sequentially for array values with custom token', () => {
    expect(replaceStrValues('X @@ Y @@ Z', ['1', '2'], '@@')).to.equal(
      'X 1 Y 2 Z',
    );
  });
});

describe('10-7959a `personalizeTitleByRole` util', () => {
  it('should return empty string when form data is null/omitted', () => {
    expect(personalizeTitleByRole(null, '%s contact')).to.equal('');
    expect(personalizeTitleByRole(undefined, '%s contact')).to.equal('');
  });

  it('should return empty string when title is omitted', () => {
    expect(personalizeTitleByRole({ certifierRole: 'applicant' })).to.equal('');
  });

  it('should use defaults options when overrides are omitted', () => {
    const title = '%s contact information';
    const out = personalizeTitleByRole({ certifierRole: 'applicant' }, title);
    expect(out).to.equal(`Your contact information`);
  });

  it('should insert `other` default when role does not match', () => {
    const title = '%s contact information';
    const out = personalizeTitleByRole(
      { certifierRole: 'representative' },
      title,
    );
    expect(out).to.equal(`Beneficiary${apostrophe}s contact information`);
  });

  it('should support custom roleKey and matchRole', () => {
    const formData = { role: 'powerOfAttorney' };
    const title = '%s mailing address';
    const out = personalizeTitleByRole(formData, title, {
      roleKey: 'role',
      matchRole: 'powerOfAttorney',
    });
    expect(out).to.equal(`Your mailing address`);
  });

  it('should use custom placeholder token', () => {
    const formData = { certifierRole: 'applicant' };
    const title = '%% contact information';
    const out = personalizeTitleByRole(formData, title, { placeholder: '%%' });
    expect(out).to.equal(`Your contact information`);
  });

  it('should fall back to `other` when roleKey is missing in form data', () => {
    const formData = {};
    const title = '%s contact information';
    const out = personalizeTitleByRole(formData, title);
    expect(out).to.equal(`Beneficiary${apostrophe}s contact information`);
  });

  it('should respect capitalize=false (does not change casing)', () => {
    const formData = { certifierRole: 'sponsor' };
    const result = personalizeTitleByRole(formData, 'Confirm %s info', {
      capitalize: false,
    });
    expect(result).to.equal(`Confirm beneficiary${apostrophe}s info`);
  });
});

describe('10-7959a `personalizeTitleByName` util', () => {
  const makeFormData = (name = {}) => ({
    applicantName: {
      first: 'Alex',
      middle: 'M',
      last: 'Johnson',
      suffix: '',
      ...name,
    },
  });

  it('should return empty string when form data is null/omitted', () => {
    const result = personalizeTitleByName(null, 'Confirm %s information');
    expect(result).to.equal('');
  });

  it('should return empty string when title is omitted', () => {
    const result = personalizeTitleByName(makeFormData());
    expect(result).to.equal('');
  });

  it('should insert full name by default and add possessive with smart apostrophe', () => {
    const formData = makeFormData();
    const result = personalizeTitleByName(formData, '%s contact information');
    expect(result).to.equal(`Alex M Johnson${apostrophe}s contact information`);
  });

  it('should render only the first name when option is `true`', () => {
    const formData = makeFormData();
    const result = personalizeTitleByName(formData, '%s contact information', {
      firstNameOnly: true,
    });
    expect(result).to.equal(`Alex${apostrophe}s contact information`);
  });

  it('should omit possessive when `possessive` is `false`', () => {
    const formData = makeFormData();
    const result = personalizeTitleByName(formData, '%s contact information', {
      possessive: false,
    });
    expect(result).to.equal('Alex M Johnson contact information');
  });

  it('should respect capitalize=false (does not change casing)', () => {
    const formData = makeFormData({ first: 'alex' });
    const result = personalizeTitleByName(formData, 'Confirm %s info', {
      firstNameOnly: true,
      possessive: false,
      capitalize: false,
    });
    expect(result).to.equal('Confirm alex info');
  });

  it('should apply possessive style `auto`: adds apostrophe-only for names ending with `s`', () => {
    const formData = makeFormData({ first: 'James', middle: '', last: '' });
    const result = personalizeTitleByName(formData, 'Review %s docs', {
      firstNameOnly: true,
      possessive: true,
      possessiveStyle: 'auto',
    });
    expect(result).to.equal(`Review James${apostrophe} docs`);
  });

  it('should force apostrophe-only when possessiveStyle="apostropheOnly"', () => {
    const formData = makeFormData({ first: 'Alex', middle: '', last: '' });
    const result = personalizeTitleByName(formData, 'Review %s docs', {
      firstNameOnly: true,
      possessive: true,
      possessiveStyle: 'apostropheOnly',
    });
    expect(result).to.equal(`Review Alex${apostrophe} docs`);
  });

  it('should force apostrophe+s when possessiveStyle="apostropheS" even if name ends with "s"', () => {
    const formData = makeFormData({ first: 'James', middle: '', last: '' });
    const result = personalizeTitleByName(formData, 'Review %s docs', {
      firstNameOnly: true,
      possessive: true,
      possessiveStyle: 'apostropheS',
    });
    expect(result).to.equal(`Review James${apostrophe}s docs`);
  });

  it('should support custom nameKey', () => {
    const formData = {
      someoneElse: { first: 'Taylor', last: 'Reed' },
    };
    const result = personalizeTitleByName(formData, 'Confirm %s info', {
      nameKey: 'someoneElse',
      possessive: false,
    });
    expect(result).to.equal('Confirm Taylor Reed info');
  });

  it('should build full name by concatenating only truthy parts', () => {
    const formData = makeFormData({ middle: '', suffix: null });
    const result = personalizeTitleByName(formData, 'Review %s docs', {
      possessive: false,
    });
    expect(result).to.equal('Review Alex Johnson docs');
  });
});
