import React, { useState } from 'react';
import { connect } from 'react-redux';

const AdditionalIncome = ({ rest }) => {
  const { SchemaField } = rest.registry.fields;
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <>
      <div className="input-custom input-1">
        <SchemaField
          required={false}
          schema={rest.schema.properties.employmentType}
          uiSchema={rest.uiSchema.employmentType}
          formData={type}
          onChange={setType}
          onBlur={() => {}}
          registry={rest.registry}
          idSchema={rest.idSchema}
        />
      </div>
      <div className="input-custom input-2">
        <SchemaField
          required={false}
          schema={rest.schema.properties.monthlyAmount}
          uiSchema={rest.uiSchema.monthlyAmount}
          formData={amount}
          onChange={setAmount}
          onBlur={() => {}}
          registry={rest.registry}
          idSchema={rest.idSchema}
        />
      </div>
    </>
  );
};

const DependentsAge = ({ rest }) => {
  const { SchemaField } = rest.registry.fields;
  const [age, setAge] = useState('');

  return (
    <div className="input-custom input-3">
      <SchemaField
        required={false}
        schema={rest.schema.properties.employerName}
        uiSchema={rest.uiSchema.employerName}
        formData={age}
        onChange={setAge}
        onBlur={() => {}}
        registry={rest.registry}
        idSchema={rest.idSchema}
      />
    </div>
  );
};

const InputRow = ({ item, rest }) => {
  return (
    <li className="input-row">
      <div className="input-container">
        {item.income ? (
          <AdditionalIncome rest={rest} />
        ) : (
          <DependentsAge rest={rest} />
        )}
        <a className="remove-link">Remove</a>
      </div>
      <div>
        <button className="btn-save">SAVE</button>
      </div>
    </li>
  );
};

const ListLoop = ({ title, subTitle, items, ...rest }) => {
  // console.log('ListLoop rest: ', rest);

  return (
    <div className="list-loop-container">
      <div className="title-section">
        <h3 className="title">{title}</h3>
        <p className="sub-title">{subTitle}</p>
      </div>
      <div className="list-input-section">
        <ul className="input-section-container">
          {items?.map(item => (
            <InputRow key={item.id} item={item} rest={rest} />
          ))}
        </ul>
      </div>
      <div className="add-income-link-section">
        <i className="fas fa-plus plus-icon" />
        <a className="add-income-link">Add additional</a>
      </div>
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
    // {
    //   id: 2,
    //   income: 'income type 1',
    //   amount: 120,
    // },
  ],

  // title: 'Your dependents',
  // subTitle: 'Enter the age of your dependent(s) separately below.',
  // items: [
  //   {
  //     id: 1,
  //     age: 21,
  //   },
  // ],
});

export default connect(
  mapStateToProps,
  null,
)(ListLoop);
