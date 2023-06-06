import React from 'react';
import { CSSTransition } from 'react-transition-group';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import AdvancedSearchForm from './AdvancedSearchForm';

const AdvancedSearchExpander = props => {
  const { nodeRef, advancedOpen, folders, setAdvancedOpen } = props;

  return (
    <div className="advanced-search-expander">
      <button
        type="button"
        onClick={() => {
          setAdvancedOpen(!advancedOpen);
          recordEvent({
            event: advancedOpen
              ? 'int-additional-info-collapse'
              : 'int-additional-info-expand',
            'additional-info-click-label': 'Advanced search',
          });
        }}
        className="advanced-search-toggle"
        data-testid="advanced-search-toggle"
      >
        <span className="advanced-toggle-text">Advanced search</span>
        <i
          className={`fas fa-angle-down advanced-toggle-icon ${advancedOpen &&
            'advanced-toggle-icon-active'}`}
          aria-hidden="true"
        />
      </button>

      <CSSTransition
        in={advancedOpen}
        nodeRef={nodeRef}
        timeout={700}
        classNames="advanced-open"
        unmountOnExit
      >
        <div ref={nodeRef} className="advanced-search">
          <AdvancedSearchForm folders={folders} />
        </div>
      </CSSTransition>
    </div>
  );
};

AdvancedSearchExpander.propTypes = {
  advancedOpen: PropTypes.bool.isRequired,
  folders: PropTypes.arrayOf(PropTypes.object).isRequired,
  nodeRef: PropTypes.object.isRequired,
  setAdvancedOpen: PropTypes.func.isRequired,
};

export default AdvancedSearchExpander;
