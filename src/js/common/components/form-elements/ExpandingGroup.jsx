import React from 'react';

export default function ExpandingGroup({ children, open }) {
  return (
    <div className={open ? 'form-expanding-group form-expanding-group-open' : 'form-expanding-group'}>
      {children[0]}
      <div className={open ? 'form-expanding-group-inner-open' : 'form-expanding-group-inner-closed'}>
        {children[1]}
      </div>
    </div>
  );
}
