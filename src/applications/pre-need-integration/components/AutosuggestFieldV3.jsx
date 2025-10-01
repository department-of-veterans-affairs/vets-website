import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const AutosuggestField = props => {
  const { formData, onChange, uiSchema = {}, idSchema, errorSchema } = props;

  const options = uiSchema['ui:options'] || {};
  const { getOptions } = options;
  const inputId = idSchema.$id;
  const listboxId = `${inputId}__listbox`;

  // Normalize text for consistent display
  const normalizeName = useCallback(str => {
    if (!str) return '';
    const isAllCaps = /^[A-Z0-9\s.'&()-]+$/.test(str) && /[A-Z]/.test(str);
    if (!isAllCaps) return str;
    return str
      .toLowerCase()
      .replace(/\b([a-z])/g, m => m.toUpperCase())
      .replace(/\b(Va)\b/g, 'VA')
      .replace(/\b(U S A|U S|U\.S\.A\.|U\.S\.)\b/gi, 'U.S.')
      .replace(/\b(Us)\b/g, 'US')
      .replace(/\b(Wwii)\b/g, 'WWII');
  }, []);

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [initialized, setInitialized] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const containerRef = useRef(null);
  const listboxRef = useRef(null);

  useEffect(
    () => {
      if (justSelected) {
        const timeoutId = setTimeout(() => {
          setJustSelected(false);
        }, 500);

        return () => clearTimeout(timeoutId);
      }
      return undefined;
    },
    [justSelected],
  );

  useEffect(
    () => {
      let active = true;
      const timeoutId = setTimeout(() => {
        if (justSelected) {
          return;
        }

        if (selectedOption) {
          const selectedDisplayValue = normalizeName(
            selectedOption.label || selectedOption.name || selectedOption,
          );
          if (selectedDisplayValue === inputValue) {
            return;
          }
        }

        if (!getOptions || !inputValue || inputValue.length < 1) {
          setSuggestions([]);
          setOpen(false);
          setActiveIndex(-1);
          return;
        }

        setLoading(true);
        Promise.resolve(getOptions(inputValue))
          .then(list => {
            if (!active || justSelected) return;
            const arr = Array.isArray(list) ? list : [];
            setSuggestions(arr);
            setOpen(arr.length > 0);
            setActiveIndex(-1);
          })
          .catch(() => {
            if (active && !justSelected) {
              setSuggestions([]);
              setOpen(false);
              setActiveIndex(-1);
            }
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      }, 200);

      return () => {
        active = false;
        clearTimeout(timeoutId);
      };
    },
    [inputValue, getOptions, justSelected, selectedOption, normalizeName],
  );

  const commitSelection = useCallback(
    index => {
      const item = suggestions[index];
      if (!item) return;

      const value = item.value || item.id || item.label || item.name || item;
      const displayValue = normalizeName(item.label || item.name || item);
      setInputValue(displayValue);
      setSelectedOption(item);
      onChange(value);
      setOpen(false);
      setActiveIndex(-1);
      setSuggestions([]);
      setJustSelected(true);

      setTimeout(() => {
        const input = document.getElementById(inputId);
        if (input) {
          input.focus();
        }
      }, 0);
    },
    [suggestions, onChange, normalizeName, inputId],
  );

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll active item into view
  useEffect(
    () => {
      if (open && activeIndex >= 0 && listboxRef.current) {
        const activeOption = listboxRef.current.querySelector(
          `#${listboxId}__option-${activeIndex}`,
        );
        if (activeOption) {
          activeOption.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    },
    [activeIndex, open, listboxId],
  );

  useEffect(
    () => {
      if (formData !== undefined) {
        if (
          selectedOption &&
          (selectedOption.value ||
            selectedOption.id ||
            selectedOption.label ||
            selectedOption.name ||
            selectedOption) === formData
        ) {
          const displayValue = normalizeName(
            selectedOption.label || selectedOption.name || selectedOption,
          );
          if (displayValue !== inputValue) {
            setInputValue(displayValue);
          }
          setInitialized(true);
          return;
        }

        if (formData && getOptions && !initialized) {
          const searchStrategies = [
            '',
            formData,
            'a',
            'b',
            'c',
            'memorial',
            'national',
            'cemetery',
          ];

          let foundOption = null;

          const tryNextStrategy = async (index = 0) => {
            if (index >= searchStrategies.length) {
              if (!justSelected) {
                setInputValue('');
                setSelectedOption(null);
              }
              setInitialized(true);
              return;
            }

            try {
              const query = searchStrategies[index];
              const results = await Promise.resolve(getOptions(query));

              if (Array.isArray(results) && results.length > 0) {
                foundOption = results.find(
                  option => (option.value || option.id) === formData,
                );

                if (foundOption) {
                  const displayValue = normalizeName(
                    foundOption.label || foundOption.name || foundOption,
                  );
                  if (displayValue !== inputValue) {
                    setInputValue(displayValue);
                  }
                  setSelectedOption(foundOption);
                  setInitialized(true);
                  return;
                }
              }

              tryNextStrategy(index + 1);
            } catch (error) {
              tryNextStrategy(index + 1);
            }
          };

          tryNextStrategy();
        } else {
          if (!justSelected && formData === '') {
            setInputValue('');
            setSelectedOption(null);
          }
          setInitialized(true);
        }
      } else if (!initialized) {
        setInitialized(true);
      }
    },
    [
      formData,
      normalizeName,
      getOptions,
      initialized,
      selectedOption,
      justSelected,
      inputValue,
    ],
  );

  const firstError = errorSchema?.__errors?.[0];

  const onKeyDown = e => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (suggestions.length) {
        e.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!suggestions.length) return;
        setActiveIndex(prev => (prev + 1 >= suggestions.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!suggestions.length) return;
        setActiveIndex(
          prev => (prev - 1 < 0 ? suggestions.length - 1 : prev - 1),
        );
        break;
      case 'Tab':
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          commitSelection(activeIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputChange = useCallback(
    e => {
      const val = e?.target?.value ?? e?.detail?.value ?? '';

      if (selectedOption) {
        const selectedDisplayValue = normalizeName(
          selectedOption.label || selectedOption.name || selectedOption,
        );
        if (selectedDisplayValue === val) {
          setInputValue(val);
          return;
        }
      }

      const isUserInput = !justSelected;

      setInputValue(val);

      if (isUserInput) {
        onChange(val);
        setSelectedOption(null);
        setJustSelected(false);
      }

      if (val.length === 0) {
        setOpen(false);
        setActiveIndex(-1);
        setSuggestions([]);
        setJustSelected(false);
      }
    },
    [onChange, justSelected, selectedOption, normalizeName],
  );

  const rawTitle = uiSchema['ui:title'];
  const labelText = typeof rawTitle === 'string' ? rawTitle : undefined;
  const inputProps = options.inputProps || {};

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={containerRef}
      className="vads-u-position--relative"
      style={{ maxWidth: '32rem' }}
      onKeyDown={onKeyDown}
    >
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-owns={listboxId}
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <va-text-input
          id={inputId}
          aria-label={labelText || inputProps['aria-label'] || 'Cemetery'}
          aria-autocomplete="list"
          aria-activedescendant={
            open && activeIndex >= 0
              ? `${listboxId}__option-${activeIndex}`
              : undefined
          }
          value={inputValue}
          onInput={handleInputChange}
          error={firstError}
          {...inputProps}
        />
      </div>

      {loading && (
        <div
          className="vads-u-font-size--sm vads-u-margin-top--0p5"
          aria-live="polite"
        >
          Loading suggestions…
        </div>
      )}

      {open &&
        suggestions.length > 0 && (
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label="Suggestions"
            className="vads-u-margin--0 vads-u-padding--0 vads-u-border--1px vads-u-border-color--gray-medium vads-u-background-color--white"
            style={{
              position: 'absolute',
              zIndex: 1000,
              width: '100%',
              maxHeight: '16rem',
              overflowY: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '4px',
            }}
          >
            {suggestions.map((suggestion, index) => {
              const raw = suggestion.label || suggestion.name || suggestion;
              const displayValue = normalizeName(raw);
              const isActive = index === activeIndex;

              return (
                <div
                  key={suggestion.id || suggestion.value || raw || index}
                  id={`${listboxId}__option-${index}`}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  className={`vads-u-padding--1 vads-u-cursor--pointer vads-u-border-bottom--1px vads-u-border-color--gray-lighter ${
                    isActive
                      ? 'vads-u-background-color--primary-alt-light vads-u-font-weight--bold'
                      : 'vads-u-background-color--white'
                  }`}
                  style={{
                    lineHeight: '1.4',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    userSelect: 'none',
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={e => {
                    e.preventDefault();
                  }}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    commitSelection(index);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      commitSelection(index);
                    }
                  }}
                >
                  {displayValue}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

AutosuggestField.propTypes = {
  onChange: PropTypes.func.isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string.isRequired,
  }).isRequired,
  formData: PropTypes.any,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.shape({
    __errors: PropTypes.array,
  }),
};

export default AutosuggestField;
