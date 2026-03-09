import React from 'react';
import PropTypes from 'prop-types';
import { getNestedProperty, renderStr, formatPhoneNumber } from './util';

import './sass/FormRenderer.scss';

function createLabel(obj) {
  const tag = `h${obj.depth + 2}`;
  const className =
    {
      h2: 'vads-u-margin-top--3 vads-u-margin-bottom--0',
      h3: 'vads-u-margin-top--1 vads-u-margin-bottom--1',
      h4: 'vads-u-margin-top--2 vads-u-margin-bottom--1',
    }[tag] || '';
  return React.createElement(tag, { className, key: obj.key }, obj.label);
}

function createField(obj) {
  const { label } = obj;
  return (
    <li id={`li-${obj.key}`} key={obj.key}>
      <div key={obj.key} className="vads-grid-row vads-u-margin-x--0">
        <div className="vads-grid-col-5 vads-u-padding-x--0">{label}</div>
        <div className="vads-grid-col-7 vads-u-padding-x--2p5 vads-u-font-weight--bold">
          {obj.label === 'Phone number'
            ? formatPhoneNumber(obj.value)
            : obj.value}
        </div>
      </div>
    </li>
  );
}

function createChecklist(obj) {
  const label = obj.label.endsWith('?') ? obj.label : `${obj.label}:`;
  return (
    <li id={`li-${obj.key}`} key={obj.key}>
      <div key={obj.key} className="vads-grid-row">
        <div className="vads-grid-col-5">{label}</div>
        <div className="vads-grid-col-6 vads-u-font-weight--bold vads-u-margin-left--2">
          <ul className="no-bullets">
            {obj.options.map(opt => {
              return (
                <li key={opt}>
                  <div>✓ {opt}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

function emit(obj) {
  return [obj];
}

function renderPart(part, data, depth, key) {
  if (part.showIf && !getNestedProperty(data, part.showIf)) {
    return [];
  }

  function getSubpartsKey() {
    if (part.blocks) {
      return 'blocks';
    }
    if (part.fields) {
      return 'fields';
    }
    return null;
  }
  if (getSubpartsKey()) {
    const label = renderStr(part.sectionHeader || part.blockLabel, data);
    const header = { label, depth, key };
    emit(header);
    let paramKey = key;
    paramKey += `.${getSubpartsKey()}`;
    const subparts = part[getSubpartsKey()];
    const { repeatable } = part;
    if (repeatable) {
      const items = getNestedProperty(data, repeatable);
      if (!(items instanceof Array)) {
        return [];
      }
      const renderedItems = items
        .map((item, index) => {
          const itemListIndex = item;
          itemListIndex.LIST_INDEX = index + 1;
          const parts = (part.blocks || part.fields)
            .map(subpart =>
              renderPart(subpart, item, depth + 1, `${paramKey}[${index}]`),
            )
            .flat();
          delete itemListIndex.LIST_INDEX;
          return parts;
        })
        .flat();
      return [header, ...renderedItems];
    }
    const renderedSubparts = subparts
      .map((subpart, index) =>
        renderPart(subpart, data, depth + 1, `${paramKey}[${index}]`),
      )
      .flat();
    return [header, ...renderedSubparts];
  }
  if ('fieldValue' in part) {
    return emit({
      label: part.fieldLabel,
      value: renderStr(part.fieldValue, data),
      key,
    });
  }
  if (part.style === 'checklist') {
    const options = part.options
      .filter(option => renderStr(option.value, data) === 'true')
      .map(option => option.label);
    return emit(options.length ? { label: part.label, options, key } : null);
  }
  return [];
}

function render(cfg, data) {
  let listItemCount = 0;
  let orderedListCount = 0;
  const elements = [];

  const addToCurrentItems = (currentListItems, element, type) => {
    listItemCount += 1;
    if (type === 'field') {
      currentListItems?.push(createField(element));
    } else if (type === 'checklist') {
      currentListItems?.push(createChecklist(element));
    }
  };

  const createList = (currentListItems, index) => {
    const start = listItemCount - currentListItems.length + 1;
    const olId = `ol-section-${index}-group-${orderedListCount}`;
    const descId = `${olId}-continue`;
    elements.push(
      <div key={olId}>
        {orderedListCount > 0 && (
          <p id={descId} className="sr-only">
            Question numbering continues from the previous section.
          </p>
        )}
        <ol
          {...orderedListCount > 0 && {
            'aria-describedby': descId,
          }}
          start={start}
          id={olId}
        >
          {currentListItems}
        </ol>
      </div>,
    );
    orderedListCount += 1;
  };

  for (const [index, section] of cfg.sections.entries()) {
    if (index > 0) {
      elements.push(
        <hr
          className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--4"
          key={`HR-${index}`}
        />,
      );
    }

    let currentListItems = [];

    for (const el of renderPart(section, data, 0, `.sections[${index}]`)) {
      if ('depth' in el) {
        if (currentListItems?.length > 0) {
          createList(currentListItems, index);
          currentListItems = [];
        }
        elements.push(createLabel(el));
      } else if ('value' in el) {
        addToCurrentItems(currentListItems, el, 'field');
      } else if ('options' in el) {
        addToCurrentItems(currentListItems, el, 'checklist');
      }
    }

    if (currentListItems?.length > 0) {
      createList(currentListItems, index);
      currentListItems = [];
    }
  }

  return elements;
}

const FormRenderer = ({ config, data }) => {
  const rendered = render(config, data);
  return (
    <div className="digital-forms-renderer vads-grid-container vads-u-padding--0">
      <div className="vads-grid-col-12">
        {/* <h1 className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Add or remove a dependent on VA benefits{" "}
          <span className="form-name">(VA Form 21-686c)</span>
        </h1>
        <div>OMB Version Aug 2024, Release 1.3.4</div> */}
        {rendered}
      </div>
    </div>
  );
};

FormRenderer.propTypes = {
  config: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default FormRenderer;
