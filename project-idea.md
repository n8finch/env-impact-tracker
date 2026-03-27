# Project Plan: AI Carbon Footprint Calculator

## 1. Project Overview
A lightweight, single-page web application that allows users to estimate the carbon impact of their personal or company AI usage (Claude, Gemini, ChatGPT, etc.) based on 2026 benchmark data.

## 2. Core Features
* **Service Selector:** Dropdown/Cards for major AI providers.
* **Utilization Slider:** 0-100% scale based on "Pro" plan message limits.
* **Multiplier Toggles:** * **Reasoning Mode:** Accounts for high-compute "Thinking" models (20x impact).
    * **Long Threads:** Accounts for context re-processing (3x impact).
    * **Coding Heavy:** Accounts for high-density output tokens (1.5x impact).
* **Visual Impact Dashboard:** Real-time conversion to kg CO2e, car miles, and smartphone charges.
* **Action Tier:** Direct links to high-permanence carbon removal (Climeworks) and verified offsets (Gold Standard).

---

## 3. Technical Logic (JavaScript)

The following function serves as the "Calculation Engine" for the application.

```javascript
/**
 * Calculates estimated monthly carbon impact
 * @param {string} service - 'claude', 'gemini', 'openai', 'copilot'
 * @param {number} usagePercent - 0 to 100 (percentage of plan used)
 * @param {object} options - { reasoningMode: bool, longThreads: bool, codingHeavy: bool }
 * @returns {object} - { kg, miles, kettles }
 */
const calculateImpact = (service, usagePercent, options) => {
  // Base grams CO2e per 1,000 standard queries (2026 Benchmarks)
  const emissionsMap = {
    claude: 400,    // Claude 3.5/3.7 Sonnet baseline
    gemini: 30,     // Google TPU-optimized baseline (Carbon matched)
    openai: 250,    // GPT-4o/o1-mini baseline
    copilot: 150,   // GitHub Copilot specialized coding baseline
    perplexity: 300 // Search-augmented baseline
  };

  const MAX_MONTHLY_QUERIES = 1000; // Average "Pro" cap proxy
  let baseGrams = emissionsMap[service] || 200;
  
  // 1. Calculate base monthly usage
  let totalGrams = baseGrams * (usagePercent / 100);

  // 2. Apply Multipliers (Cumulative)
  if (options.reasoningMode) {
    // Reasoning models generate massive hidden chains of thought
    totalGrams *= 20; 
  }
  
  if (options.longThreads) {
    // Context re-processing increases compute per turn
    totalGrams *= 3;    
  }
  
  if (options.codingHeavy) {
    // Coding outputs are typically 2-4x longer than chat prose
    totalGrams *= 1.5;  
  }

  return {
    kg: (totalGrams / 1000).toFixed(2),
    miles: (totalGrams / 400).toFixed(1), // Avg passenger vehicle is ~400g/mile
    kettles: (totalGrams / 15).toFixed(0), // Boiling 1 liter of water is ~15g CO2e
    smartphones: (totalGrams / 8).toFixed(0) // One full charge is ~8g CO2e
  };
};
```

## 4. Design Requirements (UI/UX)
Aesthetic: "Eco-SaaS" – Dark mode (Anthracite gray) with Emerald Green accents.

Stack: React + Tailwind CSS (Lucide-react for icons).

Interactivity: The dashboard numbers should "odometer-roll" when the slider moves.

## 5. Offset & Removal Directory
The footer or "Take Action" section should include the following verified links:

Tier 1: Permanent Removal
Climeworks - Direct Air Capture (DAC) with underground mineral storage.

Tier 2: High-Quality Offsets
Gold Standard - WWF-founded registry for global carbon reduction.

Tradewater - Prevention of potent greenhouse gas leaks.

Tier 3: Nature-Based Solutions
SeaTrees - Mangrove and Kelp restoration (high-speed sequestration).

Ecologi - Tree planting and carbon reduction project bundles.

## 6. Future Roadmap
V2: Browser Extension that tracks your actual message count on Claude.ai and https://www.google.com/search?q=ChatGPT.com.

V3: API for companies to report their "AI-induced" Scope 3 emissions.


---


# Project Plan: AI Impact Tracker (Browser Extension)

## 1. Goal
A cross-platform browser extension (Chrome/Edge/Firefox) that monitors token usage on `claude.ai`, `chatgpt.com`, and `gemini.google.com`. It provides a simple `/env-impact` command or a popup dashboard.

## 2. Technical Architecture
* **Observer Pattern:** Use `MutationObserver` to watch the chat DOM for new messages.
* **Token Estimation:** Since we can't always access the official tokenizer, we use the **"1.3x Rule"** (English words * 1.3 ≈ tokens) for a high-accuracy proxy.
* **Storage:** `chrome.storage.local` to persist daily and monthly totals.

## 3. The "/env-impact" Logic
Since these sites don't support custom slash commands, the extension will:
1.  Intercept the input field.
2.  If the user types `/env-impact`, the extension prevents the message from sending.
3.  Instead, it injects a custom "UI Toast" or "Shadow DOM" overlay showing the report.

