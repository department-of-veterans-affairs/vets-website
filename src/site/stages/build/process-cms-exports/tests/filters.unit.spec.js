const { expect } = require('chai');
const { getFilter } = require('../filters');

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
    it('should find the filter', () => {});
  });
});
