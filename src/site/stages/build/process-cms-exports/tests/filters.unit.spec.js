/* eslint-disable camelcase */

const { expect } = require('chai');
const { getFilter, getFilteredEntity } = require('../filters');

describe('CMS export filter helpers', () => {
  describe('getFilter', () => {
    it('should return an array of properties to keep, given the content model type', () => {
      expect(getFilter('paragraph-wysiwyg')).to.deep.equal(['field_wysiwyg']);
    });

    it('should return an empty array if the content model type is not found', () => {
      expect(getFilter('asdf')).to.deep.equal([]);
    });

    // Skipping this for now because it doesn't properly reset console
    // it.skip('should log a warning to the console for a missing filter only once', () => {
    //   const con = global.console;
    //   global.console = sinon.spy();
    //   getFilter('asdf');
    //   getFilter('asdf');
    //   expect(global.console.callCount).to.equal(1);
    //   global.console = con;
    // });
  });

  describe('getFilteredEntity', () => {
    it("should filter out properties that don't appear in the content model's filters or global whitelist", () => {
      expect(
        getFilteredEntity({
          contentModelType: 'paragraph-wysiwyg',
          field_wysiwyg: 'keep this',
          filter_me_out: 'discard this',
        }),
      ).to.deep.equal({
        contentModelType: 'paragraph-wysiwyg',
        field_wysiwyg: 'keep this',
      });
    });

    it('should use a common blacklist for content models which have no filters specified', () => {
      expect(
        getFilteredEntity({
          contentModelType: 'some entity we know nothing about yet',
          uid: 'discard this',
          keep_me: 'keep this',
        }),
      ).to.deep.equal({
        contentModelType: 'some entity we know nothing about yet',
        keep_me: 'keep this',
      });
    });
  });
});
