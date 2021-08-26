import React from 'react';
import CalculatorSheetResultRow from './CalculatorSheetResultRow';

export const EstimateYourBenefitsSummarySheet = ({
  expandEybSheet,
  outputs,
  showEybSheet,
  toggleEybExpansion,
  type,
  yellowRibbon,
}) => (
  <div className="vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-color--gray-light">
    <button
      aria-expanded={expandEybSheet ? 'true' : 'false'}
      aria-controls={showEybSheet && 'eyb-summary-sheet'}
      className="eyb-button usa-accordion-button vads-u-padding-bottom--0"
      onClick={() => toggleEybExpansion()}
    >
      {expandEybSheet ? (
        <h4>Your estimated benefits</h4>
      ) : (
        <h5>Your estimated benefits</h5>
      )}
    </button>
    <div className="vads-u-margin-x--2p5">
      {expandEybSheet ? (
        <div>
          <div className="out-of-pocket-tuition">
            <div className="vads-u-margin-y--1p5">
              <CalculatorSheetResultRow
                label="GI Bill pays to school"
                value={outputs.giBillPaysToSchool.value}
                header
                visible={outputs.giBillPaysToSchool.visible}
              />
            </div>
            <div className="vads-u-margin-y--0p5">
              <CalculatorSheetResultRow
                label="Tuition and fees charged"
                value={outputs.tuitionAndFeesCharged.value}
                visible={outputs.tuitionAndFeesCharged.visible}
              />
            </div>
            <div className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <CalculatorSheetResultRow
                label="Your scholarships"
                value={outputs.yourScholarships.value}
                visible={outputs.yourScholarships.visible}
              />
            </div>
            <div className="vads-u-margin-top--1 vads-u-margin-bottom--1p5">
              <CalculatorSheetResultRow
                label="Out of pocket tuition"
                value={outputs.outOfPocketTuition.value}
                bold
                visible={outputs.totalPaidToYou.visible}
              />
            </div>
          </div>
          <div className="vads-u-margin-top--1 vads-u-margin-bottom--2">
            <CalculatorSheetResultRow
              label="Housing allowance"
              value={outputs.housingAllowance.value}
              bold
              visible={outputs.housingAllowance.visible}
            />
          </div>
          <div className="vads-u-margin-top--1p5 vads-u-margin-bottom--1p5">
            <CalculatorSheetResultRow
              label="Book stipend"
              value={outputs.bookStipend.value}
              header
              visible={outputs.bookStipend.visible}
            />
          </div>
          <div className="vads-u-margin-y--1p5">
            <CalculatorSheetResultRow
              label="Yellow Ribbon"
              value={
                outputs.perTerm.yellowRibbon.terms.find(
                  item => item.label === 'Total per year',
                ).value
              }
              bold
              visible={yellowRibbon}
            />
          </div>
          <div className="vads-u-margin-y--1">
            <CalculatorSheetResultRow
              label="Total paid to you"
              value={outputs.totalPaidToYou.value}
              bold
              visible={outputs.totalPaidToYou.visible}
            />
          </div>
          {type === 'OJT' && (
            <div>
              <hr className="vads-u-margin-y--2" />
              <h4 className="vads-u-margin-y--0">
                Estimated benefits per month
              </h4>
              <h5 className="vads-u-margin-y--1p5">Housing allowance</h5>
              {outputs.perTerm.housingAllowance.visible &&
                outputs.perTerm.housingAllowance.terms.map(term => (
                  <CalculatorSheetResultRow
                    key={`${term.label}`}
                    label={term.label}
                    value={term.value}
                    visible={term.visible}
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <CalculatorSheetResultRow
            label="GI Bill pays to school"
            value={outputs.giBillPaysToSchool.value}
            boldLabel
            visible={outputs.giBillPaysToSchool.visible}
            className="vads-u-margin-y--4"
          />
          <CalculatorSheetResultRow
            label="Housing allowance"
            value={outputs.housingAllowance.value}
            boldLabel
            visible={outputs.housingAllowance.visible}
          />
          <CalculatorSheetResultRow
            label="Book stipend"
            value={outputs.bookStipend.value}
            boldLabel
            visible={outputs.bookStipend.visible}
          />
        </div>
      )}
    </div>
  </div>
);

export default EstimateYourBenefitsSummarySheet;
