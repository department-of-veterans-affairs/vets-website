import React from 'react';
import { CHAPTER_TYPE } from '../../config/enums';

export const getCardDescription = (item, type) => {
  // If 'item' does NOT exist (is falsy), return null immediately.
  if (!item) {
    return null;
  }

  if (type === CHAPTER_TYPE.CHARACTER) {
    return (
      <>
        <p>
          <b>Phone Number:</b> {item?.phone}
        </p>
        <p>
          <b>Email:</b> {item?.email}
        </p>
        <p>
          <b>Relationship:</b> {item?.relationship}
        </p>
      </>
    );
  }

  return 'test';
};
