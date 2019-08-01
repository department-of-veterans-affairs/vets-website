import React from 'react';

import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

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
          ariaLabelledBy={`itemTitle${itemId}`}
          onValueChange={() => onChange(item.code, !checked)}
        />
      </div>
      <p>{item.description}</p>
    </div>
  );

  return <div className="preference-item-wrapper">{itemContent}</div>;
};
