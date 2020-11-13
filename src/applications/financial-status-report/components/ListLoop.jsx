import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setIncomeData } from '../actions';

const AdditionalIncome = ({
  initType,
  initAmount,
  setSavedItem,
  registry,
  schema,
  uiSchema,
  idSchema,
}) => {
  const { SchemaField } = registry.fields;
  const [type, setType] = useState(initType);
  const [amount, setAmount] = useState(initAmount);

  useEffect(
    () => {
      if (!setSavedItem || !type || !amount) return;
      setSavedItem({
        id: Math.random(),
        type,
        amount,
      });
    },
    [type, amount, setSavedItem],
  );

  return (
    <>
      <div className="input-custom input-1">
        <SchemaField
          required={false}
          schema={schema.properties.incomeType}
          uiSchema={uiSchema.incomeType}
          onBlur={() => {}}
          registry={registry}
          idSchema={idSchema}
          formData={type}
          onChange={setType}
        />
      </div>
      <div className="input-custom input-2">
        <SchemaField
          required={false}
          schema={schema.properties.monthlyAmount}
          uiSchema={uiSchema.monthlyAmount}
          onBlur={() => {}}
          registry={registry}
          idSchema={idSchema}
          formData={amount}
          onChange={setAmount}
        />
      </div>
    </>
  );
};

const EditItem = ({
  item,
  update,
  remove,
  setSavedItem,
  registry,
  schema,
  uiSchema,
  idSchema,
}) => {
  return (
    <div className="list-input-section">
      <div className="input-section-container">
        <div className="input-row">
          <div className="input-container">
            <AdditionalIncome
              initType={item.type}
              initAmount={item.amount}
              registry={registry}
              schema={schema}
              uiSchema={uiSchema}
              idSchema={idSchema}
              setSavedItem={setSavedItem}
            />
            <a className="remove-link" onClick={() => remove(item.id)}>
              Remove
            </a>
          </div>
          <div>
            <button className="btn-save" onClick={() => update(item.id)}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
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
        <a onClick={() => edit(item.id)}>Edit</a>
      </div>
    </div>
  );
};

const ListLoop = ({
  title,
  subTitle,
  income,
  setData,
  registry,
  schema,
  uiSchema,
  idSchema,
}) => {
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(true);
  const [savedItem, setSavedItem] = useState({
    id: null,
    type: '',
    amount: '',
  });

  const handleUpdate = id => {
    const itemIndex = income.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    const updated = income.map((item, index) => {
      return index === itemIndex ? { ...item, ...savedItem } : item;
    });

    setData(updated);
    setEditId(null);
  };

  const handleRemove = id => {
    const updated = income.filter(item => item.id !== id);
    setData(updated);
  };

  const handleEdit = id => {
    setShowAdd(false);
    setEditId(id);
  };

  const handleSave = () => {
    if (!savedItem.id) return;
    setData([...income, savedItem]);
    setShowAdd(false);
  };

  return (
    <div className="list-loop-container">
      <div className="title-section">
        <h3 className="title">{title}</h3>
        <p className="sub-title">{subTitle}</p>
      </div>
      {income?.map(
        item =>
          item.id !== editId ? (
            <ListItem key={item.id} item={item} edit={handleEdit} />
          ) : (
            <EditItem
              key={item.id}
              item={item}
              registry={registry}
              schema={schema}
              uiSchema={uiSchema}
              idSchema={idSchema}
              update={handleUpdate}
              remove={handleRemove}
              setSavedItem={setSavedItem}
            />
          ),
      )}
      {showAdd && (
        <div className="list-input-section">
          <div className="input-section-container">
            <div className="input-row">
              <div className="input-container">
                <AdditionalIncome
                  initType={income.type}
                  initAmount={income.amount}
                  registry={registry}
                  schema={schema}
                  uiSchema={uiSchema}
                  idSchema={idSchema}
                  setSavedItem={setSavedItem}
                />
              </div>
              <div>
                <button className="btn-save" onClick={() => handleSave()}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="add-income-link-section">
        <i className="fas fa-plus plus-icon" />
        <a className="add-income-link" onClick={() => setShowAdd(true)}>
          Add additional income
        </a>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setIncomeData(data)),
});

const mapStateToProps = state => ({
  title: 'Your additional income',
  subTitle: 'Enter each type of additional income separately below.',
  income: state.fsr.income,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListLoop);
