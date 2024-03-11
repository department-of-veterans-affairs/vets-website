import React, { Fragment } from 'react';
import PageLink from './PageLink';

const ListItem = ({ item, className }) => {
  return (
    <li>
      {item.content.map((ele, index) => {
        if (ele.type === 'link') {
          return (
            <Fragment key={index}>
              <PageLink
                href={ele.href}
                target={ele.target}
                text={ele.value}
                isEmail={ele.isEmail}
              />
              {index !== item.content.length - 1 &&
              !ele.value.endsWith('System')
                ? ' '
                : ''}
            </Fragment>
          );
        }
        if (ele.type === 'phone') {
          return (
            <Fragment key={index}>
              <va-telephone contact="" />
            </Fragment>
          );
        }
        return (
          <span className={className?.li} key={index}>
            {ele.value}
          </span>
        );
      })}
    </li>
  );
};

export default ListItem;
