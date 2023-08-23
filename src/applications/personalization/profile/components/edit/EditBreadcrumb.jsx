import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DivWithBackIcon = styled.div`
  &:before {
    content: ' ‹ ';
    display: inline-block;
    padding: 0px 0.35em 0px 0px;
  }
`;

export const EditBreadcrumb = ({
  href,
  onClickHandler = () => {},
  children,
  className = 'vads-u-margin-top--2 vads-u-margin-bottom--3',
}) => {
  return (
    <DivWithBackIcon className={className}>
      <a onClick={onClickHandler} href={href}>
        {children}
      </a>
    </DivWithBackIcon>
  );
};

EditBreadcrumb.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClickHandler: PropTypes.func,
};
