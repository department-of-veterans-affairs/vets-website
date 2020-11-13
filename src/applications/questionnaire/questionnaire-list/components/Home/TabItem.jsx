import React from 'react';

export default function TabItem(props) {
  const { href, id, text } = props;
  return (
    <li role="presentation">
      <a role="tab" href={`${href}`} id={`${id}`}>
        {text}
      </a>
    </li>
  );
}
