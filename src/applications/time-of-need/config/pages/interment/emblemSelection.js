import React from 'react';

// Static emblem list (images removed)
const EMBLEMS = [
  { id: 1, label: 'Latin (Christian) Cross' },
  { id: 2, label: 'Buddhist' },
  { id: 3, label: 'Judaism (Star of David)' },
  { id: 4, label: 'Presbyterian Cross' },
  { id: 5, label: 'Russian Orthodox Cross' },
  { id: 6, label: 'Lutheran Cross' },
  { id: 7, label: 'Episcopal Cross' },
  { id: 8, label: 'Unitarian (Flaming Chalice)' },
  { id: 9, label: 'United Methodist' },
  { id: 10, label: 'Aaronic Order Church' },
  { id: 11, label: 'Mormon (Angel Moroni)' },
  { id: 12, label: 'Native American Church of North America' },
  { id: 13, label: 'Serbian Orthodox' },
  { id: 14, label: 'Greek Cross' },
  { id: 15, label: 'Bahai (9-Pointed Star)' },
  { id: 16, label: 'Atheist' },
  { id: 17, label: 'Muslim (Crescent and Star)' },
  { id: 18, label: 'Hindu' },
  { id: 19, label: 'Konko-Kyo Faith' },
  { id: 20, label: 'Community of Christ' },
  { id: 21, label: 'Sufism Reoriented' },
  { id: 22, label: 'Tenrikyo Church' },
  { id: 23, label: 'Seicho-No-Ie' },
  { id: 24, label: 'The Church of World Messianity' },
  { id: 25, label: 'United Church of Religious Science' },
  { id: 26, label: 'Christian Reformed Church' },
  { id: 27, label: 'United Moravian Church' },
  { id: 28, label: 'Eckankar' },
  { id: 29, label: 'Christian Church' },
  { id: 30, label: 'Christian & Missionary Alliance' },
  { id: 31, label: 'United Church of Christ' },
  { id: 32, label: 'Humanist Emblem of Spirit' },
  { id: 33, label: 'Presbyterian Church (USA)' },
  { id: 34, label: 'Izumo Taishakyo Mission of Hawaii' },
  { id: 35, label: 'Soka Gakkai International (USA)' },
  { id: 36, label: 'Sikh (Khanda)' },
  { id: 37, label: 'Wicca (Pentacle)' },
  { id: 38, label: 'Lutheran Church Missouri Synod' },
  { id: 39, label: 'New Apostolic' },
  { id: 40, label: 'Seventh Day Adventist Church' },
  { id: 41, label: 'Celtic Cross' },
  { id: 42, label: 'Armenian Cross' },
  { id: 43, label: 'Farohar' },
  { id: 44, label: 'Messianic Jewish' },
  { id: 45, label: 'Kohen Hands' },
  { id: 46, label: 'Catholic Celtic Cross' },
];

const emblemValues = EMBLEMS.map(e => String(e.id));
const numberedLabels = EMBLEMS.map(e => `(${e.id}) ${e.label}`);

const displayMap = EMBLEMS.reduce((acc, e) => {
  acc[String(e.id)] = `(${e.id}) ${e.label}`;
  return acc;
}, {});

// Fixed: proper event binding for va-select
const NumberedEmblemSelect = props => {
  const {
    value,
    onChange,
    required,
    disabled,
    options,
    rawErrors = [],
  } = props;
  const enumOptions = options.enumOptions || [];

  const handleChange = React.useCallback(
    e => {
      const next = e?.detail?.value ?? e?.target?.value ?? '';
      onChange(next || undefined);
    },
    [onChange],
  );

  const selectRef = React.useRef(null);

  React.useEffect(
    () => {
      const el = selectRef.current;
      const events = ['vaSelect', 'input', 'change'];

      if (el) {
        events.forEach(evt => el.addEventListener(evt, handleChange));
      }

      return () => {
        if (el) {
          events.forEach(evt => el.removeEventListener(evt, handleChange));
        }
      };
    },
    [handleChange],
  );

  React.useEffect(
    () => {
      const el = selectRef.current;
      if (el && el.value !== (value || '')) {
        el.value = value || '';
      }
    },
    [value],
  );

  return (
    <div className="vads-u-margin-bottom--3" style={{ maxWidth: '420px' }}>
      <va-select
        ref={selectRef}
        name="selectedEmblem"
        label={`Select an emblem of belief${required ? ' *' : ''}`}
        required={required}
        disabled={disabled}
        value={value || ''}
        // React won't handle custom events, listener added manually
      >
        <option value="">- Select -</option>
        {enumOptions.map(o => (
          <option key={o.value} value={o.value}>
            {displayMap[o.value] || o.label}
          </option>
        ))}
      </va-select>
      {rawErrors?.length > 0 && (
        <span className="usa-input-error-message">{rawErrors[0]}</span>
      )}
    </div>
  );
};

export default {
  uiSchema: {
    'ui:description': (
      <h3 className="vads-u-margin-top--0">Emblem of belief</h3>
    ),
    selectedEmblem: {
      'ui:title': '',
      'ui:widget': NumberedEmblemSelect,
      'ui:required': () => true,
      'ui:options': {
        hideLabelText: true,
        labels: displayMap,
        updateSchema: () => ({
          type: 'string',
          enum: emblemValues,
          enumNames: numberedLabels,
        }),
      },
      'ui:errorMessages': {
        required: 'Select an emblem',
      },
    },
    'view:emblemLink': {
      'ui:description': (
        <p className="vads-u-margin-top--2">
          <a
            href="https://www.cem.va.gov/hmm/emblems.asp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about emblems of belief (Opens in a new tab)
          </a>
        </p>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['selectedEmblem'],
    properties: {
      selectedEmblem: {
        type: 'string',
        enum: emblemValues,
        enumNames: numberedLabels,
      },
      'view:emblemLink': { type: 'object', properties: {} },
    },
  },
};
