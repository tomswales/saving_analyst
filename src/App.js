import React, {useRef, useState, useEffect} from 'react';
import Transactions from './Transactions/Transactions';
import MenuBar from './MenuBar/MenuBar';
import * as d3 from 'd3';
import moment from 'moment';
import Chance from 'chance';
import Reports from './Reports/Reports';

function App(props) {
  
  const downloadMappingRef = useRef(null);

  // Transaction data state
  const [state, setState] = useState({
    transactions: [],
    currentBalance: "",
    otherSavingsBalance: "0",
    savingGoal: "",
    interestRate: "0",
    storedCategoryMappings: new Map()
  });

  // Routing between tabs
  const [routeState, setRouteState] = useState("Transactions");

  // Transaction view filter state
  const [filterState, setFilterState] = useState({
    transactionDisplayLimit: 50,
    filterClassified: false,
    filterByCategory: "",
    filterByTransactionType: "",
    sortBy: "DATE_DESC",
    filterBySavingsTransfer: false
  });

  const [predict, setPredict] = useState(null);

  useEffect(() => {
    try {
      const newState = retrieveStateFromLocalStorage();
      setState(newState);
      createPredictiveModel(newState.transactions);
    } catch (e) {
      console.log("Error applying state from local storage to running application ", e.message);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app-page app-content">
        <a className = "hidden-input" href="hidden" ref={downloadMappingRef}>Hidden data download link</a>
        <div className="app-header">
            <div className="app-logo-container">
                Saving Analyst
            </div>
        </div>
        <div className="app-main-content">
            <div className="management-panel">
                <MenuBar 
                  setRoute={setRoute} 
                  route={routeState}/>
                <div className="management-panel-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    </div>
  );

  function renderContent() {
    switch(routeState) {
      case "Transactions":
        return <Transactions 
                    displayLimit={filterState.transactionDisplayLimit} 
                    transactions={state.transactions} 
                    filterByCategory={filterState.filterByCategory}
                    filterClassified={filterState.filterClassified}
                    filterByTransactionType={filterState.filterByTransactionType}
                    filterBySavingsTransfer={filterState.filterBySavingsTransfer}
                    currentBalance={state.currentBalance}
                    otherSavingsBalance={state.otherSavingsBalance}
                    savingGoal={state.savingGoal}
                    sortBy={state.sortBy}
                    setSortBy={setSortBy}
                    importTransactions={importTransactions}
                    importCategoryMappings={importCategoryMappings}
                    clearTransactions={clearTransactions}
                    generateCategoryMapping={generateCategoryMapping}
                    showMoreTransactions={showMoreTransactions}
                    setFilterClassified={setFilterClassified}
                    setCategoryFilter={setCategoryFilter}
                    setTransactionTypeFilter={setTransactionTypeFilter}
                    deleteTransaction={deleteTransaction}
                    updateCategoryForMatchingItems={updateCategoryForMatchingItems}
                    updateTransactionIsSaving={updateTransactionIsSaving}
                    getPrediction={getPrediction}
                    setSavingsTransferFilter={setSavingsTransferFilter}
                    />
      case "Reports":
        return <Reports 
                    state={state}
                    transactions={state.transactions} 
                    currentBalance={state.currentBalance}
                    otherSavingsBalance={state.otherSavingsBalance}
                    interestRate={state.interestRate}
                    savingGoal={state.savingGoal}
                    setSavingGoal={setSavingGoal}
                    setInterestRate={setInterestRate}
                    setCurrentBalance={setCurrentBalance}
                    setOtherSavingsBalance={setOtherSavingsBalance}
                    />
      default:
        return <div>Something went wrong!</div>
    }
  }

  // Get state from local storage if it exists or instantiate with empty defaults
  function retrieveStateFromLocalStorage() {
    try {
      const savedState = window.localStorage.getItem("savedState");
      const parsedSavedState = savedState ? JSON.parse(savedState) : {};
      const newState = {
          ...state,
          transactions: (savedState ? parsedSavedState.transactions : []),
          currentBalance: (savedState ? parsedSavedState.currentBalance : ""),
          otherSavingsBalance: (savedState ? parsedSavedState.otherSavingsBalance : ""),
          savingGoal: (savedState ? parsedSavedState.savingGoal : ""),
          interestRate: (savedState ? parsedSavedState.interestRate : "0"),
          storedCategoryMappings: (savedState ? new Map(parsedSavedState.storedCategoryMappings) : new Map())
      }
      return newState;
    } catch (e) {
      console.log("Error retrieving from local storage", e.message);
    }
  }

  // Save state in React state and local storage at same time
  function setStateWithPersistence(newState) {
    try {
      setState(newState);
    } catch (e) {
      console.log("Error saving state", e.message);
      return;
    }
    try {
      saveStateToLocalStorage(newState);
    } catch(e) {
        console.log("Error saving to local storage", e.message)
        return;
    }
    
  }

  // Save state to local storage
  function saveStateToLocalStorage(appState) {
    try {
      const saveState = {
          transactions: appState.transactions, 
          currentBalance: appState.currentBalance,
          otherSavingsBalance: appState.otherSavingsBalance,
          savingGoal: appState.savingGoal,
          interestRate: appState.interestRate,
          storedCategoryMappings: Array.from(appState.storedCategoryMappings.entries())
        }
      window.localStorage.setItem("savedState", JSON.stringify(saveState));
    } catch (e) {
      console.log("Error saving state to local storage", e.message);
    }
  }

  // update the app route
  function setRoute(newRoute) {
    setRouteState(newRoute);
  }

  // process an imported csv file with transaction data ()
  function importTransactions(url) {
    try {
      d3.csv(url).then((result) => {
          const processedTransactions = processTransactionArray(result);
          const categorisedTransactions = mapCategoriesToTransactions(state.storedCategoryMappings, processedTransactions)
          const newState = {...state, transactions: categorisedTransactions}
          setStateWithPersistence(newState);
          createPredictiveModel(categorisedTransactions);
      });
    } catch(e) {
      console.log("Transaction import failed" + e.message);
    }
  }

  // Reset the transactions and filter state
  function clearTransactions() {
    try {
      const newState = {
          ...state, 
          transactions: [],
          currentBalance: "",
          otherSavingsBalance: "",
          savingGoal: "",
          storedCategoryMappings: new Map()
      }
      setStateWithPersistence(newState);
      resetFilterState();
      setPredict(null);
    } catch (e) {
      console.log("Error clearing transactions", e.message);
    }
  }

  // Remove a transaction from the list
  function deleteTransaction(transactionId) {
    try {
      const newTransactions = state.transactions.filter((transaction) => {
        return transaction.id !== transactionId
      });
      const newState = {...state, transactions: newTransactions}
      setStateWithPersistence(newState);
    } catch (e) {
      console.log("Error deleting transaction", e.message);
    }
  }

  // Generate a downloadable file with the mappings from transaction details to category
  function generateCategoryMapping() {
    try {
      const export_data = "data:text/json," + encodeURIComponent(JSON.stringify({
        mapping: Array.from(generateCategoryMappingFromTransactionArray(state.transactions).entries()),
        savingsTransfers: generateSavingTransferMappingFromTransactionArray(state.transactions)
      }));
      const export_time = new Date().toLocaleString();
      const downloadFileName = "data " + export_time + ".json";
      const aLink = downloadMappingRef.current;
      aLink.href = export_data;
      aLink.download = downloadFileName;
      aLink.click();
    } catch (e) {
      console.log("Error generating category download file: ", e.message);
    }
  }

  // Read an uploaded category mapping file and apply the categories to all matching transactions
  function importCategoryMappings(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const result = JSON.parse(fileReader.result);
        const categoryMap = new Map(result.mapping);
        const savingsMap = new Map(result.savingsTransfers);
        applyMappingsToTransactions(categoryMap, savingsMap);
    }
    try {
      fileReader.readAsText(file);
    } catch (e) {
      console.log("Error reading file: ", e.message);
    }
  }

  // Apply categories to matching transactions
  function applyMappingsToTransactions(categoryMap, savingsMap) {
    if(categoryMap) {
      try {
        const newTransactions = state.transactions?.map((transaction) => {
          if (categoryMap.get(transaction.referenceString)) {
            return {...transaction, category: categoryMap.get(transaction.referenceString)}
          }
          else {
            return transaction;
          }
        });
        if (newTransactions) {
          const newTransactionsWithSavings = newTransactions.map((newTransaction) => {
            const date = newTransaction.bookingDate;
            const amount = newTransaction.amount;
            const refString = JSON.stringify(newTransaction.referenceString + "-" + date + "-" + amount);
            if (savingsMap.get(refString) === true) {
              return {...newTransaction, isSaving: true}
            }
            else {
              return newTransaction;
            }
          });
          const newState = {...state, transactions: newTransactionsWithSavings}
          setStateWithPersistence(newState);
          createPredictiveModel(newTransactionsWithSavings);
        }
        else {
          throw new Error("transactions were undefined");
        }
      } catch (e) {
        console.log("Error applying category mappings", e.message);
        return;
      }
      
    }
    else {
      console.log("no category map found!")
    }
  }

  /*
    Manage the current balance and saving goal
  */

  function setCurrentBalance(newBalance) {
    const newState = {...state, currentBalance: newBalance}
    setStateWithPersistence(newState);
  }

  function setOtherSavingsBalance(newBalance) {
    const newState = {...state, otherSavingsBalance: newBalance}
    setStateWithPersistence(newState);
  }

  function setSavingGoal(newGoal) {
    const newState = {...state, savingGoal: newGoal}
    setStateWithPersistence(newState);
  }

  function setInterestRate(newRate) {
    const newState = {...state, interestRate: newRate}
    setStateWithPersistence(newState);
  }

  /*
    Filter state management functions
  */

  function showMoreTransactions() {
    const newFilterState = {...filterState, transactionDisplayLimit: filterState.transactionDisplayLimit + 50}
    setFilterState(newFilterState);
  }

  function setCategoryFilter(newValue) {
    const newFilterState = {...filterState, filterByCategory: newValue}
    setFilterState(newFilterState);
  }

  function setFilterClassified(newBool) {
    const newFilterState = {...filterState, filterClassified: newBool, filterByCategory: ""}
    setFilterState(newFilterState);
  }

  function setTransactionTypeFilter(newValue) {
    const newFilterState = {...filterState, filterByTransactionType: newValue}
    setFilterState(newFilterState);
  }

  function setSavingsTransferFilter(newValue) {
    const newFilterState = {...filterState, filterBySavingsTransfer: newValue}
    setFilterState(newFilterState);
  }

  function updateTransactionIsSaving(transactionId, isSavingValue) {
    const newTransactions = state.transactions.map((t)=> {
      if(t.id === transactionId) {
        return {...t, isSaving: isSavingValue}
      }
      else {
        return t;
      }
    });
    const newState = {...state, transactions: newTransactions}
    setStateWithPersistence(newState);
  }

  function updateCategoryForMatchingItems(transactionId, category) {
    const transaction = state.transactions?.find((t) => {
      return t.id === transactionId;
    });

    if (transaction) {
      const newTransactions = state.transactions.map((t)=> {
        if(t.referenceString === transaction.referenceString) {
          return {...t, category: category}
        }
        else {
          return t;
        }
      });
      const newCategoryMappings = generateCategoryMappingFromTransactionArray(newTransactions);
      const newState = {...state, transactions: newTransactions, storedCategoryMappings: newCategoryMappings}
      setStateWithPersistence(newState);
      resetFilterState();
      createPredictiveModel(newTransactions);
    }
  }

  function resetFilterState() {
    const newFilterState = {...filterState, transactionDisplayLimit: 50, filterByCategory: ""}
    setFilterState(newFilterState);
  }

  function setSortBy(newSortBy) {
    const newState = {...state, sortBy: newSortBy}
    setState(newState);
  }



  function createPredictiveModel(transactions) {
    const model = buildPredictiveModel(transactions);
    if(model && typeof model === "function") {
      setPredict(() => model);
    }
  }

  function getPrediction(transactionId) {
    const transaction = state.transactions.find(trans => trans.id === transactionId);
    const convertedTransaction = {
      id: transaction.id, 
      words: processText(transaction["Beguenstigter/Zahlungspflichtiger"]), 
      category: transaction.category, 
      transactionType: transaction["Buchungstext"]
    };
    if (convertedTransaction) {
      if(typeof predict === "function") {
        const result = predict(convertedTransaction);
        return result;
      }
      else {
        return {}
      }
    }
    else {
      return {}
    }

  }
}

/*
  Helper methods for category mapping
*/

function processTransactionArray(transactions) {
  const chance = new Chance();
  const processedTransactions = transactions.map((t) => {
    let referenceString;
    if (t["Beguenstigter/Zahlungspflichtiger"] !== "" && t["Kontonummer/IBAN"] !== "") {
      referenceString = t["Beguenstigter/Zahlungspflichtiger"] + "%" + t["Kontonummer/IBAN"];
    }
    else {
      referenceString = t["Buchungstext"];
    }
    const id = chance.guid();
    const bookingDate = moment.utc(t["Buchungstag"], "DD.MM.YY");
    const convertedAmount = t["Betrag"].replace(/,/g, '.');
    const newT = {...t, 
      id: id, 
      amount: parseFloat(convertedAmount).toFixed(2), 
      referenceString: referenceString, 
      bookingDate: bookingDate.toDate(), 
      category: "Undefined", 
      isSaving: false
    };
    return newT;
  })

  return processedTransactions.sort((a, b)=> {return a.bookingDate.valueOf() - b.bookingDate.valueOf()});
}

function generateCategoryMappingFromTransactionArray(transactions) {
  const reducer = (acc, current) => {
    if (!acc.get(current.referenceString) && current.category !== "Undefined") {
      acc.set(current.referenceString, current.category);
      return acc;
    }
    else {
      return acc;
    }
  }
  const categoryMap = transactions.reduce(reducer, new Map());
  return categoryMap;
}

function mapCategoriesToTransactions(categoryMap, transactions) {
  const newTransactions = transactions.map((transaction) => {
    if (categoryMap.get(transaction.referenceString)) {
      return {...transaction, category: categoryMap.get(transaction.referenceString)}
    }
    else {
      return {...transaction, category: "Undefined"};
    }
  });
  return newTransactions
}

function generateSavingTransferMappingFromTransactionArray(transactions) {
  const filtered = transactions.filter(transaction => transaction.isSaving);

  return filtered.map(result => {
    const date = result.bookingDate;
    const amount = result.amount;
    const refString = JSON.stringify(result.referenceString + "-" + date + "-" + amount);
    return [refString, result.isSaving]
  })
}

/*
  Methods for predicting category
*/

function buildPredictiveModel(transactions) {

  const categorised = transactions.filter(item=> item.category !== "Undefined");

  const analysisData = createTextAnalysisDataFromTransactionList(categorised);

  const categories = getCategoryList(analysisData);

  const categoryProbabilities = generateCategoryFrequencies(analysisData);

  const wordList = buildFeatureList(analysisData);

  const condProbMap = buildConditionalProbabilityMap(analysisData, wordList, categories);

  const transactionTypes = buildTransactionTypeList(analysisData)

  const transCondProbMap = buildTransactionTypeConditionalProbabilityMap(analysisData, transactionTypes, categories)

  return (dataToPredict) => {

    if(dataToPredict && dataToPredict.words) {

      const probabilitiesOfCategory = categories.map(category => {

        function returnWordConditionalProbabilities(strings) {
          return helper(strings, 1);
        }

        function helper(strings, probability) {
          if (strings.length === 0) {
            return 0;
          }
          else if (strings.length === 1) {
            if(!condProbMap.get(category).get(strings[0])){
              return probability;
            }
            else {
              return probability * condProbMap.get(category).get(strings[0]);
            }
          }
          else {
            if(!condProbMap.get(category).get(strings[0])){
              return helper(strings.slice(1), probability);
            }
            else {
              const newProbability = probability * condProbMap.get(category).get(strings[0]);
              return helper(strings.slice(1), newProbability);
            }
          }
        }

        const catProbability = categoryProbabilities.get(category)
        const wordProbabilities = returnWordConditionalProbabilities(dataToPredict.words);

        const transactionTypeProbabilities = transCondProbMap.get(category).get(dataToPredict.transactionType);
        const totalProbability = catProbability * wordProbabilities * transactionTypeProbabilities;

        return {category: category, probability: totalProbability};
      }).sort((a, b)=>{return b.probability - a.probability}).slice(0, 1);

      return probabilitiesOfCategory;
      }
    else {
      return {}
    }
  }
    
}

function getCategoryList (analysisData) {
  const categoryListReducer = (acc, current) => {
    if(!acc.includes(current.category)) {
      return acc.concat([current.category]);
    }
    else {
      return acc;
    }
  }

  return analysisData.reduce(categoryListReducer, []);
}

// Identify the frequency distribution of transactions by category
function generateCategoryFrequencies(analysisData) {
  const reducer = (acc, current) => {
      if (acc.has(current.category)) {
        const newValue = (acc.get(current.category) + 1);
        acc.set(current.category, newValue);
        return acc;
      }
      else {
        acc.set(current.category, 1);
        return acc;
      }
  }

  const length = analysisData.length;

  const frequencyMap = analysisData.reduce(reducer, new Map());

  const probabilityMap = new Map(Array.from(frequencyMap).map(item => {return [item[0], (item[1]/length)]}))

  return probabilityMap;
}

function buildTransactionTypeConditionalProbabilityMap(analysisData, transactionTypeList, categories) {
  const result = new Map();

  categories.forEach(category => {
    result.set(category, new Map());
    const filteredByCategory = analysisData.filter(item => item.category === category);
    
    const categoryTotal = filteredByCategory.length;

    transactionTypeList.forEach(transactionType => {
      const hasTransactionType = filteredByCategory.filter(item => item.transactionType === transactionType);
      
      const transactionTypeFrequency = (1 + hasTransactionType.length) / categoryTotal;
      result.get(category).set(transactionType, transactionTypeFrequency);
    });
  });

  return result;
}

function buildConditionalProbabilityMap (analysisData, featureList, categories) {

  const getCategoryOccurrencesForEachWord = (analysisData, featureList, categories) => {
    const countMap = new Map();

    featureList.forEach(feature => {
      let counter = 0

      categories.forEach(category => {
        const filteredByCategoryAndWord = analysisData.filter(item => item.category === category && item.words.includes(feature.word));
        if (filteredByCategoryAndWord.length > 0) {
          counter ++;
        }
      })

      countMap.set(feature.word, counter);
    })

    return countMap;
  }

  const categoryOccurrenceCount = getCategoryOccurrencesForEachWord(analysisData, featureList, categories);

  const result = new Map();

  categories.forEach(category => {
    result.set(category, new Map());
    const filteredByCategory = analysisData.filter(item => item.category === category);
    
    const categoryTotal = filteredByCategory.length;

    featureList.forEach(feature => {
      const containsWord = filteredByCategory.filter(item => item.words.includes(feature.word));
      
      const wordFrequency = (containsWord.length + 0.01) / categoryTotal;
      
      const adjustedWordFrequency = wordFrequency * (1 / categoryOccurrenceCount.get(feature.word))

      result.get(category).set(feature.word, adjustedWordFrequency);
    })
  });

  return result;
}


function buildTransactionTypeList(analysisData) {
  const reducer = (acc, current) => {
    if(!acc.includes(current.transactionType)) {
      return acc.concat([current.transactionType]);
    }
    else {
      return acc;
    }
  }

  return analysisData.reduce(reducer, []);
}

// Run through list of analysis data and compile deduplicated list of words
function buildFeatureList(analysisData) {
  const innerReducer = (acc, word) => {
    const existingWord = acc.find(item => item.word === word);
    if(!existingWord) {
      return acc.concat([{word: word, count: 1}]);
    }
    else {
      const newCount = existingWord.count++;
      existingWord.count = newCount;
      return acc;
    }
  }

  const outerReducer = (acc, current) => {
    return current.words.reduce(innerReducer, acc);
  }

  return analysisData.reduce(outerReducer, [])
}

// Run through list of transactions and build text analysis data
function createTextAnalysisDataFromTransactionList(transactions) {
  
  return transactions.map(t=> {
    return {
      id: t.id, 
      transactionType: t["Buchungstext"], 
      words: processText(t["Beguenstigter/Zahlungspflichtiger"]), 
      category: t.category}
    }
  );
}

// Create a standardised array of words from the recipient details
function processText(text) {
  const replaceDoubleSlash = text.replace(/\/\//g, " ");
  const replaceSingleSlash = replaceDoubleSlash.replace(/\/\//g, " ");
  const replacePercent = replaceSingleSlash.replace(/%/g, " ");
  const replaceDot = replacePercent.replace(/\./g, " ");
  const splitString = replaceDot.split(" ");
  const result = splitString.filter(word => word !== "");
  return result;
}

export default App;
