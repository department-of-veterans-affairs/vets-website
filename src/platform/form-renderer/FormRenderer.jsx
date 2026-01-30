import React from 'react';
import { getNestedProperty, renderStr } from './util';

function renderPart(part, data, depth, key = '') {
  const label = renderStr(part.label, data);
  key += `.${label}`; // eslint-disable-line no-param-reassign
  const header = { label, depth, key };
  if (part.showIf && !getNestedProperty(data, part.showIf)) {
    return [];
  }
  if ('parts' in part) {
    const { listSource } = part;
    if (listSource !== undefined) {
      const items = getNestedProperty(data, listSource);
      if (!(items instanceof Array)) {
        return [];
      }
      const renderedItems = items
        .map((item, index) => {
          item.LIST_INDEX = index + 1; // eslint-disable-line no-param-reassign
          const parts = part.parts
            .map(subpart =>
              renderPart(subpart, item, depth + 1, `${key}.${index}${1}`),
            )
            .flat();
          delete item.LIST_INDEX; // eslint-disable-line no-param-reassign
          return parts;
        })
        .flat();
      return [header, ...renderedItems];
    }
    const subparts = part.parts
      .map(subpart => renderPart(subpart, data, depth + 1, key))
      .flat();
    return [header, ...subparts];
  }
  if ('value' in part) {
    return [{ label: part.label, value: renderStr(part.value, data), key }];
  }
  if (part.style === 'checklist') {
    const options = part.options
      .filter(option => renderStr(option.value, data) === 'true')
      .map(option => option.label);
    return options.length ? [{ label: part.label, options, key }] : [];
  }
  return [];
}

function createLabel(obj) {
  const tag = `h${obj.depth + 2}`;
  const className =
    {
      h2: 'vads-u-margin-top--3',
      h3: 'vads-u-margin-top--1',
    }[tag] || '';
  return React.createElement(tag, { className, key: obj.key }, obj.label);
}

function createField(obj) {
  const label = obj.label.endsWith('?') ? obj.label : `${obj.label}:`;
  return (
    <li id={`li-${obj.key}`} key={obj.key}>
      <div key={obj.key} className="vads-grid-row vads-u-margin-x--0">
        <div className="vads-grid-col-5 vads-u-padding-x--0">{label}</div>
        <div className="vads-grid-col-7 vads-u-padding-x--2p5 vads-u-font-weight--bold">
          {obj.value}
        </div>
      </div>
    </li>
  );
}

function createChecklist(obj) {
  const label = obj.label.endsWith('?') ? obj.label : `${obj.label}:`;
  return (
    <li id={`li-${obj.key}`} key={obj.key}>
      <div key={obj.key}>
        {label}
        {obj.options.map(opt => (
          <div key={opt}>✓ {opt}</div>
        ))}
      </div>
    </li>
  );
}

function render(cfg, data) {
  let count = 0;
  let start = 1;
  const elements = [];

  const addToCurrentItems = (currentListItems, element, type) => {
    count += 1;
    if (currentListItems.length === 0) {
      start = count;
    }
    if (type === 'field') {
      currentListItems.push(createField(element));
    } else if (type === 'checklist') {
      currentListItems.push(createChecklist(element));
    }
  };

  for (const [index, section] of cfg.sections.entries()) {
    if (index > 0) {
      elements.push(
        <hr
          className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2"
          key={`HR-${index}`}
        />,
      );
    }

    let currentListItems = [];

    for (const el of renderPart(section, data, 0)) {
      if ('depth' in el) {
        if (currentListItems.length > 0) {
          elements.push(
            <ol
              start={start}
              key={`ol-${elements.length}`}
              id={`ol-${elements.length}`}
            >
              {currentListItems}
            </ol>,
          );
          currentListItems = [];
        }

        elements.push(createLabel(el));
      } else if ('value' in el) {
        addToCurrentItems(currentListItems, el, 'field');
      } else if ('options' in el) {
        addToCurrentItems(currentListItems, el, 'checklist');
      }
    }

    if (currentListItems.length > 0) {
      elements.push(
        <ol
          start={start}
          key={`ol-${elements.length}`}
          id={`ol-${elements.length}`}
        >
          {currentListItems}
        </ol>,
      );
    }
  }
  return elements;
}

const FormRenderer = ({ config, data }) => {
  const rendered = render(config, data);
  return (
    <div className="vads-grid-container vads-u-padding--0">
      <div className="vads-grid-col-12">{rendered}</div>
    </div>
  );
};

export default FormRenderer;
