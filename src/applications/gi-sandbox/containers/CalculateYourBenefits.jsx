import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  eligibilityChange,
  updateEstimatedBenefits,
} from '../actions';
import { getCalculatedBenefits } from '../selectors/calculator';
import CalculateYourBenefitsForm from '../components/profile/CalculateYourBenefitsForm';
import EstimatedBenefits from '../components/profile/EstimatedBenefits';
import EstimateYourBenefitsSummarySheet from '../components/profile/EstimateYourBenefitsSummarySheet';
import recordEvent from 'platform/monitoring/record-event';
import LearnMoreLabel from '../components/LearnMoreLabel';

export function CalculateYourBenefits({
  calculated,
  calculator,
  dispatchBeneficiaryZIPCodeChanged,
  dispatchCalculatorInputChange,
  dispatchEligibilityChange,
  dispatchShowModal,
  dispatchUpdateEstimatedBenefits,
  eligibility,
  estimatedBenefits,
  gibctEybBottomSheet,
  profile,
  isOJT,
}) {
  const [showEybSheet, setShowEybSheet] = useState(false);
  const [expandEybSheet, setExpandEybSheet] = useState(false);

  useEffect(() => {
    dispatchUpdateEstimatedBenefits(calculated.outputs);

    const handleScroll = () => {
      const topOffset =
        document
          .getElementById('estimate-your-benefits-accordion')
          ?.getBoundingClientRect().top -
          12 <
        0;

      const sheetHeight = document.getElementsByClassName('eyb-sheet')[0]
        ?.offsetHeight;
      const calculateButtonHeight =
        document.getElementsByClassName('calculate-button')[0]?.offsetHeight +
        1;

      const bottomOffset =
        document
          .getElementsByClassName('calculate-button')[0]
          ?.getBoundingClientRect().top -
          window.innerHeight +
          sheetHeight +
          calculateButtonHeight >
        0;

      if (topOffset && bottomOffset) {
        if (showEybSheet === false) {
          setShowEybSheet(true);
        }
      } else if (showEybSheet === true) {
        setShowEybSheet(false);
        setExpandEybSheet(false);
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const toggleEybExpansion = () => {
    if (expandEybSheet) {
      document.body.style.overflow = 'visible';
      setExpandEybSheet(false);
    } else {
      document.body.style.overflow = 'hidden';
      setExpandEybSheet(true);
    }
  };

  if (isEmpty(estimatedBenefits)) {
    return <LoadingIndicator message="Loading your estimated benefits..." />;
  }

  const outputs = estimatedBenefits;
  const inputs = calculator;
  const displayed = calculated.inputs;

  const spacerClassNames = classNames(
    'medium-1',
    'columns',
    'small-screen:vads-u-margin-right--neg1',
    'small-screen:vads-u-margin--0',
    'vads-u-margin-top--1',
  );

  const summarySheetClassNames = classNames(
    'vads-u-display--block',
    'small-screen:vads-u-display--none',
    'eyb-sheet',
    {
      open: showEybSheet,
    },
  );

  return (
    <div>
      <div className="row calculate-your-benefits">
        <CalculateYourBenefitsForm
          profile={profile}
          eligibility={eligibility}
          eligibilityChange={dispatchEligibilityChange}
          inputs={inputs}
          displayedInputs={displayed}
          showModal={dispatchShowModal}
          calculatorInputChange={dispatchCalculatorInputChange}
          onBeneficiaryZIPCodeChanged={dispatchBeneficiaryZIPCodeChanged}
          estimatedBenefits={estimatedBenefits}
          updateEstimatedBenefits={() =>
            dispatchUpdateEstimatedBenefits(calculated.outputs)
          }
        />
        <div className={spacerClassNames}>&nbsp;</div>
        <EstimatedBenefits
          outputs={outputs}
          profile={profile}
          calculator={inputs}
          isOJT={isOJT}
          dispatchShowModal={dispatchShowModal}
        />
        {gibctEybBottomSheet && (
          <div>
            {expandEybSheet && (
              <div onClick={toggleEybExpansion} className="va-modal overlay" />
            )}
            {
              <div id="eyb-summary-sheet" className={summarySheetClassNames}>
                <EstimateYourBenefitsSummarySheet
                  outputs={outputs}
                  expandEybSheet={expandEybSheet}
                  showEybSheet={showEybSheet}
                  toggleEybExpansion={toggleEybExpansion}
                  type={calculator.type}
                  yellowRibbon={calculator.yellowRibbonRecipient === 'yes'}
                />
              </div>
            }
          </div>
        )}
      </div>
      {!isOJT && (
        <>
          <div className="subsection">
            <h3 className="small-screen-header">
              Additional information regarding your benefits
            </h3>
          </div>

          <div className="vads-u-padding-bottom--1 small-screen-font">
            <strong>Veterans tuition policy:</strong>{' '}
            {profile.attributes.vetWebsiteLink ? 'Yes' : 'No'}
            {profile.attributes.vetWebsiteLink && (
              <span>
                &nbsp;(
                <a
                  href={profile.attributes.vetWebsiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View policy
                </a>
                )
              </span>
            )}
          </div>

          <div className="vads-u-padding-bottom--1 small-screen-font">
            <LearnMoreLabel
              text={'Protection against late VA payments'}
              onClick={() => {
                recordEvent({
                  event: 'gibct-modal-displayed',
                  'gibct-modal-displayed':
                    'protection-against-late-va-payments',
                });
                dispatchShowModal('section103');
              }}
              buttonClassName="small-screen-font"
              bold
            />
            <strong>:</strong>
            &nbsp;
            {profile.attributes.section103Message
              ? profile.attributes.section103Message
              : 'No'}
          </div>

          <div className="vads-u-padding-bottom--1 small-screen-font">
            <LearnMoreLabel
              text={'Yellow Ribbon Program'}
              onClick={() => {
                recordEvent({
                  event: 'gibct-modal-displayed',
                  'gibct-modal-displayed': 'yribbon',
                });
                dispatchShowModal('yribbon');
              }}
              buttonClassName="small-screen-font"
              bold
            />
            <strong>:</strong>
            &nbsp;
            {profile.attributes.yr ? 'Yes' : 'No'}
          </div>

          <div className="vads-u-padding-bottom--1 small-screen-font">
            <LearnMoreLabel
              text={'Veteran Rapid Retraining Assistance Program (VRRAP)'}
              onClick={() => {
                recordEvent({
                  event: 'gibct-modal-displayed',
                  'gibct-modal-displayed': 'vrrap',
                });
                dispatchShowModal('vrrap');
              }}
              buttonClassName="small-screen-font"
              bold
            />
            <strong>:</strong>
            &nbsp;
            {profile.attributes.vrrap ? 'Yes' : 'No'}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  calculator: state.calculator,
  profile: state.profile,
  calculated: getCalculatedBenefits(state, props),
  eligibility: state.eligibility,
  estimatedBenefits: state.calculator.estimatedBenefits,
});

const mapDispatchToProps = {
  dispatchCalculatorInputChange: calculatorInputChange,
  dispatchBeneficiaryZIPCodeChanged: beneficiaryZIPCodeChanged,
  dispatchShowModal: showModal,
  dispatchEligibilityChange: eligibilityChange,
  dispatchUpdateEstimatedBenefits: updateEstimatedBenefits,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalculateYourBenefits);
