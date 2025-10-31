import { expect } from 'chai';
import {
  replaceStrValues,
  personalizeTitleByRole,
} from '../../../utils/helpers/formatting';
import content from '../../../locales/en/content.json';

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
  it('should return empty string when formData is missing', () => {
    expect(personalizeTitleByRole(null, '%s contact')).to.equal('');
    expect(personalizeTitleByRole(undefined, '%s contact')).to.equal('');
  });

  it('should return empty string when title is missing', () => {
    expect(personalizeTitleByRole({ certifierRole: 'applicant' })).to.equal('');
  });

  it('should use defaults (roleKey, matchRole, placeholder, self/other via content) when opts not provided', () => {
    const title = '%s contact information';
    const out = personalizeTitleByRole({ certifierRole: 'applicant' }, title);
    expect(out).to.equal(`${content['page-title--your']} contact information`);
  });

  it('should insert "other" default when role does not match', () => {
    const title = '%s contact information';
    const out = personalizeTitleByRole(
      { certifierRole: 'representative' },
      title,
    );
    expect(out).to.equal(
      `${content['page-title--beneficiary-plural']} contact information`,
    );
  });

  it('should support custom roleKey and matchRole', () => {
    const formData = { role: 'powerOfAttorney' };
    const title = '%s mailing address';
    const out = personalizeTitleByRole(formData, title, {
      roleKey: 'role',
      matchRole: 'powerOfAttorney',
    });
    expect(out).to.equal(`${content['page-title--your']} mailing address`);
  });

  it('should use custom placeholder token', () => {
    const formData = { certifierRole: 'applicant' };
    const title = '%% contact information';
    const out = personalizeTitleByRole(formData, title, { placeholder: '%%' });
    expect(out).to.equal(`${content['page-title--your']} contact information`);
  });

  it('should fall back to "other" when roleKey is missing in formData', () => {
    const formData = {}; // no certifierRole
    const title = '%s contact information';
    const out = personalizeTitleByRole(formData, title);
    expect(out).to.equal(
      `${content['page-title--beneficiary-plural']} contact information`,
    );
  });
});
