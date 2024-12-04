import React, { useEffect, useState, useMemo } from 'react';
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
      if (value && value !== inputValue) {
        setInputValue(value);
      }
      onSelectionChange(value);
    },
    [value],
  );

  const itemToString = item => (item ? `${item.key} - ${item.value}` : '');

  const getMatchScore = (input, labelValue) => {
    if (!input || !labelValue) return 0;
    const normalizedInput = input.toLowerCase();
    const label = `${labelValue.key} - ${labelValue.value}`;
    const normalizedLabel = label.toLowerCase();
    let score = normalizedLabel.startsWith(normalizedInput) ? 10000 : 0;

    normalizedInput.split(/\s+/).forEach(inputWord => {
      normalizedLabel.split(/\s+/).forEach(labelWord => {
        if (labelWord.startsWith(inputWord)) score += 1000;
      });
    });

    return score;
  };

  const filteredLabels = useMemo(
    () => {
      return labels
        .map(label => ({
          label,
          score: getMatchScore(inputValue, label),
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems);
    },
    [labels, inputValue, maxItems],
  );

  return (
    <Downshift
      onChange={selection => {
        if (selection) {
          const formattedValue = `${selection.key.toUpperCase()} - ${
            selection.value
          }`;
          setInputValue(formattedValue);
          setValue(formattedValue);
          onSelectionChange(selection);
        }
      }}
      itemToString={itemToString}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      {({ getInputProps, getItemProps, isOpen, highlightedIndex }) => (
        <div className="relative">
          <input
            id="military-auto-suggest"
            type="text"
            {...getInputProps({
              onChange: e => {
                setInputValue(e.target.value);
              },
              onBlur: () => {
                setValue(inputValue);
              },
            })}
          />
          {isOpen && (
            <div className="autosuggest-list">
              {filteredLabels.map((item, index) => (
                <div
                  key={index}
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
