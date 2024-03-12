import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
              <VaLink text={ele.number} href={`tel:${ele.value}`} />
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
ListItem.propTypes = {
  className: PropTypes.object,
  item: PropTypes.object,
};

export default ListItem;
