import { expect } from 'chai';
import { isItemIncomplete } from '../../../../utils/helpers/spouseUtils';

describe('spouseUtils', () => {
  describe('isItemIncomplete', () => {
    describe('spouseUtils', () => {
      const VALID = {
        spouseFullName: { first: 'Jane', last: 'Doe' },
        spouseSocialSecurityNumber: '123456789',
        spouseDateOfBirth: '1980-01-01',
        dateOfMarriage: '2010-06-15',
        cohabitedLastYear: true,
        sameAddress: true,
        provideSupportLastYear: false,
      };

      const withSeparateAddress = {
        ...VALID,
        sameAddress: false,
        spouseAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          country: 'USA',
          postalCode: '12345',
        },
        spousePhone: '5551234567',
      };

      const clone = obj => JSON.parse(JSON.stringify(obj));

      const makeItem = overrides => ({ ...clone(VALID), ...overrides });
      const makeItemWithSeparateAddress = overrides => {
        const base = clone(withSeparateAddress);
        return { ...base, ...overrides };
      };

      context('isItemIncomplete', () => {
        context('Required fields present; only optional ones missing', () => {
          [
            {
              desc: 'all required present (same address)',
              item: VALID,
            },
            {
              desc: 'all required present (separate address)',
              item: withSeparateAddress,
            },

            {
              desc: 'cohabitedLastYear false is allowed',
              item: makeItem({ cohabitedLastYear: false }),
            },
            {
              desc: 'provideSupportLastYear false is allowed',
              item: makeItem({ provideSupportLastYear: false }),
            },
            {
              desc: 'provideSupportLastYear undefined when cohabiting -> not required',
              item: makeItem({
                cohabitedLastYear: true,
                provideSupportLastYear: undefined,
              }),
            },
            {
              desc: 'valid suffix value present',
              item: makeItem({
                spouseFullName: {
                  ...VALID.spouseFullName,
                  suffix: 'Jr.',
                },
              }),
            },
          ].forEach(({ desc, item }) => {
            it(`should return false when ${desc}`, () => {
              expect(isItemIncomplete(item)).to.be.false;
            });
          });
        });

        context('Required fields missing', () => {
          [
            {
              desc: 'missing spouseFullName entirely',
              item: makeItem({ spouseFullName: undefined }),
            },
            {
              desc: 'missing SSN',
              item: makeItem({ spouseSocialSecurityNumber: undefined }),
            },
            {
              desc: 'missing DOB',
              item: makeItem({ spouseDateOfBirth: undefined }),
            },
            {
              desc: 'missing dateOfMarriage',
              item: makeItem({ dateOfMarriage: undefined }),
            },
            {
              desc: 'cohabitedLastYear undefined',
              item: makeItem({ cohabitedLastYear: undefined }),
            },
            {
              desc: 'sameAddress undefined',
              item: makeItem({ sameAddress: undefined }),
            },
            {
              desc: 'provideSupportLastYear undefined when not cohabiting -> required',
              item: makeItem({
                cohabitedLastYear: false,
                provideSupportLastYear: undefined,
              }),
            },
            {
              desc: 'spouseFullName.first is missing',
              item: makeItem({
                spouseFullName: {
                  ...VALID.spouseFullName,
                  first: undefined,
                },
              }),
            },
            {
              desc: 'spouseFullName.last is missing',
              item: makeItem({
                spouseFullName: {
                  ...VALID.spouseFullName,
                  last: undefined,
                },
              }),
            },
          ].forEach(({ desc, item }) => {
            it(`should return true when ${desc}`, () => {
              expect(isItemIncomplete(item)).to.be.true;
            });
          });
        });

        context('Required fields present but not valid', () => {
          [
            {
              desc: 'spouseDateOfBirth is before 1900',
              item: makeItem({ spouseDateOfBirth: '1899-01-01' }),
            },
            {
              desc: 'dateOfMarriage is before 1900',
              item: makeItem({ dateOfMarriage: '1899-01-01' }),
            },
            {
              desc: 'dateOfMarriage is before spouseDateOfBirth',
              item: makeItem({
                spouseDateOfBirth: '2010-06-15',
                dateOfMarriage: '1980-01-01',
              }),
            },
          ].forEach(({ desc, item }) => {
            it(`should return true when ${desc}`, () => {
              expect(isItemIncomplete(item)).to.be.true;
            });
          });
        });

        context('Conditional contact information requirements', () => {
          context('allows missing values when sameAddress is true', () => {
            [
              {
                desc: 'no contact info',
                item: makeItem({ sameAddress: true }),
              },
              {
                desc: 'partial contact info allowed',
                item: makeItem({
                  sameAddress: true,
                  spouseAddress: { street: '123 Main St' },
                }),
              },
            ].forEach(({ desc, item }) => {
              it(`should return false with ${desc}`, () => {
                expect(isItemIncomplete(item)).to.be.false;
              });
            });
          });

          context('requires values when sameAddress is false', () => {
            context('with required fields missing', () => {
              it('should return true when spouseAddress is missing', () => {
                const item = makeItem({
                  sameAddress: false,
                  spousePhone: '5551234567',
                  spouseAddress: undefined,
                });

                expect(isItemIncomplete(item)).to.be.true;
              });

              // Required address fields (loop)
              ['street', 'city', 'state', 'country', 'postalCode'].forEach(
                field => {
                  it(`should return true when spouseAddress.${field} is missing`, () => {
                    const badAddress = {
                      ...withSeparateAddress.spouseAddress,
                      [field]: undefined,
                    };
                    expect(
                      isItemIncomplete(
                        makeItemWithSeparateAddress({
                          spouseAddress: badAddress,
                        }),
                      ),
                    ).to.be.true;
                  });
                },
              );
            });

            context('with required fields present', () => {
              [
                {
                  desc: 'missing optional spousePhone',
                  item: makeItemWithSeparateAddress({ spousePhone: undefined }),
                },
                {
                  desc: 'all contact present',
                  item: withSeparateAddress,
                },
              ].forEach(({ desc, item }) => {
                it(`should return false when ${desc}`, () => {
                  expect(isItemIncomplete(item)).to.be.false;
                });
              });
            });
          });
        });

        context('Edge cases with missing required fields', () => {
          [
            { desc: 'null item', item: null },
            { desc: 'undefined item', item: undefined },
            { desc: 'empty object', item: {} },
            {
              desc: 'empty string treated as missing',
              item: makeItem({ spouseFullName: { first: '', last: 'Doe' } }),
            },
            {
              desc: 'null value treated as missing',
              item: makeItem({ spouseSocialSecurityNumber: null }),
            },
          ].forEach(({ desc, item }) => {
            it(`should return true for ${desc}`, () => {
              expect(isItemIncomplete(item)).to.be.true;
            });
          });
        });
      });
    });
  });
});
