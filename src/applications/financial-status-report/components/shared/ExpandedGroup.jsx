import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

const ExpandedGroup = ({
  open,
  showPlus,
  children,
  additionalClass,
  expandedContentId,
}) => {
  const [visibleChild, hiddenChild] = React.Children.toArray(children);

  return (
    <div>
      {visibleChild}
      {showPlus && <span>{open ? '-' : '+'}</span>}
      <CSSTransition
        in={open}
        timeout={300}
        classNames="expanded-group"
        unmountOnExit
        id={expandedContentId}
      >
        <div className={classNames(additionalClass)}>{hiddenChild}</div>
      </CSSTransition>
    </div>
  );
};

ExpandedGroup.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  additionalClass: PropTypes.string,
  expandedContentId: PropTypes.string,
  showPlus: PropTypes.bool,
};

ExpandedGroup.defaultProps = {
  showPlus: false,
  additionalClass: '',
  expandedContentId: '',
};

export default ExpandedGroup;
