import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [trackingData, setTrackingData] = useState({});
  const [trackedWebsites, setTrackedWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['trackingData', 'trackedWebsites'], (result) => {
      setTrackingData(result.trackingData || {});
      setTrackedWebsites(result.trackedWebsites || []);
    });
  }, []);

  const handleAddWebsite = () => {
    if (newWebsite && !trackedWebsites.includes(newWebsite)) {
      const updatedWebsites = [...trackedWebsites, newWebsite];
      setTrackedWebsites(updatedWebsites);
      chrome.storage.local.set({ trackedWebsites: updatedWebsites });
      setNewWebsite('');
    }
  };

  const handleRemoveWebsite = (website) => {
    const updatedWebsites = trackedWebsites.filter((site) => site !== website);
    setTrackedWebsites(updatedWebsites);
    chrome.storage.local.set({ trackedWebsites: updatedWebsites });
  };

  return (
    <div className="App">
      <h1>Website Time Tracker</h1>
      <input
        type="text"
        value={newWebsite}
        onChange={(e) => setNewWebsite(e.target.value)}
        placeholder="Add website to track"
      />
      <button type='button' onClick={handleAddWebsite}>Add</button>
      <ul>
        {trackedWebsites.map((website) => (
          <li key={website}>
            {website}
            <button type='button' onClick={() => handleRemoveWebsite(website)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Time Spent</h2>
      <ul>
        {Object.entries(trackingData).map(([website, time]) => (
          <li key={website}>
            {website}: {time.toFixed(2)} seconds
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