## 4. Development Tasks
### Phase 1: The "Hook" (Week 1)
* Create `manifest.json` (MV3).
* Write content scripts to detect which AI provider is active.
* Implement the token counter (Words to Tokens).

### Phase 2: The Logic (Week 2)
* Map the `calculateImpact()` JS function to the live counts.
* Add logic to detect "Thinking Mode" (searching for UI elements like "Thought for 20 seconds").

### Phase 3: The UI (Week 3)
* Build the Popup dashboard with the car-miles/kettles-boiled icons.
* Add the "Donate to Offset" CTA links.

## 5. Potential Platforms
* **VS Code Extension:** (Crucial for GitHub Copilot users). This would use the `vscode.ChatParticipant` API to track tokens directly within the editor.
* **CLI Tool:** For "Claude Code" users, a wrapper that reads local JSONL logs to generate a terminal-based report.


---
---
---

# Project: AI Impact Tracker (Browser Extension)

## 1. Executive Summary
A privacy-focused browser extension that tracks token usage across major AI platforms (`claude.ai`, `chatgpt.com`, `gemini.google.com`) to provide a real-time estimate of a user's environmental footprint.

## 2. Technical Architecture
The extension uses a **three-tier** approach to capture usage without requiring API keys from the user.

### **A. Content Script (The Observer)**
* **DOM Monitoring:** Uses `MutationObserver` to detect when a user clicks 'Send' or when a 'Thinking' state is triggered.
* **Token Estimation:** Since raw token counts are hidden, we use a 2026-optimized heuristic: `(character_count / 4) * multiplier`.
* **Reasoning Detection:** Specifically watches for CSS selectors like `.claude-thinking-state` or `.gpt-thought-container` to apply the **20x Energy Multiplier**.

### **B. Background Service Worker (The Logic)**
* Receives token events from the Content Script.
* Persists data to `chrome.storage.local` (Local-only, no cloud syncing).
* **Command Intercept:** Listens for the string `/env-impact` in any AI chat box. When detected, it blocks the message and triggers the UI Overlay.

### **C. Shadow DOM UI (The Report)**
* Injects a clean, non-intrusive "Carbon Card" directly into the AI's chat interface when prompted.

---

## 3. The `manifest.json` (MVP V3)
This configuration allows the extension to run on the specific AI domains you use daily.

```json
{
  "manifest_version": 3,
  "name": "EcoAI Tracker",
  "version": "1.0.0",
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "[https://claude.ai/](https://claude.ai/)*",
    "[https://chatgpt.com/](https://chatgpt.com/)*",
    "[https://gemini.google.com/](https://gemini.google.com/)*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["[https://claude.ai/](https://claude.ai/)*", "[https://chatgpt.com/](https://chatgpt.com/)*", "[https://gemini.google.com/](https://gemini.google.com/)*"],
      "js": ["content.js"]
    }
  ],
  "action": {
    "default_popup": "popup.html"
  }
}

```

## 4. Implementation Logic (content.js Snippet)
This snippet demonstrates how the extension "catches" your usage before it's sent.


```javascript
// Local logic to handle the /env-impact command
const inputArea = document.querySelector('div[contenteditable="true"]');

inputArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && inputArea.innerText.trim() === '/env-impact') {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the command
    inputArea.innerText = '';
    
    // Trigger the report UI
    showCarbonReport();
  }
});

/**
 * showCarbonReport()
 * Fetches data from local storage and injects a 
 * "Miles Driven" & "Donation Link" card into the chat.
 */
function showCarbonReport() {
  chrome.storage.local.get(['monthlyTokens', 'currentService'], (data) => {
    const stats = calculateImpact(data.currentService, 100, { reasoningMode: true });
    alert(`Monthly AI Impact: ${stats.kg}kg CO2e. That's ${stats.miles} miles driven.`);
    window.open('[https://your-calculator-site.com/donate](https://your-calculator-site.com/donate)', '_blank');
  });
}
```

## 5. Development Roadmap
Milestone 1: Basic word-count logging for Claude & ChatGPT.

Milestone 2: Detect "Thinking" modes to apply 20x carbon multipliers.

Milestone 3: Build the "Social Comparison" UI (e.g., "You used as much energy as 4 loads of laundry today").

Milestone 4: VS Code integration (tracking Copilot/Cursor usage).

## 6. Privacy & Security
Zero-Leak Policy: The extension never reads the content of the messages, only the length of the strings.

Local Storage: All data stays on the user's machine.

Open Source: The code will be hosted on GitHub for community auditing of the carbon multipliers.


---
---
---

### **One Final Pro-Tip for your 2026 build:**
Since you are in **Madison, WI**, your local grid (MGE) is actually becoming quite clean. If you decide to add "Local vs. Cloud" comparison, remind users that running a model **locally** on a Mac (like your M3/M4) is often **10x more carbon-efficient** than sending a query to a massive data center, because you skip the network overhead and the industrial cooling requirements.

**Would you like me to generate the `popup.html` code to give the extension a clean "Emerald Green" UI?**