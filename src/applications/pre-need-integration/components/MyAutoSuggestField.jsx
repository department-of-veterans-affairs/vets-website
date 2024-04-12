import React from 'react';
import Downshift from 'downshift';

function AutoSuggest({ value, setValue, labels, onSelectionChange, maxItems }) {
  // Consistently handle items as objects with a label key
  const itemToString = item => {
    if (!item) {
      return '';
    }
    if (item.value === '') {
      return item.key;
    }
    return item.value;
  };

  const getMatchScore = (input, labelValue) => {
    if (!input || !labelValue) {
      return 0;
    }

    const normalizedInput = input.toLowerCase();
    const label = labelValue.value === '' ? labelValue.key : labelValue.value;
    const normalizedLabel = label.toLowerCase();
    let score = 0;

    if (normalizedLabel.startsWith(normalizedInput)) {
      score += 10000;
    }

    const inputWords = normalizedInput.split(/\s+/);
    const labelWords = normalizedLabel.split(/\s+/);
    inputWords.forEach(inputWord => {
      labelWords.forEach(labelWord => {
        if (labelWord.startsWith(inputWord)) {
          score += 1000;
        }
      });
    });

    return score;
  };

  return (
    <Downshift
      onChange={selection => {
        setValue(selection);
        onSelectionChange(selection);
      }}
      itemToString={itemToString}
      selectedItem={value}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <div className="relative">
          <input
            {...getInputProps({
              className:
                'block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md',
            })}
          />
          {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-60 overflow-y-auto">
              {labels
                .map((label, index) => ({
                  label,
                  index,
                  score: getMatchScore(inputValue, label),
                }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, maxItems)
                .map((item, index) => (
                  <div
                    key={item.index}
                    {...getItemProps({
                      item: item.label,
                      index,
                      className: `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        highlightedIndex === index
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-900'
                      }`,
                    })}
                  >
                    {item.label.value === ''
                      ? item.label.key
                      : item.label.value}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}

export default AutoSuggest;
