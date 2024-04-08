import React from 'react';
import Downshift from 'downshift';

function AutoSuggest({ labels, onSelectionChange, maxItems }) {
  const items = Object.entries(labels).map(([key, label]) => ({
    value: key,
    label,
  }));

  const getMatchScore = (input, labelValue) => {
    // Normalize input and label for effective comparison
    const inputNormalized = input.toLowerCase();
    const labelNormalized = labelValue.toLowerCase();

    // Splitting input and label into words for word-by-word comparison
    const inputWords = inputNormalized.split(/\s+/);
    const labelWords = labelNormalized.split(/\s+/);

    let score = 0;

    // Check if the label starts with the input directly (high score for exact starts)
    if (labelNormalized.startsWith(inputNormalized)) {
      return 10000;
    }

    // Award points for each word in the input that starts with a word in the label
    for (const inputWord of inputWords) {
      for (const labelWord of labelWords) {
        if (labelWord.startsWith(inputWord)) {
          score += 1000;
        }
      }
    }

    // Additional scoring: Increase score for each character match in sequence across the entire label
    // This section gives a lower score but ensures that inputs like "usarmy" still find "U.S. Army"
    let sequenceMatch = 0;
    for (
      let i = 0, j = 0;
      i < inputNormalized.length && j < labelNormalized.length;
      i++, j++
    ) {
      if (inputNormalized[i] === labelNormalized[j]) {
        sequenceMatch++;
        score += sequenceMatch; // Incremental score for consecutive matches
      } else {
        // skip non-alphanumeric characters in label when mismatches occur
        while (
          j < labelNormalized.length &&
          /[^a-zA-Z0-9]/.test(labelNormalized[j])
        ) {
          j++;
        }
        // If next character still matches, continue scoring sequence
        if (
          i < inputNormalized.length &&
          inputNormalized[i] === labelNormalized[j]
        ) {
          sequenceMatch++;
          score += sequenceMatch;
        } else {
          sequenceMatch = 0;
        }
      }
    }
    return score;
  };

  return (
    <>
      <Downshift
        onChange={selection => {
          if (selection) {
            onSelectionChange(selection.value);
          }
        }}
        itemToString={item => (item ? item.label : '')}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
        }) => (
          <div className="relative">
            <input
              {...getInputProps({
                className:
                  'block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md',
              })}
            />
            {isOpen && inputValue ? (
              <div className="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-60 overflow-y-auto">
                {items
                  .map(item => ({
                    ...item,
                    score: getMatchScore(inputValue, item.label),
                  }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, maxItems)
                  .map((item, index) => (
                    <div
                      key={item.value}
                      {...getItemProps({ item, index })}
                      className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        highlightedIndex === index
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-900'
                      }`}
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? '#bde4ff' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        )}
      </Downshift>
    </>
  );
}

export default AutoSuggest;
