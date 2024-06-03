let trackingData = {};
let currentTabId = null;
let currentWebsite = null;
let startTime = null;
let trackedWebsites = [];

// Load data from storage
chrome.storage.local.get(["trackingData", "trackedWebsites"], (result) => {
  trackingData = result.trackingData || {};
  trackedWebsites = result.trackedWebsites || [];
});

// Function to update the time spent on the current website
function updateTime() {
  if (currentWebsite && startTime && trackedWebsites.includes(currentWebsite)) {
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000; // Time in seconds
    if (!trackingData[currentWebsite]) {
      trackingData[currentWebsite] = 0;
    }
    trackingData[currentWebsite] += timeSpent;
    chrome.storage.local.set({ trackingData });
  }
  startTime = new Date();
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    if (currentTabId !== tabId) {
      updateTime();
      currentTabId = tabId;
      currentWebsite = new URL(tab.url).hostname;
    }
  }
});

// Listener for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (currentTabId !== activeInfo.tabId) {
    updateTime();
    currentTabId = activeInfo.tabId;
    chrome.tabs.get(currentTabId, (tab) => {
      currentWebsite = new URL(tab.url).hostname;
    });
  }
});

// Listener for extension popup opening
chrome.action.onClicked.addListener(() => {
  updateTime();
  chrome.storage.local.set({ trackingData });
});

// Reset startTime when the extension is loaded
chrome.runtime.onStartup.addListener(() => {
  startTime = new Date();
});
