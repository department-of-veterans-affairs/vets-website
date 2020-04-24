import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { links } from 'applications/caregivers/definitions/content';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export const VetInfo = () => (
  <p>Please complete all of the following information</p>
);

export const LearnMoreFamilyCaregiver = () => {
  const [isModalVisible, toggleModal] = useState(false);

  return (
    <>
      <Modal
        title="Primary Family Caregiver"
        id="primary-family-caregiver-info"
        cssClass="caregiver-modal"
        visible={isModalVisible}
        onClose={() => toggleModal(false)}
      >
        <>
          <p>
            For the purpose of the program, Primary Family Caregivers are people
            designated as a primary provider of personal care services to a
            Veteran. They can be the Veteran’s or service member’s:
          </p>

          <ul>
            <li>Parent</li>
            <li>Spouse</li>
            <li>Son or daughter</li>
            <li>Step-family member</li>
            <li>Extended family member</li>
            <li>
              Someone who is not a family member but resides with the Veteran or
              will do so upon approval
            </li>
          </ul>
        </>
      </Modal>

      <button
        type="button"
        className="va-button-link"
        onClick={() => toggleModal(!isModalVisible)}
      >
        Learn more about what this means
      </button>
    </>
  );
};

export const LearnMoreSecondaryCaregiver = () => {
  const [isModalVisible, toggleModal] = useState(false);

  return (
    <>
      <Modal
        title="Secondary Family Caregiver"
        id="primary-family-caregiver-info"
        cssClass="caregiver-modal"
        visible={isModalVisible}
        onClose={() => toggleModal(false)}
      >
        <>
          <p>
            Secondary Family Caregivers can be the Veteran’s or service
            member’s:
          </p>

          <ul>
            <li>Parent</li>
            <li>Spouse</li>
            <li>Son or daughter</li>
            <li>Step-family member</li>
            <li>Extended family member</li>
            <li>
              Someone who is not a family member but resides with the Veteran or
              will do so upon approval
            </li>
          </ul>
        </>
      </Modal>

      <button
        type="button"
        className="va-button-link"
        onClick={() => toggleModal(!isModalVisible)}
      >
        Learn more about what this means
      </button>
    </>
  );
};

export const PrimaryCaregiverInfo = ({ additionalInfo }) => (
  <div>
    <p>
      Complete the following information about the Caregiver or Family member
      who is helping the Veteran or Service member. You can also include
      information about up to two Secondary Family Caregivers.
    </p>

    {additionalInfo && (
      <section>
        <AdditionalInfo triggerText="What is a primary family caregiver">
          <p>
            A Family Member (defined herein), who is designated as a "primary
            provider of personal care services" under
            <a
              href={links.caregiverDefinition.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links.caregiverDefinition.label}
            </a>
            and who meets the requirements of
            <a
              href={links.familyCaregiver.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links.familyCaregiver.label}
            </a>
          </p>
          <LearnMoreFamilyCaregiver />
        </AdditionalInfo>
      </section>
    )}
  </div>
);

PrimaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
};

PrimaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
};

export const SecondaryCaregiverInfo = () => (
  <>
    <p>
      Complete the following information about the Secondary Caregiver or Family
      member who is helping the Veteran or Service member. You can include
      information about up to two Secondary Family Caregivers.
    </p>

    <LearnMoreSecondaryCaregiver />
  </>
);

export const FacilityInfo = () => (
  <>
    <div className="vads-u-margin-bottom--4">
      <AdditionalInfo triggerText="Can&apos;t find your clinic">
        We only include certain facilities. You should pick the medical center
        or clinic closest to your home.
      </AdditionalInfo>
    </div>

    <a
      href={links.findLocations.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      {links.findLocations.label}
    </a>
  </>
);

export const CaregiverSupportInfo = () => (
  <AdditionalInfo triggerText="What's a Caregiver Support Coordinator ?">
    A Caregiver Support Coordinator is a clinical professional who connects
    Veteran caregivers with VA and community resources that offer supportive
    programs and services. Caregiver Support Coordinators are located at every
    VA medical center and specialize in caregiving issues.
  </AdditionalInfo>
);
