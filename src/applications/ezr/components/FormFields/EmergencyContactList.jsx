import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import {
  normalizeFullName,
  replaceStrValues,
} from '../../utils/helpers/general';
import { SESSION_ITEMS, SHARED_PATHS } from '../../utils/constants';
// import { getInsuranceSrLabel } from '../../utils/helpers/insurance';
import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';
import content from '../../locales/en/content.json';

// declare shared routes from the form & default states
const { veteranContacts: EMERGENCY_CONTACT_PATHS } = SHARED_PATHS;
const DEFAULT_STATE = {
  modal: {
    show: false,
    item: { index: null, name: null },
  },
};

// declare default component
const EmergencyContactList = ({ labelledBy, list, mode, onDelete }) => {
  const scrollIdPrefix = 'ezr-policy-item';
  const scrollId = `${scrollIdPrefix}--${window.sessionStorage.getItem(
    SESSION_ITEMS.emergencyContact,
  )}`;

  /**
   * declare default state variables
   *  - providers - the array of insurance policy data to render
   *  - modal - the settings to trigger delete confirmation show/hide/render
   *  - listItemsRef - array of list item elements to use for focus management
   */
  const [veteranContacts, setVeteranContacts] = useState(list);
  const [modal, setModal] = useState(DEFAULT_STATE.modal);
  const listItemsRef = useRef([]);

  /**
   * declare event handlers
   *  - onCancel - fired on modal close and secondary button click - no action taken
   *  - onConfirm - fired on modal primary button click - deletes policy data from list
   *  - showConfirm - fired on delete button click from list item - show modal for confirmation of delete action
   */
  const handlers = {
    onCancel: () => {
      setModal(DEFAULT_STATE.modal);
    },
    onConfirm: () => {
      const dataToSet = [
        ...veteranContacts.slice(0, modal.item.index),
        ...veteranContacts.slice(modal.item.index + 1),
      ];
      setVeteranContacts(dataToSet);
    },
    showConfirm: item => {
      setModal({ show: true, item });
    },
  };

  // call onDelete and close modal when policy list updates on modal confirmation
  useAfterRenderEffect(
    () => {
      onDelete(veteranContacts);
      setModal(DEFAULT_STATE.modal);
      setTimeout(() => {
        focusElement('#root__title');
      }, 5);
    },
    [veteranContacts],
  );

  // apply focus to specific list item when coming back from edit flow
  useEffect(
    () => {
      if (listItemsRef.current.length) {
        const elRef = listItemsRef.current.find(item => scrollId === item?.id);
        if (elRef) {
          focusElement(elRef);
          window.sessionStorage.removeItem(SESSION_ITEMS.insurance);
        }
      }
    },
    [scrollId, listItemsRef],
  );

  // create policy list items
  const listItems = veteranContacts.map((item, index) => {
    const { fullName, relationship } = item;
    const emergencyContactName = normalizeFullName(fullName);
    const modalDescription = replaceStrValues(
      content['household-dependent-modal-remove-description'],
      emergencyContactName,
    );

    return (
      <li
        key={index}
        id={`${scrollIdPrefix}--${index}`}
        ref={el => listItemsRef.current.push(el)}
        className="ezr-listloop--tile vads-u-border--1px vads-u-border-color--gray-medium"
      >
        <span
          className="vads-u-display--block vads-u-line-height--2 vads-u-font-weight--bold dd-privacy-mask"
          data-testid="ezr-listloop-tile--title"
          data-dd-action-name="Dependent name"
        >
          {emergencyContactName}
        </span>
        <span
          className="vads-u-display--block vads-u-line-height--2 dd-privacy-mask"
          data-testid="ezr-listloop-tile--subtitle"
          data-dd-action-name="Dependent relationship to veteran"
        >
          {relationship}
        </span>
        <span className="vads-l-row vads-u-justify-content--space-between vads-u-margin-top--2">
          <Link
            className="va-button-link ezr-button-link vads-u-font-weight--bold"
            to={{
              pathname: EMERGENCY_CONTACT_PATHS.info,
              search: `?index=${index}&action=${mode}`,
            }}
          >
            {content['button-edit']}{' '}
            <span className="sr-only dd-privacy-mask">
              {emergencyContactName}
            </span>{' '}
            <i
              role="presentation"
              className="fas fa-chevron-right vads-u-margin-left--0p5"
            />
          </Link>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="button"
            className="va-button-link ezr-button-remove"
            onClick={() =>
              handlers.showConfirm({ index, description: modalDescription })
            }
          >
            <i
              role="presentation"
              className="fas fa-times vads-u-margin-right--0p5"
            />{' '}
            {content['button-remove']}{' '}
            <span className="sr-only dd-privacy-mask">
              {emergencyContactName}
            </span>
          </button>
        </span>
      </li>
    );
  });

  return (
    <>
      <ul className="ezr-listloop--list" aria-labelledby={labelledBy}>
        {listItems}
      </ul>

      <VaModal
        modalTitle={content['insurance-modal-remove-title']}
        primaryButtonText={content['insurance-modal-remove-button-text']}
        secondaryButtonText={content['button-modal-cancel']}
        onPrimaryButtonClick={handlers.onConfirm}
        onSecondaryButtonClick={handlers.onCancel}
        onCloseEvent={handlers.onCancel}
        visible={modal.show}
        status="warning"
        clickToClose
        uswds
      >
        <p className="vads-u-margin--0">{modal.item.description}</p>
      </VaModal>
    </>
  );
};

EmergencyContactList.propTypes = {
  labelledBy: PropTypes.string,
  list: PropTypes.array,
  mode: PropTypes.string,
  onDelete: PropTypes.func,
};

export default EmergencyContactList;
