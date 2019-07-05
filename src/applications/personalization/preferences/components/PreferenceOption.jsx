import React from 'react';

import ErrorableCheckbox from 'platform/forms-system/src/js/components/ErrorableCheckbox.jsx';

export default ({ item, onChange, checked }) => {
  const itemId = item.shortTitle
    ? item.shortTitle.replace(/\s/g, '')
    : item.title.replace(/\s/g, '');
  const itemContent = (
    <div
      className="preference-item"
      onClick={() => onChange(item.code, !checked)}
    >
      <div className="title-container">
        <h5 id={`itemTitle${itemId}`} className="title-item">
          {item.shortTitle || item.title}
        </h5>
        <ErrorableCheckbox
          name={item.code}
          checked={checked}
          label=""
          ariaLabelledBy={`itemTitle${itemId}`}
          onValueChange={() => onChange(item.code, !checked)}
        />
      </div>
      <p>{item.description}</p>
    </div>
  );

  return <div className="preference-item-wrapper">{itemContent}</div>;
};
