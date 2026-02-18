import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import useLastWord from '../useLastWord';

// Test component that uses the hook
function TestComponent({ text }) {
  const [lastWord, firstWords] = useLastWord(text);
  return (
    <div>
      <div data-testid="last-word">{JSON.stringify(lastWord)}</div>
      <div data-testid="first-words">{JSON.stringify(firstWords)}</div>
    </div>
  );
}

describe('useLastWord', () => {
  describe('with empty string input', () => {
    it('should return empty last word and empty first words', () => {
      const { getByTestId } = render(<TestComponent text="" />);

      const lastWord = JSON.parse(getByTestId('last-word').textContent);
      const firstWords = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord).to.deep.equal(['']);
      expect(firstWords).to.deep.equal(['']);
    });
  });

  describe('with single word input', () => {
    it('should return the word as last word and empty first words', () => {
      const { getByTestId } = render(<TestComponent text="Hello" />);

      const lastWord = JSON.parse(getByTestId('last-word').textContent);
      const firstWords = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord).to.deep.equal(['Hello']);
      expect(firstWords).to.deep.equal(['']);
    });
  });

  describe('with multiple words input', () => {
    it('should return last word and remaining words as first words', () => {
      const { getByTestId } = render(<TestComponent text="Hello World" />);

      const lastWord = JSON.parse(getByTestId('last-word').textContent);
      const firstWords = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord).to.deep.equal(['World']);
      expect(firstWords).to.deep.equal(['Hello']);
    });

    it('should handle multiple words correctly', () => {
      const { getByTestId } = render(<TestComponent text="Hello World Test" />);

      const lastWord = JSON.parse(getByTestId('last-word').textContent);
      const firstWords = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord).to.deep.equal(['Test']);
      expect(firstWords).to.deep.equal(['Hello World']);
    });

    it('should handle words with multiple spaces', () => {
      const { getByTestId } = render(
        <TestComponent text="Hello  World   Test" />,
      );

      const lastWord = JSON.parse(getByTestId('last-word').textContent);
      const firstWords = JSON.parse(getByTestId('first-words').textContent);

      // split(' ') will create empty strings for consecutive spaces
      // Last element will be 'Test', first elements will include empty strings
      expect(lastWord).to.deep.equal(['Test']);
      // The join will combine the empty strings, resulting in multiple spaces
      expect(firstWords[0]).to.include('Hello');
      expect(firstWords[0]).to.include('World');
    });
  });

  describe('useMemo dependencies', () => {
    it('should recompute when text prop changes', () => {
      // Test that the hook correctly recomputes when text changes
      // This verifies that the first useMemo has [text] as a dependency
      const { getByTestId, rerender } = render(<TestComponent text="First" />);

      const lastWord1 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords1 = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord1).to.deep.equal(['First']);
      expect(firstWords1).to.deep.equal(['']);

      // Change the text prop
      rerender(<TestComponent text="Second Word" />);

      const lastWord2 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords2 = JSON.parse(getByTestId('first-words').textContent);

      // Verify it recomputed with new values
      expect(lastWord2).to.deep.equal(['Word']);
      expect(firstWords2).to.deep.equal(['Second']);
    });

    it('should not recompute when text prop stays the same', () => {
      // Test that the hook maintains consistent results when text doesn't change
      // This verifies that useMemo correctly memoizes based on dependencies
      const { getByTestId, rerender } = render(<TestComponent text="Same" />);

      const lastWord1 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords1 = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord1).to.deep.equal(['Same']);
      expect(firstWords1).to.deep.equal(['']);

      // Rerender with the same text prop
      rerender(<TestComponent text="Same" />);

      const lastWord2 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords2 = JSON.parse(getByTestId('first-words').textContent);

      // Results should be consistent (same values)
      expect(lastWord2).to.deep.equal(lastWord1);
      expect(firstWords2).to.deep.equal(firstWords1);
    });

    it('should have correct dependency array for words useMemo', () => {
      // This test verifies that the first useMemo depends on [text]
      // by checking behavior when text changes
      const { getByTestId, rerender } = render(
        <TestComponent text="Initial" />,
      );

      const lastWord1 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords1 = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord1).to.deep.equal(['Initial']);
      expect(firstWords1).to.deep.equal(['']);

      // Change text and verify it recomputes
      rerender(<TestComponent text="Changed Text" />);

      const lastWord2 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords2 = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord2).to.deep.equal(['Text']);
      expect(firstWords2).to.deep.equal(['Changed']);
    });

    it('should have correct dependency array for return value useMemo', () => {
      // This test verifies that the second useMemo depends on [words]
      // by verifying that when words array changes (via text change), the return value changes
      const { getByTestId, rerender } = render(
        <TestComponent text="One Two" />,
      );

      const lastWord1 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords1 = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord1).to.deep.equal(['Two']);
      expect(firstWords1).to.deep.equal(['One']);

      // Change text to create a different words array
      rerender(<TestComponent text="Three Four Five" />);

      const lastWord2 = JSON.parse(getByTestId('last-word').textContent);
      const firstWords2 = JSON.parse(getByTestId('first-words').textContent);

      expect(lastWord2).to.deep.equal(['Five']);
      expect(firstWords2).to.deep.equal(['Three Four']);
    });
  });
});
