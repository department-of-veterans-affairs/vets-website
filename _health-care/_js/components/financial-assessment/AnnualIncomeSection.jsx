import React from 'react';

class AnnualIncomeSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Annual Income</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h4>Previous calendar year gross annual income of veteran, spouse and
            dependent children</h4>
            <p><strong>Report</strong> gross annual income from employment, except for income
            from your farm, ranch, property or business, including information
            about your wages, bonuses, tips, severance pay and other accrued
            benefits and your child's income information if it could have been used
            to pay your household expenses.
            </p>

            <p><strong>Report</strong> net income from your farm, ranch, property or business.
            Payments on principal of mortgage and depreciation expenses are not
            deductible.
            </p>

            <p><strong>Report</strong> other income amounts, including retirement and pension
            income, Social Security Retirement and Social Security Disability
            income, compensation benefits such as VA disability, unemployment,
            Workers and black lung; cash gifts, interest and dividends, including
            tax exempt earnings and distributions from Individual Retirement
            Accounts (IRAs) or annuities.
            </p>

            <p><strong>Do Not Report:</strong> Donations from public or private relief,
            welfare or charitable organizations; Supplemental Security Income (SSI)
            and need-based payments from a government agency; profit from the
            occasional sale of property; income tax refunds; reinvested interest on
            Individual Retirement Accounts (IRAs); scholarship and grants for school
            attendance; disaster relief payment; reimbursement for casualty loss;
            loans; Radiation Compensation Exposure Act payments; Agent Orange
            settlement payments; and Alaska Native Claim Settlement Acts Income;
            payments to foster parents; amounts in joint accounts in banks and
            similar institutions acquired by reason of death or other joint owner;
            Japanese ancestry restitution under Public Law 100-383; cash surrender
            value of life insurance; lump-sum proceeds of life insurance policy on a
            Veteran; and payments received under the Medicare transitional
            assistance program.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="small-3 columns">
            <p></p>
          </div>
          <div className="small-3 columns">
            <p>Gross annual income from employment (wages, bonuses, tips, etc.)
            excluding income from your farm, ranch, property or business</p>
          </div>
          <div className="small-3 columns">
            <p>Net income from your farm, ranch, property or business</p>
          </div>
          <div className="small-3 columns">
            <p>List other income amounts (Social Security, compensation, pension,
            interest, dividends. Exclude welfare)</p>
          </div>
        </div>

        <div className="row">
          <div className="small-3 columns">
            <p>Veteran</p>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[gross_wage_income]" data-validation-type="monetary"/>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[net_business_income]" data-validation-type="monetary"/>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[other_income]" data-validation-type="monetary"/>
          </div>
        </div>

        <div className="row">
          <div className="small-3 columns">
            <p>Spouse</p>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[spouses][gross_wage_income]" data-validation-type="monetary"/>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[spouses][net_business_income]" data-validation-type="monetary"/>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[spouses][other_income]" data-validation-type="monetary"/>
          </div>
        </div>

        <div className="row">
          <div className="small-3 columns">
            <p>Child NN </p>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[children][gross_wage_income]" data-validation-type="monetary"/>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[children][net_business_income]" data-validation-type="monetary"/>
          </div>
          <div className="small-3 columns">
            $<input type="text" name="veteran[children][other_income]" data-validation-type="monetary"/>
          </div>
        </div>
      </div>
    );
  }
}

export default AnnualIncomeSection;
