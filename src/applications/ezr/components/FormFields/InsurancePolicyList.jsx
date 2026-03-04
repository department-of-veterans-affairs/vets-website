import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VaAlert } from '@department-of-veterans-affairs/web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import { replaceStrValues } from '../../utils/helpers/general';
import { SESSION_ITEMS, SHARED_PATHS } from '../../utils/constants';
import { getInsuranceSrLabel } from '../../utils/helpers/insurance';
import useAfterRenderEffect from '../../hooks/useAfterRenderEffect';
import content from '../../locales/en/content.json';

// declare shared routes from the form & default states
const { insurance: INSURANCE_PATHS } = SHARED_PATHS;
const DEFAULT_STATE = {
  modal: {
    show: false,
    item: { index: null, name: null },
  },
};

// declare default component
const InsurancePolicyList = ({
  labelledBy,
  list,
  mode,
  providerErrors = [],
  onDelete,
}) => {
  const scrollIdPrefix = 'ezr-policy-item';
  const scrollId = `${scrollIdPrefix}--${window.sessionStorage.getItem(
    SESSION_ITEMS.insurance,
  )}`;

  /**
   * declare default state variables
   *  - providers - the array of insurance policy data to render
   *  - modal - the settings to trigger delete confirmation show/hide/render
   *  - listItemsRef - array of list item elements to use for focus management
   */
  const [providers, setProviders] = useState(list);
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
        ...providers.slice(0, modal.item.index),
        ...providers.slice(modal.item.index + 1),
      ];
      setProviders(dataToSet);
    },
    showConfirm: item => {
      setModal({ show: true, item });
    },
  };

  // call onDelete and close modal when policy list updates on modal confirmation
  useAfterRenderEffect(
    () => {
      onDelete(providers);
      setModal(DEFAULT_STATE.modal);
      setTimeout(() => {
        focusElement('#root__title');
      }, 5);
    },
    [providers],
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
  const listItems = providers.map((item, index) => {
    const { insuranceName, insurancePolicyHolderName } = item;
    const srLabel = getInsuranceSrLabel(item);
    const modalDescription = replaceStrValues(
      content['insurance-modal-remove-description'],
      insuranceName,
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
          data-dd-action-name="Insurance provider"
          aria-hidden
        >
          {insuranceName}
        </span>
        <span className="sr-only dd-privacy-mask">{srLabel}</span>
        <span
          className="vads-u-display--block vads-u-line-height--2 dd-privacy-mask"
          data-testid="ezr-listloop-tile--subtitle"
          data-dd-action-name="Insurance policyholder name"
        >
          {content['insurance-policy-tile-label']} {insurancePolicyHolderName}
        </span>
        <VaAlert
          visible={providerErrors.includes(index)}
          status="error"
          className="vads-u-margin-top--2"
        >
          This provider is missing information. Edit and complete this
          provider’s information before continuing.
        </VaAlert>
        <span className="vads-l-row vads-u-justify-content--space-between vads-u-margin-top--2">
          <Link
            className="va-button-link ezr-button-link vads-u-font-weight--bold"
            to={{
              pathname: INSURANCE_PATHS.info,
              search: `?index=${index}&action=${mode}`,
            }}
          >
            {content['button-edit']}{' '}
            <span className="sr-only dd-privacy-mask">{srLabel}</span>{' '}
            <va-icon icon="chevron_right" size={3} />
          </Link>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="button"
            className="va-button-link ezr-button-remove"
            onClick={() =>
              handlers.showConfirm({ index, description: modalDescription })
            }
          >
            <va-icon icon="close" size={3} /> {content['button-remove']}{' '}
            <span className="sr-only dd-privacy-mask">{srLabel}</span>
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

InsurancePolicyList.propTypes = {
  labelledBy: PropTypes.string,
  list: PropTypes.array,
  mode: PropTypes.string,
  providerErrors: PropTypes.array,
  onDelete: PropTypes.func,
};

export default InsurancePolicyList;
