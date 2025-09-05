/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';

const AutosuggestField = props => {
  const { formData, onChange, uiSchema = {}, idSchema, errorSchema } = props;

  const options = uiSchema['ui:options'] || {};
  const { getOptions } = options;
  const inputId = idSchema.$id;
  const listboxId = `${inputId}__listbox`;

  const [inputValue, setInputValue] = useState(formData || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);

  useEffect(
    () => {
      let active = true;

      if (!getOptions || !inputValue) {
        setSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
      } else {
        setLoading(true);
        Promise.resolve(getOptions(inputValue))
          .then(list => {
            if (!active) return;
            const arr = Array.isArray(list) ? list : [];
            setSuggestions(arr);
            setOpen(arr.length > 0);
            setActiveIndex(arr.length ? 0 : -1);
          })
          .catch(() => {
            if (active) {
              setSuggestions([]);
              setOpen(false);
              setActiveIndex(-1);
            }
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      }

      return () => {
        active = false;
      };
    },
    [inputValue, getOptions],
  );

  const commitSelection = useCallback(
    index => {
      const item = suggestions[index];
      if (!item) return;
      const value = item.label || item.name || item;
      setInputValue(value);
      onChange(value);
      setOpen(false);
      setActiveIndex(-1);
    },
    [suggestions, onChange],
  );

  useEffect(() => {
    const handleClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const firstError = errorSchema?.__errors?.[0];

  const onKeyDown = e => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (suggestions.length) {
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!suggestions.length) return;
        setActiveIndex(i => (i + 1 >= suggestions.length ? 0 : i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!suggestions.length) return;
        setActiveIndex(i => (i - 1 < 0 ? suggestions.length - 1 : i - 1));
        break;
      case 'Enter':
        if (open && activeIndex > -1) {
          e.preventDefault();
          commitSelection(activeIndex);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
        break;
      default:
    }
  };

  const rawTitle = uiSchema['ui:title'];
  const labelText = typeof rawTitle === 'string' ? rawTitle : undefined;
  const inputProps = options.inputProps || {};

  const normalizeName = str => {
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
  };

  return (
    <div
      ref={containerRef}
      className="vads-u-position--relative"
      style={{ maxWidth: '32rem' }}
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
          label={labelText}
          aria-label={labelText || inputProps['aria-label'] || 'Cemetery'}
          value={inputValue}
          onInput={e => {
            const val = e?.target?.value ?? e?.detail?.value ?? '';
            setInputValue(val);
            onChange(val);
          }}
          onKeyDown={onKeyDown}
          error={firstError}
          {...inputProps}
        />
      </div>

      {loading && (
        <div className="vads-u-font-size--sm vads-u-margin-top--0p5">
          Loading…
        </div>
      )}

      {open &&
        suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="vads-u-margin--0 vads-u-padding--0 vads-u-border--1px vads-u-border-color--gray-medium vads-u-background-color--white"
            style={{
              listStyle: 'none',
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              maxHeight: '16rem',
              overflowY: 'auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {suggestions.map((s, i) => {
              const raw = s.label || s.name || s;
              const displayValue = normalizeName(raw);
              const active = i === activeIndex;
              return (
                <li
                  key={s.id || raw}
                  id={`${listboxId}__option-${i}`}
                  role="option"
                  aria-selected={active}
                  style={{
                    background: active ? '#e6f0f6' : 'transparent',
                  }}
                >
                  <va-button
                    text=""
                    onClick={() => commitSelection(i)}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      fontWeight: active ? 600 : 'normal',
                      background: 'none',
                      border: 'none',
                      color: '#000',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                    }}
                    onMouseDown={e => e.preventDefault()}
                    aria-label={raw}
                  />
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
};

export default AutosuggestField;
