import React from 'react';

import Checkbox from '../../../gi/components/Checkbox.jsx';

export default ({ item, onChange, checked }) => {
  const itemContent = (
    <div
      className="preference-item"
      onClick={() => onChange(item.code, !checked)}
    >
      <div className="title-container">
        <h5 className="title-item">{item.shortTitle || item.title}</h5>
        <Checkbox
          name={item.code}
          checked={checked}
          label={
            <span className="usa-sr-only">{item.shortTitle || item.title}</span>
          }
          onChange={() => onChange(item.code, !checked)}
        />
      </div>
      <p>{item.description}</p>
    </div>
  );

  return <div className="preference-item-wrapper">{itemContent}</div>;
};
