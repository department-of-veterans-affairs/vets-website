import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { setIncomeData } from '../actions';

const AdditionalIncome = ({ rest, initType, initAmount }) => {
  const { SchemaField } = rest.registry.fields;
  const [type, setType] = useState(initType);
  const [amount, setAmount] = useState(initAmount);

  // console.log('AdditionalIncome type: ', type);
  // console.log('AdditionalIncome amount: ', amount);

  // console.log('AdditionalIncome rest: ', rest.income);
  // console.log('AdditionalIncome amount: ', typeof amount);

  useEffect(
    () => {
      rest.setIncomeData({
        type,
        amount,
      });
    },
    [type, amount],
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

const EditItem = ({ item, update, remove, rest }) => {
  // console.log('EditItem rest: ', rest.income);

  return (
    <div className="list-input-section">
      <div className="input-section-container">
        <div className="input-row">
          <div className="input-container">
            <AdditionalIncome
              rest={rest}
              initType={rest.income.type}
              initAmount={rest.income.amount}
            />
            <a className="remove-link" onClick={() => remove(item.id)}>
              Remove
            </a>
          </div>
          <div>
            <button
              className="btn-save"
              onClick={() => update(item.id, rest.income)}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListItem = ({ item, edit }) => {
  // console.log('ListItem item: ', item);

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
  const [saved, setSaved] = useState([...items]);
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(true);

  const handleRemove = id => {
    setSaved(prevState => {
      return prevState.filter(item => item.id !== id);
    });
  };

  const handleUpdate = (id, value) => {
    const itemIndex = saved.findIndex(item => item.id === id);
    if (!value || itemIndex === -1) return;

    setSaved(prevState => [
      ...prevState.map((item, index) => {
        return index === itemIndex ? { ...item, ...value } : item;
      }),
    ]);
    setEditId(null);
  };

  const handleSave = () => {
    setSaved(prevState => [
      ...prevState,
      {
        id: Math.random(),
        type: rest.income.type,
        amount: rest.income.amount,
      },
    ]);
    setShowAdd(false);
  };

  const handleEdit = id => {
    setShowAdd(false);
    setEditId(id);
  };

  return (
    <div className="list-loop-container">
      <div className="title-section">
        <h3 className="title">{title}</h3>
        <p className="sub-title">{subTitle}</p>
      </div>
      {saved?.map(
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
            />
          ),
      )}
      {showAdd && (
        <div className="list-input-section">
          <div className="input-section-container">
            <div className="input-row">
              <div className="input-container">
                <AdditionalIncome rest={rest} />
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
