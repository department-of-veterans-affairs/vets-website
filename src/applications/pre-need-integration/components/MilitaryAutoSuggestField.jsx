import React, { useEffect, useState } from 'react';
import Downshift from 'downshift';

function MilitaryAutoSuggest({
  value,
  setValue,
  labels,
  onSelectionChange,
  maxItems = 500,
}) {
  const [inputValue, setInputValue] = useState('');

  useEffect(
    () => {
      if (value) {
        setInputValue(value);
      }
    },
    [value],
  );

  const itemToString = item => (item ? item.value || item.key : inputValue);

  const getMatchScore = (input, labelValue) => {
    if (!input || !labelValue) return 0;
    const normalizedInput = input.toLowerCase();
    const label = `${labelValue.key} - ${labelValue.value}`;
    const normalizedLabel = label ? label.toLowerCase() : '';
    let score = normalizedLabel.startsWith(normalizedInput) ? 10000 : 0;

    normalizedInput.split(/\s+/).forEach(inputWord => {
      normalizedLabel.split(/\s+/).forEach(labelWord => {
        if (labelWord.startsWith(inputWord)) score += 1000;
      });
    });

    return score;
  };

  return (
    <Downshift
      onChange={selection => {
        setValue(`${selection.key.toUpperCase()} - ${selection.value}`);
        onSelectionChange(selection);
      }}
      itemToString={itemToString}
      selectedItem={value}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      {({ getInputProps, getItemProps, isOpen, highlightedIndex }) => (
        <div className="relative">
          {/* Add label with htmlFor */}
          {/* <label htmlFor="military-auto-suggest"> */}
          {/* Select a military rank: */}
          <input
            id="military-auto-suggest"
            type="text"
            {...getInputProps({
              value,
              onChange: e => {
                setInputValue(e.target.value);
                onSelectionChange(e.target.value);
              },
            })}
          />
          {/* </label> */}
          {isOpen && (
            <div className="autosuggest-list">
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
                      className:
                        highlightedIndex === index
                          ? 'autosuggest-item-highlighted'
                          : 'autosuggest-item',
                    })}
                  >
                    {`${item.label.key} - ${item.label.value}`}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}

export default MilitaryAutoSuggest;
