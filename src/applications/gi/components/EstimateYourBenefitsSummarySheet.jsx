import React from 'react';
import ImportedCalculatorResultRow from '../components/profile/CalculatorResultRow';

const CalculatorResultRow = ({
  label,
  value,
  header,
  bold,
  visible,
  labelBold,
}) => (
  <ImportedCalculatorResultRow
    id={`summary-sheet-${label}`}
    label={label}
    value={value}
    header={header}
    bold={bold}
    visible={visible}
    labelBold={labelBold}
  />
);

export const EstimateYourBenefitsSummarySheet = props => (
  <div className="vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-color--gray-light">
    <button
      aria-expanded={props.expandEybSheet ? 'true' : 'false'}
      className="eyb-button usa-accordion-button"
      onClick={() => props.toggleEybExpansion()}
    >
      Your estimated benefits
    </button>
    <div className="vads-u-margin-x--2p5">
      {props.expandEybSheet ? (
        <div>
          <div className="out-of-pocket-tuition">
            <CalculatorResultRow
              label="GI Bill pays to school"
              value={props.outputs.giBillPaysToSchool.value}
              bold
              visible={props.outputs.giBillPaysToSchool.visible}
            />
            <CalculatorResultRow
              label="Tuition and fees charged"
              value={props.outputs.tuitionAndFeesCharged.value}
              visible={props.outputs.tuitionAndFeesCharged.visible}
            />
            <CalculatorResultRow
              label="Your scholarships"
              value={props.outputs.yourScholarships.value}
              visible={props.outputs.yourScholarships.visible}
            />
            <CalculatorResultRow
              label="Out of pocket tuition"
              value={props.outputs.outOfPocketTuition.value}
              bold
              visible={props.outputs.outOfPocketTuition.visible}
            />
          </div>
          <CalculatorResultRow
            label="Housing allowance"
            value={props.outputs.housingAllowance.value}
            bold
            visible={props.outputs.housingAllowance.visible}
          />

          <CalculatorResultRow
            label="Book stipend"
            value={props.outputs.bookStipend.value}
            bold
            visible={props.outputs.bookStipend.visible}
          />
          <CalculatorResultRow
            label="Yellow Ribbon"
            value={
              props.outputs.perTerm.yellowRibbon.terms.find(
                item => item.label === 'Total per year',
              ).value
            }
            bold
            visible={props.yellowRibbon}
          />
          <CalculatorResultRow
            label="Total paid to you"
            value={props.outputs.totalPaidToYou.value}
            bold
            visible={props.outputs.totalPaidToYou.visible}
          />
          {props.type === 'OJT' && (
            <div>
              <hr className="vads-u-margin-y--2" />
              <h4 className="vads-u-margin-y--0">
                Estimated benefits per month
              </h4>
              <h5 className="vads-u-margin-y--1p5">Housing allowance</h5>
              {props.outputs.perTerm.housingAllowance.visible &&
                props.outputs.perTerm.housingAllowance.terms.map(term => (
                  <CalculatorResultRow
                    key={`${term.label}`}
                    label={term.label}
                    value={term.value}
                    bold={term.label === 'Total per year'}
                    visible={term.visible}
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <CalculatorResultRow
            label="GI Bill pays to school"
            value={props.outputs.giBillPaysToSchool.value}
            labelBold
            visible={props.outputs.giBillPaysToSchool.visible}
          />
          <CalculatorResultRow
            label="Housing allowance"
            value={props.outputs.housingAllowance.value}
            labelBold
            visible={props.outputs.housingAllowance.visible}
          />
          <CalculatorResultRow
            label="Book stipend"
            value={props.outputs.bookStipend.value}
            labelBold
            visible={props.outputs.bookStipend.visible}
          />
        </div>
      )}
    </div>
  </div>
);

export default EstimateYourBenefitsSummarySheet;
