import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { setIncomeData } from '../actions';

const AdditionalIncome = ({ rest, initType, initAmount, setSavedItems }) => {
  const { SchemaField } = rest.registry.fields;
  const [type, setType] = useState(initType);
  const [amount, setAmount] = useState(initAmount);

  useEffect(
    () => {
      if (!setSavedItems) return;
      setSavedItems({
        id: Math.random(),
        type,
        amount,
      });
    },
    [type, amount, setSavedItems],
  );

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

const EditItem = ({ item, update, remove, rest, setSavedItems }) => {
  return (
    <div className="list-input-section">
      <div className="input-section-container">
        <div className="input-row">
          <div className="input-container">
            <AdditionalIncome
              rest={rest}
              initType={item.type}
              initAmount={item.amount}
              setSavedItems={setSavedItems}
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

const ListLoop = ({ title, subTitle, items, ...rest }) => {
  const [savedItems, setSavedItems] = useState([...items]);
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(true);

  const handleUpdate = id => {
    const itemIndex = rest.income.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    const updated = rest.income.map((item, index) => {
      return index === itemIndex ? { ...item, ...savedItems } : item;
    });

    rest.setIncomeData(updated);
    setEditId(null);
  };

  const handleRemove = id => {
    const updated = rest.income.filter(item => item.id !== id);
    rest.setIncomeData(updated);
  };

  const handleEdit = id => {
    setShowAdd(false);
    setEditId(id);
  };

  const handleSave = () => {
    rest.setIncomeData([...rest.income, savedItems]);
    setShowAdd(false);
  };

  return (
    <div className="list-loop-container">
      <div className="title-section">
        <h3 className="title">{title}</h3>
        <p className="sub-title">{subTitle}</p>
      </div>
      {rest.income?.map(
        item =>
          item.id !== editId ? (
            <ListItem key={item.id} item={item} edit={handleEdit} />
          ) : (
            <EditItem
              key={item.id}
              item={item}
              rest={rest}
              update={handleUpdate}
              remove={handleRemove}
              setSavedItems={setSavedItems}
            />
          ),
      )}
      {showAdd && (
        <div className="list-input-section">
          <div className="input-section-container">
            <div className="input-row">
              <div className="input-container">
                <AdditionalIncome rest={rest} setSavedItems={setSavedItems} />
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
  setIncomeData: data => dispatch(setIncomeData(data)),
});

const mapStateToProps = state => ({
  title: 'Your additional income',
  subTitle: 'Enter each type of additional income separately below.',
  items: [],
  income: state.fsr.income,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListLoop);
