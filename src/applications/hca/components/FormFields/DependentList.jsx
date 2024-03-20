import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { SESSION_ITEM_NAME, SHARED_PATHS } from '../../utils/constants';
import { normalizeFullName } from '../../utils/helpers';
import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';

// declare shared routes from the form & default states
const { dependents: DEPENDENT_PATHS } = SHARED_PATHS;
const DEFAULT_STATE = {
  modal: {
    show: false,
    item: { index: null, name: null },
  },
};

// declare default component
const DependentList = ({ labelledBy, list, mode, onDelete }) => {
  const scrollId = `hca-dependent-item--${window.sessionStorage.getItem(
    SESSION_ITEM_NAME,
  )}`;

  /**
   * declare default state variables
   *  - dependents - the array of dependent data to render
   *  - modal - the settings to trigger delete confirmation show/hide/render
   *  - listItemsRef - array of list item elements to use for focus management
   */
  const [dependents, setDependents] = useState(list);
  const [modal, setModal] = useState(DEFAULT_STATE.modal);
  const listItemsRef = useRef([]);

  /**
   * declare event handlers
   *  - onCancel - fired on modal close and secondary button click - no action taken
   *  - onConfirm - fired on modal primary button click - deletes dependent data from list
   *  - showConfirm - fired on delete button click from list item - show modal for confirmation of delete action
   */
  const handlers = {
    onCancel: () => {
      setModal(DEFAULT_STATE.modal);
    },
    onConfirm: () => {
      const dataToSet = [
        ...dependents.slice(0, modal.item.index),
        ...dependents.slice(modal.item.index + 1),
      ];
      setDependents(dataToSet);
    },
    showConfirm: item => {
      setModal({ show: true, item });
    },
  };

  // call onDelete and close modal when dependents list updates on modal confirmation
  useAfterRenderEffect(
    () => {
      onDelete(dependents);
      setModal(DEFAULT_STATE.modal);
      setTimeout(() => {
        focusElement('#root__title');
      }, 5);
    },
    [dependents],
  );

  // apply focus to specific list item when coming back from edit flow
  useEffect(
    () => {
      if (listItemsRef.current.length) {
        const elRef = listItemsRef.current.find(item => scrollId === item?.id);
        if (elRef) {
          focusElement(elRef);
          window.sessionStorage.removeItem(SESSION_ITEM_NAME);
        }
      }
    },
    [scrollId, listItemsRef],
  );

  // create dependent list items
  const listItems = dependents.map((item, index) => {
    const { fullName, dependentRelation } = item;
    const dependentName = normalizeFullName(fullName);

    return (
      <li
        key={index}
        id={`hca-dependent-item--${index}`}
        ref={el => listItemsRef.current.push(el)}
        className="hca-dependent-list--card vads-u-border--1px vads-u-border-color--gray-medium"
      >
        <span
          className="vads-u-display--block vads-u-line-height--2 vads-u-font-weight--bold dd-privacy-mask"
          data-testid="hca-dependent-tile-name"
          data-dd-action-name="Dependent name"
        >
          {dependentName}
        </span>
        <span
          className="vads-u-display--block vads-u-line-height--2 dd-privacy-mask"
          data-testid="hca-dependent-tile-relationship"
          data-dd-action-name="Dependent relationship to veteran"
        >
          {dependentRelation}
        </span>
        <span className="vads-l-row vads-u-justify-content--space-between vads-u-margin-top--2">
          <Link
            className="va-button-link hca-button-link vads-u-font-weight--bold"
            to={{
              pathname: DEPENDENT_PATHS.info,
              search: `?index=${index}&action=${mode}`,
            }}
          >
            Edit{' '}
            <span className="sr-only dd-privacy-mask">{dependentName}</span>{' '}
            <i
              role="presentation"
              className="fas fa-chevron-right vads-u-margin-left--0p5"
            />
          </Link>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="button"
            className="va-button-link hca-button-remove"
            onClick={() => handlers.showConfirm({ index, name: dependentName })}
          >
            <i
              role="presentation"
              className="fas fa-times vads-u-margin-right--0p5"
            />{' '}
            Remove{' '}
            <span className="sr-only dd-privacy-mask">{dependentName}</span>
          </button>
        </span>
      </li>
    );
  });

  return (
    <>
      <ul className="hca-dependent-list" aria-labelledby={labelledBy}>
        {listItems}
      </ul>

      <VaModal
        modalTitle="Remove this dependent?"
        primaryButtonText="Yes, remove dependent"
        secondaryButtonText="No, cancel"
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal.show}
        status="warning"
        clickToClose
        uswds
      >
        <p className="vads-u-margin--0">
          This will remove{' '}
          <strong className="dd-privacy-mask">{modal.item.name}</strong> and all
          their information from your list of dependents.
        </p>
      </VaModal>
    </>
  );
};

DependentList.propTypes = {
  labelledBy: PropTypes.string,
  list: PropTypes.array,
  mode: PropTypes.string,
  onDelete: PropTypes.func,
};

export default DependentList;
