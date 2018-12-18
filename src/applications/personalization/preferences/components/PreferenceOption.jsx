import React from 'react';

import Checkbox from '../../../gi/components/Checkbox.jsx';

export default ({ item, onChange, checked }) => {
  const itemContent = (
    <div className="preference-item" onClick={onChange(item.slug)}>
      <div className="title-container">
        <h5 className="title-item">{item.shortTitle || item.title}</h5>
        <Checkbox
          name={item.slug}
          checked={checked}
          label=""
          onChange={onChange(item.slug)}
        />
      </div>
      <p>{item.description}</p>
    </div>
  );

  return <div className="preference-item-wrapper">{itemContent}</div>;
};
