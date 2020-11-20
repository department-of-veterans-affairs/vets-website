import React from 'react';

const PayrollDeductions = ({
  registry,
  schema,
  uiSchema,
  idSchema,
  onBlur,
  deductions,
  setDeductions,
}) => {
  const { SchemaField } = registry.fields;

  const handleAddDeduction = () => {
    const [last] = deductions.slice(-1);
    let { id } = last;
    const newId = ++id;
    setDeductions(prevState => {
      return {
        ...prevState,
        deductions: [
          ...prevState.deductions,
          { id: newId, type: 'New Deduction', value: null },
        ],
      };
    });
  };

  const handleUpdate = (id, value) => {
    const itemIndex = deductions.findIndex(obj => obj.id === id);
    setDeductions(prevState => {
      return {
        ...prevState,
        deductions: [
          ...prevState.deductions.map((item, index) => {
            if (!value && index === itemIndex) return { ...item, value: 0 };
            return index === itemIndex ? { ...item, value } : item;
          }),
        ],
      };
    });
  };

  const total = deductions?.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  return (
    <>
      <h4>Payroll deductions</h4>
      <p>You can find your payroll deductions in a recent paycheck.</p>
      <div className="input-payroll-deduction">
        {deductions.map((item, i) => (
          <div key={i}>
            <label className="deduction-label">{item.type}</label>
            <SchemaField
              schema={schema.properties.payrollDeductions}
              uiSchema={uiSchema.payrollDeductions}
              onBlur={onBlur}
              registry={registry}
              idSchema={idSchema}
              formData={deductions[i]?.value ? deductions[i]?.value : ''}
              onChange={value => handleUpdate(i, value)}
            />
          </div>
        ))}
      </div>
      <div className="add-item-link-section">
        <i className="fas fa-plus plus-icon" />
        <span className="add-item-link" onClick={() => handleAddDeduction()}>
          Add payroll deduction
        </span>
      </div>
      {total > 0 && (
        <div className="monthly-net-income">
          <strong>Monthly net income:</strong> ${total}
        </div>
      )}
    </>
  );
};

export default PayrollDeductions;
