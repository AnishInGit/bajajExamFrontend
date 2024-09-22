import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [validJson, setValidJson] = useState(false);

  const filters = ["Alphabets", "Numbers", "Highest Lowercase Alphabet"];

  // Handle JSON input change
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  // Validate JSON
  const validateJson = (input) => {
    try {
      JSON.parse(input);
      setValidJson(true);
      setErrorMessage('');
      return true;
    } catch (error) {
      setValidJson(false);
      setErrorMessage('Invalid JSON format');
      return false;
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateJson(jsonInput)) {
      try {
        const requestPayload = JSON.parse(jsonInput);

        // POST API Request
        const response = await axios.post('https://bajajexam-vzpg.onrender.com/bfhl', requestPayload); 
        setResponseData(response.data);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Error in API call or response');
      }
    }
  };

  // Handle dropdown changes
  const handleFilterChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFilters(value);
  };

  // Render the filtered response based on dropdown selections
  const renderFilteredData = () => {
    if (!responseData) return {};
    let result = {};
    if (selectedFilters.includes("Alphabets") && responseData.alphabets) {
      result['Alphabets'] = responseData.alphabets;
    }
    if (selectedFilters.includes("Numbers") && responseData.numbers) {
      result['Numbers'] = responseData.numbers;
    }
    if (selectedFilters.includes("Highest Lowercase Alphabet") && responseData.highest_lowercase_alphabet) {
      result['Highest Lowercase Alphabet'] = responseData.highest_lowercase_alphabet;
    }
    return result;
  };

  return (
    <div className="App">
      <title>BAJAJ</title>
      <h1 style={{ display: 'flex', justifyContent: 'center' }}>BAJAJ - BFHL [RA2111003030266]</h1>

      {/* JSON input and submission */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          rows="5"
          cols="50"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter valid JSON, e.g., {"data": ["A", "B", "C", "1", "2"]}'
          style={{ width: '80%', marginLeft: '50px', borderRadius: '5px', border: '1px solid #ccc', }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px', marginTop: '10px',marginLeft: '55px', }}>Submit</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>

      {/* Dropdown for selecting filters */}
      {validJson && responseData && (
        <>
          <label htmlFor="filters">Choose Data to Display:</label>
          <select id="filters" multiple={true} onChange={handleFilterChange} style={{ marginLeft: '10px' }}>
            {filters.map((filter, index) => (
              <option key={index} value={filter}>
                {filter}
                <br/>
              </option>
            ))}
          </select>
        </>
      )}

      {/* Render filtered data */}
      {Object.keys(renderFilteredData()).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Filtered API Response:</h3>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(renderFilteredData(), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
