import React, { useState} from 'react';

function CategoryEditor (props) {

  const [editingCategory, setEditingCategory] = useState(false);

  const [enteringCategoryName, setEnteringCategoryName] = useState("");

    if(editingCategory) {
     const prediction = props.getPrediction(props.transaction.id);
     return <div className="category-editor">
            {enteringCategoryName.length === 0 && props.categoryList.length > 0
                ?
                <div className="category-editor-control pure-form">
                    <b>Select a category</b>
                    <select value={props.category} onChange={(e) => selectCategoryChange(e)}>
                        <option value="Undefined">None</option>
                        {props.categoryList.map(item => <option key={item + " " + props.transaction.id} value={item}>{item}</option>)}
                    </select>
                </div>
                : null
            }
            <div className="category-editor-control pure-form">
                <b>Create a new category</b>
                <input value={enteringCategoryName} onChange={(e) => handleEditCategoryName(e)} type="text" placeholder="Enter category name"/>
            </div>
            {enteringCategoryName.length > 0
              ? <button onClick={(e) => saveCategoryClick(e)} className="pure-button pure-button-primary">Save category</button>
              : null
            }
            {prediction && prediction[0]
              ? <div className="category-editor-control pure-form">
                  <b>Suggestion: {prediction[0].category}</b>
                  <button className="pure-button pure-button-primary" onClick={() => confirmPredictedCategory(prediction[0].category)}>Confirm</button>
                </div>
              : null
            }
            <div className="category-editor-button-spacer"></div>
            <button onClick={(e) => handleCancelEditingClick(e)} className="pure-button">Cancel</button>
      </div>
    }
    else {
      return <div className="category-editor">
                {props.category !== "Undefined" 
                  ? <div className="category-editor">
                      <div className="category-name">
                          {props.category}
                      </div>
                      <button onClick={(e) => setCategoryEditing(true, e)} className="pure-button">Edit category</button>
                  </div>
                  : <div className="category-editor">
                      <button onClick={(e)=> setCategoryEditing(true, e)} className="pure-button pure-button-primary">Add category</button>
                  </div>
                }
            </div>
  } 

  function handleEditCategoryName(event) {
    setEnteringCategoryName(event.target.value);
  }

  function setCategoryEditing(bool, event) {
    setEditingCategory(bool)
  }

  function selectCategoryChange(event) {
    props.updateCategoryForMatchingItems(props.transaction.id, event.target.value);
    resetState();
  }

  function confirmPredictedCategory(category) {
    props.updateCategoryForMatchingItems(props.transaction.id, category);
    resetState();
  }

  function saveCategoryClick(event) {
    props.updateCategoryForMatchingItems(props.transaction.id, enteringCategoryName);
    resetState();
  }

  function resetState() {
    setEditingCategory(false);
    setEnteringCategoryName("")
  }

  function handleCancelEditingClick(event) {
    event.preventDefault();
    resetState();
  }
}

export default CategoryEditor;
