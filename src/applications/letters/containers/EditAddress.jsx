import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FIELD_NAMES, ACTIVE_EDIT_VIEWS } from '@@vap-svc/constants';
import InitializeVAPServiceID from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
import {
  selectAddressValidationType,
  selectCurrentlyOpenEditModal,
} from 'platform/user/profile/vap-svc/selectors';
import { focusElement } from 'platform/utilities/ui';

import { useNavigate } from 'react-router-dom-v5-compat';

import ProfileInformationFieldController from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';

export function EditAddress() {
  const navigate = useNavigate();
  const addressValidationType = useSelector(selectAddressValidationType);
  const activeEditView = useSelector(selectCurrentlyOpenEditModal);

  const showValidationView =
    addressValidationType === FIELD_NAMES.MAILING_ADDRESS &&
    activeEditView === ACTIVE_EDIT_VIEWS.ADDRESS_VALIDATION;

  useEffect(() => {
    focusElement('h2');
  }, []);

  return (
    <div className="usa-width-three-fourths letters vads-u-margin-top--2 ">
      <h2
        tabIndex={-1}
        className={!showValidationView ? 'vads-u-margin-bottom--3' : null}
      >
        Edit mailing address
      </h2>

      {!showValidationView && (
        <>
          <va-alert status="info" class="vads-u-margin-bottom--3">
            <p className="vads-u-margin-y--0">
              Changing your address here will also update it in your VA.gov
              profile and across several VA benefits and services.
              <br />
              <a
                href="https://www.va.gov/change-address/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About changing your address in your VA.gov profile (opens in new
                tab)
              </a>
            </p>
          </va-alert>
          <va-additional-info
            id="dont-have-address"
            class="dont-have-address vads-u-margin-bottom--3"
            trigger="If you don’t have an address"
          >
            <div>
              If you don't have a mailing address you can use{' '}
              <a
                href="https://faq.usps.com/s/article/What-is-General-Delivery"
                target="_blank"
                rel="noopener noreferrer"
              >
                General Delivery (opens in new tab)
              </a>{' '}
              through your local post office.
              <br />
              <br />
              If you’re a Veteran who is homeless or at risk of homelessness, we
              encourage you to contact the National Call Center for Homeless
              Veterans at <va-telephone
                contact="8772228387"
                vanity="VETS"
              />{' '}
              for assistance.
            </div>
          </va-additional-info>
        </>
      )}
      <div className="vads-u-margin-bottom--1 letters--edit-address">
        <InitializeVAPServiceID>
          <ProfileInformationFieldController
            forceEditView
            fieldName={FIELD_NAMES.MAILING_ADDRESS}
            isDeleteDisabled
            cancelCallback={() => navigate('/letter-page')}
            successCallback={() =>
              navigate('/letter-page', {
                state: {
                  success: true,
                },
              })
            }
            saveButtonText="Save address"
            cancelButtonText="Cancel edit"
          />
        </InitializeVAPServiceID>
      </div>
      <va-need-help class="vads-u-margin-top--9">
        <div slot="content">
          <p>
            Call us at <va-telephone contact="8008271000" />. We're here Monday
            through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,
            call <va-telephone contact="711" tty="true" />.
          </p>
        </div>
      </va-need-help>
    </div>
  );
}

export default EditAddress;
