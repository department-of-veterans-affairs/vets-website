// Dependencies.
import { expect } from 'chai';
// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  TITLE_CASE_NONCAPITALIZED_WORDS,
  TOGGLE_SHOW_MOBILE_FORM,
  TOGGLE_TOOL_TIP,
} from '.';

describe('Yellow Ribbon constants', () => {
  it('should have `yellow-ribbon` in them', () => {
    expect(FETCH_RESULTS).to.include('yellow-ribbon');
    expect(FETCH_RESULTS_FAILURE).to.include('yellow-ribbon');
    expect(FETCH_RESULTS_SUCCESS).to.include('yellow-ribbon');
    expect(TOGGLE_SHOW_MOBILE_FORM).to.include('yellow-ribbon');
    expect(TOGGLE_TOOL_TIP).to.include('yellow-ribbon');
  });

  describe('TITLE_CASE_NONCAPITALIZED_WORDS', () => {
    it('should be an array', () => {
      expect(TITLE_CASE_NONCAPITALIZED_WORDS).to.be.an('array');
    });

    it('should only contain strings', () => {
      TITLE_CASE_NONCAPITALIZED_WORDS.forEach(word => {
        expect(word).to.be.a('string');
      });
    });

    it('should not be modifiable', () => {
      const original = [...TITLE_CASE_NONCAPITALIZED_WORDS];
      try {
        TITLE_CASE_NONCAPITALIZED_WORDS.push('newWord');
      } catch (e) {
        // If an error occurs during modification, it indicates immutability
      } finally {
        expect(TITLE_CASE_NONCAPITALIZED_WORDS).to.deep.equal(original);
      }
    });
  });
});
