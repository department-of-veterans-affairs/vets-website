import React from 'react';
import { connect } from 'react-redux';

const AdditionalIncome = () => {
  return (
    <>
      <div>
        <div className="input-placeholder">Type of income</div>
        <input className="input-custom input-1" type="text" />
      </div>
      <div>
        <div className="input-placeholder">Monthly Amount</div>
        <input className="input-custom input-2" type="text" />
      </div>
    </>
  );
};

const DependentsAge = () => {
  return (
    <div>
      <div className="input-placeholder">Dependents age</div>
      <input className="input-custom input-3" type="text" />
    </div>
  );
};

const InputRow = ({ item }) => {
  return (
    <li className="input-container">
      {item.income ? <AdditionalIncome /> : <DependentsAge />}
      <a className="remove-link">Remove</a>
    </li>
  );
};

const ListLoop = ({ title, subTitle, items, registry, ...rest }) => {
  const { SchemaField } = registry.fields;

  return (
    <div className="list-loop-container">
      <div className="title-section">
        <h3 className="title">{title}</h3>
        <p className="sub-title">{subTitle}</p>
      </div>
      <div className="list-input-section">
        <ul className="input-section-container">
          {items?.map(item => <InputRow key={item.id} item={item} />)}
        </ul>
      </div>
      <div className="add-income-link-section">
        <i className="fas fa-plus plus-icon" />
        <a className="add-income-link">Add additional income</a>
      </div>
      <SchemaField
        required={false}
        schema={rest.schema.properties.employerName}
        uiSchema={rest.uiSchema.employerName}
        formData={''}
        onChange={() => {}}
        onBlur={() => {}}
        registry={registry}
      />
    </div>
  );
};

const mapStateToProps = () => ({
  //   data: state.form?.data
  title: 'Your additional income',
  subTitle: 'Enter each type of additional income separately below.',
  items: [
    {
      id: 1,
      income: 'income type 1',
      amount: 100,
    },
  ],
});

export default connect(
  mapStateToProps,
  null,
)(ListLoop);
