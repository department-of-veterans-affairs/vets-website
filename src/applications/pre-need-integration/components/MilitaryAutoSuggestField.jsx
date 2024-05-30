import React, { useEffect, useState } from 'react';
import Downshift from 'downshift';

function MilitaryAutoSuggest({ value, setValue, labels, onSelectionChange }) {
  const [inputValue, setInputValue] = useState('');

  const formatValue = valueText =>
    valueText
      ? valueText.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
      : '';

  useEffect(
    () => {
      if (value) {
        setInputValue(formatValue(value));
      }
    },
    [value],
  );

  const itemToString = item => (item ? item.value || item.key : '');

  const getMatchScore = (input, labelValue) => {
    if (!input || !labelValue) return 0;

    const normalizedInput = input.toLowerCase();
    const label = labelValue.value || labelValue.key;
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
        setValue(selection);
        onSelectionChange(selection);
      }}
      itemToString={itemToString}
      selectedItem={value}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      {({ getInputProps, getItemProps, isOpen, highlightedIndex }) => (
        <div className="relative">
          <input
            {...getInputProps({
              value: inputValue,
              onChange: e => setInputValue(e.target.value),
            })}
          />
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
                    {formatValue(item.label.value) || item.label.key}
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
