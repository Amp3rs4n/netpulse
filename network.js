// network.js

// Function to fetch network details from IPinfo
async function fetchNetworkDetails() {
  const token = '8e1b9b121035fb';
  const url = `https://ipinfo.io/json?token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch IP info');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching network details:', error);
    return null;
  }
}

// Function to detect network type (WiFi, Cellular, etc.)
function detectNetworkType() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return connection.effectiveType || 'Невідомо';
  }
  return 'Невідомо';
}

// Function to display network info
async function displayNetworkInfo() {
  const ipAddressElement = document.getElementById('ipValue');
  const ispElement = document.getElementById('ispValue');
  const locationElement = document.getElementById('locationValue');

  const data = await fetchNetworkDetails();
  if (data) {
    ipAddressElement.textContent = data.ip || 'Невідомо';
    ispElement.textContent = data.org || 'Невідомо';
    locationElement.textContent = data.city && data.country
      ? `${data.city}, ${data.country}`
      : data.loc || 'Невідомо';
    orgElement.textContent = data.hostname || 'Невідомо';
  } else {
    ipAddressElement.textContent = ispElement.textContent = locationElement.textContent = orgElement.textContent = 'Помилка';
  }
}

// Initialize
displayNetworkInfo();
