import { PublicApi } from '../types';

export function generateCurlSnippet(api: PublicApi): string {
  const authHeader = api.auth !== 'No Auth' ? ` \\\n  -H "Authorization: Bearer YOUR_${api.auth.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_HERE"` : '';
  return `curl -X GET "${api.link}"${authHeader} \\\n  -H "Accept: application/json"`;
}

export function generateFetchSnippet(api: PublicApi): string {
  if (api.auth === 'No Auth') {
    return `// JavaScript (Fetch API)
async function fetch${api.name.replace(/[^a-zA-Z0-9]/g, '')}() {
  try {
    const response = await fetch("${api.link}", {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

fetch${api.name.replace(/[^a-zA-Z0-9]/g, '')}();`;
  }

  return `// JavaScript (Fetch API with Auth)
async function fetch${api.name.replace(/[^a-zA-Z0-9]/g, '')}() {
  try {
    const response = await fetch("${api.link}", {
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer YOUR_${api.auth.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_HERE"
      }
    });
    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

fetch${api.name.replace(/[^a-zA-Z0-9]/g, '')}();`;
}

export function generatePythonSnippet(api: PublicApi): string {
  if (api.auth === 'No Auth') {
    return `# Python 3 (requests)
import requests

url = "${api.link}"
headers = {"Accept": "application/json"}

try:
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print(f"Error fetching API: {e}")`;
  }

  return `# Python 3 (requests with Auth)
import requests

url = "${api.link}"
headers = {
    "Accept": "application/json",
    "Authorization": "Bearer YOUR_${api.auth.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_HERE"
}

try:
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print(f"Error fetching API: {e}")`;
}

export function generateAxiosSnippet(api: PublicApi): string {
  if (api.auth === 'No Auth') {
    return `// Node.js / React (axios)
import axios from 'axios';

async function getApiData() {
  try {
    const { data } = await axios.get('${api.link}', {
      headers: { 'Accept': 'application/json' }
    });
    console.log(data);
    return data;
  } catch (err) {
    console.error('Request failed:', err);
  }
}

getApiData();`;
  }

  return `// Node.js / React (axios with Auth)
import axios from 'axios';

async function getApiData() {
  try {
    const { data } = await axios.get('${api.link}', {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_${api.auth.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_HERE'
      }
    });
    console.log(data);
    return data;
  } catch (err) {
    console.error('Request failed:', err);
  }
}

getApiData();`;
}
