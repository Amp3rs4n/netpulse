// network.js

// Function to fetch IP address
async function fetchIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown';
  }
}

// Function to fetch network details using IP address
async function fetchNetworkDetails(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
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
    return connection.effectiveType || 'Unknown';
  }
  return 'Unknown';
}

// Function to display network info
async function displayNetworkInfo() {
  const ipAddressElement = document.getElementById('ipAddress');
  const ispElement = document.getElementById('isp');
  const locationElement = document.getElementById('location');
  const networkTypeElement = document.getElementById('networkType');

  // Fetch and display IP address
  const ip = await fetchIPAddress();
  ipAddressElement.textContent = ip;

  // Fetch and display ISP and location
  const networkDetails = await fetchNetworkDetails(ip);
  if (networkDetails) {
    ispElement.textContent = networkDetails.isp || 'Unknown';
    locationElement.textContent = `${networkDetails.city}, ${networkDetails.country}` || 'Unknown';
  }

  // Detect and display network type
  const networkType = detectNetworkType();
  networkTypeElement.textContent = networkType;
}

// Initialize the network info display
displayNetworkInfo();