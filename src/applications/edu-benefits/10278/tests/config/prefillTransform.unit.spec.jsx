import { expect } from 'chai';
import transform from '../../config/prefillTransform';

const makeState = (overrides = {}) => ({
  user: {
    login: { currentlyLoggedIn: false },
    profile: {},
    ...overrides.user,
  },
  ...overrides,
});

describe('prefillTransform function', () => {
  it('should transform form data correctly when no state is passed', () => {
    const pages = {};
    const metadata = {};
    const formData = {
      fullName: { first: 'John', last: 'Doe' },
      ssn: '123456789',
      dateOfBirth: '1990-01-01',
      otherField: 'should be preserved',
    };

    const result = transform(pages, formData, metadata);

    expect(result.formData).to.deep.equal({
      fullName: { first: 'John', last: 'Doe' },
      ssn: '123456789',
      dateOfBirth: '1990-01-01',
      otherField: 'should be preserved',
      userLoggedIn: true,
      claimantPersonalInformation: {
        fullName: { first: undefined, middle: undefined, last: undefined },
        dateOfBirth: '',
        ssn: '123456789',
        vaFileNumber: '123456789',
      },
    });
    expect(result.metadata).to.equal(metadata);
    expect(result.pages).to.equal(pages);
  });

  it('should preserve all form data fields', () => {
    const pages = {};
    const metadata = { test: 'metadata' };
    const formData = {
      fullName: { first: 'Jane', middle: 'A', last: 'Smith' },
      ssn: '987654321',
      dateOfBirth: '1985-05-15',
    };

    const result = transform(pages, formData, metadata);

    expect(result.formData.fullName).to.deep.equal({
      first: 'Jane',
      middle: 'A',
      last: 'Smith',
    });
    expect(result.formData.ssn).to.equal('987654321');
    expect(result.formData.dateOfBirth).to.equal('1985-05-15');
  });

  it('should handle empty form data', () => {
    const pages = {};
    const metadata = {};
    const formData = {};

    const result = transform(pages, formData, metadata);

    expect(result.formData).to.deep.equal({
      userLoggedIn: true,
      claimantPersonalInformation: {
        fullName: { first: undefined, middle: undefined, last: undefined },
        dateOfBirth: '',
        ssn: undefined,
        vaFileNumber: undefined,
      },
    });
    expect(result.metadata).to.equal(metadata);
    expect(result.pages).to.equal(pages);
  });

  it('should set userLoggedIn true when state indicates user is logged in', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: {},
      },
    });
    const result = transform({}, { otherField: 'x' }, {}, state);

    expect(result.formData.userLoggedIn).to.equal(true);
    expect(result.formData.otherField).to.equal('x');
  });

  it('should add claimantPersonalInformation with empty name fields when profile has no name or DOB', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: { userFullName: {}, dob: '' },
      },
    });
    const formData = { existing: 'data' };
    const result = transform({}, formData, {}, state);

    expect(result.formData.userLoggedIn).to.equal(true);
    expect(result.formData.existing).to.equal('data');
    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: undefined, middle: undefined, last: undefined },
      dateOfBirth: '',
      ssn: undefined,
      vaFileNumber: undefined,
    });
  });

  it('should add claimantPersonalInformation when logged in with first name only', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: {
          userFullName: { first: 'Jane' },
          dob: '',
        },
      },
    });
    const result = transform({}, {}, {}, state);

    expect(result.formData.userLoggedIn).to.equal(true);
    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: 'Jane', middle: undefined, last: undefined },
      dateOfBirth: '',
      ssn: undefined,
      vaFileNumber: undefined,
    });
  });

  it('should add claimantPersonalInformation when logged in with last name only', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: {
          userFullName: { last: 'Doe' },
          dob: '',
        },
      },
    });
    const result = transform({}, {}, {}, state);

    expect(result.formData.userLoggedIn).to.equal(true);
    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: undefined, middle: undefined, last: 'Doe' },
      dateOfBirth: '',
      ssn: undefined,
      vaFileNumber: undefined,
    });
  });

  it('should add claimantPersonalInformation when logged in with DOB only', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: {
          userFullName: {},
          dob: '1990-01-15',
        },
      },
    });
    const result = transform({}, {}, {}, state);

    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: undefined, middle: undefined, last: undefined },
      dateOfBirth: '1990-01-15',
      ssn: undefined,
      vaFileNumber: undefined,
    });
  });

  it('should add claimantPersonalInformation when logged in with full profile', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: {
          userFullName: {
            first: 'John',
            middle: 'Q',
            last: 'Public',
          },
          dob: '1985-05-20',
        },
      },
    });
    const result = transform({}, {}, {}, state);

    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: 'John', middle: 'Q', last: 'Public' },
      dateOfBirth: '1985-05-20',
      ssn: undefined,
      vaFileNumber: undefined,
    });
  });

  it('should always add claimantPersonalInformation from profile regardless of login state', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: false },
        profile: {
          userFullName: { first: 'John', last: 'Doe' },
          dob: '1990-01-01',
        },
      },
    });
    const formData = { ssn: '123456789' };
    const result = transform({}, formData, {}, state);

    expect(result.formData.userLoggedIn).to.equal(true);
    expect(result.formData.ssn).to.equal('123456789');
    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: 'John', middle: undefined, last: 'Doe' },
      dateOfBirth: '1990-01-01',
      ssn: '123456789',
      vaFileNumber: '123456789',
    });
  });

  it('should preserve existing formData when adding claimantPersonalInformation from profile', () => {
    const state = makeState({
      user: {
        login: { currentlyLoggedIn: true },
        profile: {
          userFullName: { first: 'Jane', last: 'Doe' },
          dob: '1990-01-01',
        },
      },
    });
    const formData = { otherField: 'preserved' };
    const result = transform({}, formData, {}, state);

    expect(result.formData.otherField).to.equal('preserved');
    expect(result.formData.claimantPersonalInformation).to.deep.equal({
      fullName: { first: 'Jane', middle: undefined, last: 'Doe' },
      dateOfBirth: '1990-01-01',
      ssn: undefined,
      vaFileNumber: undefined,
    });
  });

  it('should handle undefined or missing state', () => {
    const formData = { x: 1 };
    expect(transform({}, formData, {}).formData.userLoggedIn).to.equal(true);
    expect(
      transform({}, formData, {}, undefined).formData.userLoggedIn,
    ).to.equal(true);
    expect(transform({}, formData, {}, null).formData.userLoggedIn).to.equal(
      true,
    );
  });
});
