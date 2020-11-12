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
          schema={rest.schema.properties.incomeType}
          uiSchema={rest.uiSchema.incomeType}
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

const InputRow = ({ item, rest, save }) => {
  return (
    <li className="input-row">
      <div className="input-container">
        {item.amount ? (
          <AdditionalIncome rest={rest} />
        ) : (
          <DependentsAge rest={rest} />
        )}
        <a className="remove-link">Remove</a>
      </div>
      <div>
        <button className="btn-save" onClick={save}>
          Save
        </button>
      </div>
    </li>
  );
};

const ListItem = ({ item, edit }) => {
  return (
    <div className="list-loop-item-list">
      {item.type && (
        <div className="list-loop-item-1">
          <div className="list-loop-item-label">Type of income</div>
          <strong>{item.type}</strong>
        </div>
      )}
      {item.amount && (
        <div className="list-loop-item-2">
          <div className="list-loop-item-label">Monthly amount</div>
          <strong>${item.amount}</strong>
        </div>
      )}
      <div className="list-loop-edit">
        <a onClick={edit}>Edit</a>
      </div>
    </div>
  );
};

const EditItem = () => {
  return <div>Edit Item</div>;
};

const ListLoop = ({ title, subTitle, items, ...rest }) => {
  const [showItem, setShowItem] = useState(true);
  const showAdd = true;

  const [saved, setSaved] = useState([
    {
      id: Math.random(),
      type: 'Alimony',
      amount: 100,
    },
  ]);

  const handleSave = () => {
    setSaved(prevState => [
      ...prevState,
      {
        id: Math.random(),
        type: 'Alimony',
        amount: 100,
      },
    ]);
  };

  const handleEdit = () => {
    setShowItem(false);
  };

  return (
    <div className="list-loop-container">
      <div className="title-section">
        <h3 className="title">{title}</h3>
        <p className="sub-title">{subTitle}</p>
      </div>

      {saved?.map(
        item =>
          showItem ? (
            <ListItem key={item.id} item={item} edit={handleEdit} />
          ) : (
            <EditItem key={item.id} />
          ),
      )}

      {showAdd && (
        <div className="list-input-section">
          <ul className="input-section-container">
            {items?.map(item => (
              <InputRow
                key={item.id}
                item={item}
                rest={rest}
                save={handleSave}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="add-income-link-section">
        <i className="fas fa-plus plus-icon" />
        <a className="add-income-link">Add additional</a>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({
  title: 'Your additional income',
  subTitle: 'Enter each type of additional income separately below.',
  items: [
    {
      id: 1,
      type: 'Alimony',
      amount: 100,
    },
    // {
    //   id: 2,
    //   type: 'income type 1',
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
