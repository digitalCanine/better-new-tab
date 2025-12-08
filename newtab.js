// Load custom colors
function loadColors() {
  chrome.storage.local.get(['customColors'], (result) => {
    if (result.customColors) {
      const colors = result.customColors;
      Object.keys(colors).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, colors[key]);
      });
    }
  });
}

loadColors();

// Time display
const timeEl = document.getElementById("time");

function updateTime() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  timeEl.textContent = `${h}:${m}`;
}

updateTime();
setInterval(updateTime, 1000);

// Weather functionality
const weatherEl = document.getElementById("weather");

async function fetchWeather() {
  try {
    const ipResponse = await fetch('https://ipapi.co/json/');
    const ipData = await ipResponse.json();

    const lat = ipData.latitude;
    const lon = ipData.longitude;
    const city = ipData.city;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`
    );
    const weatherData = await weatherResponse.json();

    const temp = Math.round(weatherData.current.temperature_2m);
    const weatherCode = weatherData.current.weather_code;

    let condition = "clear";
    if (weatherCode >= 80) condition = "rainy";
    else if (weatherCode >= 71) condition = "snowy";
    else if (weatherCode >= 61) condition = "rainy";
    else if (weatherCode >= 51) condition = "drizzle";
    else if (weatherCode >= 45) condition = "foggy";
    else if (weatherCode >= 3) condition = "cloudy";

    weatherEl.textContent = `${city} / ${temp}°C / ${condition}`;
  } catch (error) {
    console.error('Weather fetch failed:', error);
    weatherEl.textContent = "weather offline";
  }
}

fetchWeather();

// Output display
const outputEl = document.getElementById("output");

function createSpan(text, className) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function addOutput(content, className = "") {
  const line = document.createElement("div");
  line.className = `output-line ${className}`;

  if (typeof content === 'string') {
    // Parse the string and create elements safely
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
    const parsed = doc.body.firstChild;

    // Copy all child nodes
    while (parsed.firstChild) {
      line.appendChild(parsed.firstChild);
    }
  } else {
    // It's already a DOM element
    line.appendChild(content);
  }

  outputEl.appendChild(line);

  // Auto-scroll to bottom
  outputEl.scrollTop = outputEl.scrollHeight;
}

function clearOutput() {
  while (outputEl.firstChild) {
    outputEl.removeChild(outputEl.firstChild);
  }
}

// Commands
const commands = {
  '!help': () => {
    clearOutput();

    const header1 = document.createElement('span');
    header1.className = 'output-header';
    header1.textContent = 'AVAILABLE COMMANDS:';
    addOutput(header1);
    addOutput(document.createTextNode(''));

    const helpCommands = [
      { key: '!help', desc: 'Show this help menu' },
      { key: '!config', desc: 'Open color configuration' },
      { key: '!neofetch', desc: 'Display system info' },
      { key: '!hist', desc: 'Show search history' }
    ];

    helpCommands.forEach(cmd => {
      const line = document.createElement('div');
      const key = createSpan(cmd.key, 'output-key');
      const sep = createSpan(' ........... ', 'output-sep');
      const desc = document.createTextNode(cmd.desc);
      line.appendChild(key);
      line.appendChild(sep);
      line.appendChild(desc);
      addOutput(line);
    });

    addOutput(document.createTextNode(''));

    const header2 = document.createElement('span');
    header2.className = 'output-header';
    header2.textContent = 'SEARCH ENGINES:';
    addOutput(header2);
    addOutput(document.createTextNode(''));

    const searchEngines = [
      { key: '!gl [query]', desc: 'Google search' },
      { key: '!ddg [query]', desc: 'DuckDuckGo search' },
      { key: '!yt [query]', desc: 'YouTube search' },
      { key: '!img [query]', desc: 'Google Images search' },
      { key: '!gh [query]', desc: 'GitHub search' },
      { key: '!az [query]', desc: 'Amazon search' },
      { key: '!wiki [query]', desc: 'Wikipedia search' },
      { key: '!maps [query]', desc: 'Google Maps search' },
      { key: '!reddit [query]', desc: 'Reddit search' },
      { key: '!x [query]', desc: 'X (Twitter) search' }
    ];

    searchEngines.forEach(cmd => {
      const line = document.createElement('div');
      const key = createSpan(cmd.key, 'output-key');
      const sep = createSpan(' ...... ', 'output-sep');
      const desc = document.createTextNode(cmd.desc);
      line.appendChild(key);
      line.appendChild(sep);
      line.appendChild(desc);
      addOutput(line);
    });

    addOutput(document.createTextNode(''));

    const footer = createSpan('Type anything else to search DuckDuckGo', 'output-sep');
    addOutput(footer);
  },

  '!neofetch': () => {
    clearOutput();
    const uptime = Math.floor((Date.now() - performance.timeOrigin) / 1000);
    const uptimeMin = Math.floor(uptime / 60);
    const uptimeSec = uptime % 60;

    const header = createSpan('──────────────────────────', 'output-header');
    addOutput(header);

    const info = [
      { key: 'Browser:', value: navigator.userAgent.split(' ').pop() },
      { key: 'Platform:', value: navigator.platform },
      { key: 'Language:', value: navigator.language },
      { key: 'Screen:', value: `${window.screen.width}x${window.screen.height}` },
      { key: 'Tab Uptime:', value: `${uptimeMin}m ${uptimeSec}s` },
      { key: 'Cores:', value: navigator.hardwareConcurrency || 'Unknown' },
      { key: 'Online:', value: navigator.onLine ? 'Yes' : 'No' },
      { key: 'Cookies:', value: navigator.cookieEnabled ? 'Enabled' : 'Disabled' }
    ];

    info.forEach(item => {
      const line = document.createElement('div');
      const key = createSpan(item.key, 'output-key');
      const value = document.createTextNode(' ' + item.value);
      line.appendChild(key);
      line.appendChild(value);
      addOutput(line);
    });

    const footer = createSpan('──────────────────────────', 'output-header');
    addOutput(footer);
  },

  '!hist': () => {
    chrome.storage.local.get(['recentSites'], (result) => {
      clearOutput();
      const list = result.recentSites || [];

      if (list.length === 0) {
        const msg = createSpan('No search history yet', 'output-sep');
        addOutput(msg);
        return;
      }

      const header = createSpan('SEARCH HISTORY:', 'output-header');
      addOutput(header);
      addOutput(document.createTextNode(''));

      list.forEach((site, i) => {
        const line = document.createElement('div');
        const num = createSpan(`${i + 1}.`, 'output-key');
        const name = document.createTextNode(' ' + site.name);
        line.appendChild(num);
        line.appendChild(name);
        addOutput(line);
      });
    });
  },

  '!config': () => {
    clearOutput();

    const header = createSpan('COLOR CONFIGURATION:', 'output-header');
    addOutput(header);
    addOutput(document.createTextNode(''));

    const configDiv = document.createElement('div');
    configDiv.className = 'config-section';

    const colors = ['bg', 'fg', 'accent', 'green', 'orange'];
    const labels = {
      bg: 'Background',
      fg: 'Foreground',
      accent: 'Accent',
      green: 'Green',
      orange: 'Orange'
    };

    colors.forEach(color => {
      const group = document.createElement('div');
      group.className = 'color-input-group';

      const label = document.createElement('label');
      label.textContent = labels[color] + ':';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = getComputedStyle(document.documentElement).getPropertyValue(`--${color}`).trim();
      input.dataset.color = color;
      input.className = 'color-config-input';

      group.appendChild(label);
      group.appendChild(input);
      configDiv.appendChild(group);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'config-buttons';

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.className = 'config-btn';
    applyBtn.onclick = applyColors;

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset to Default';
    resetBtn.className = 'config-btn';
    resetBtn.onclick = resetColors;

    buttonsDiv.appendChild(applyBtn);
    buttonsDiv.appendChild(resetBtn);
    configDiv.appendChild(buttonsDiv);

    const line = document.createElement('div');
    line.className = 'output-line';
    line.appendChild(configDiv);
    outputEl.appendChild(line);
  }
};

function applyColors() {
  const inputs = document.querySelectorAll('.color-config-input');
  const colors = {};

  inputs.forEach(input => {
    if (input.value.trim()) {
      colors[input.dataset.color] = input.value.trim();
      document.documentElement.style.setProperty(`--${input.dataset.color}`, input.value.trim());
    }
  });

  chrome.storage.local.set({ customColors: colors }, () => {
    clearOutput();
    const line = document.createElement('div');
    const check = createSpan('✓', 'output-key');
    const msg = document.createTextNode(' Colors applied successfully!');
    line.appendChild(check);
    line.appendChild(msg);
    addOutput(line);
  });
}

function resetColors() {
  const defaults = {
    bg: '#141414',
    fg: '#feffd3',
    accent: '#c06c43',
    green: '#afb979',
    orange: '#c2a86c'
  };

  Object.keys(defaults).forEach(key => {
    document.documentElement.style.setProperty(`--${key}`, defaults[key]);
  });

  chrome.storage.local.remove('customColors', () => {
    clearOutput();
    const line = document.createElement('div');
    const check = createSpan('✓', 'output-key');
    const msg = document.createTextNode(' Colors reset to default!');
    line.appendChild(check);
    line.appendChild(msg);
    addOutput(line);
  });
}

// Search functionality
const form = document.getElementById("searchForm");
const input = document.getElementById("search");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;

  // Check if it's a direct URL (starts with http:// or https://)
  if (q.startsWith('http://') || q.startsWith('https://')) {
    window.location.href = q;
    return;
  }

  // Check if it looks like a domain (contains . and no spaces)
  if (q.includes('.') && !q.includes(' ') && !q.startsWith('!')) {
    // Add https:// if not present
    window.location.href = `https://${q}`;
    return;
  }

  const parts = q.split(' ');
  const cmd = parts[0].toLowerCase();
  const query = parts.slice(1).join(' ');

  // Check for commands
  if (commands[cmd]) {
    commands[cmd]();
    input.value = "";
    return;
  }

  // Search engine commands
  let url;
  switch (cmd) {
    case '!gl':
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
    case '!yt':
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      break;
    case '!img':
      url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
      break;
    case '!ddg':
      url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      break;
    case '!gh':
      url = `https://github.com/search?q=${encodeURIComponent(query)}`;
      break;
    case '!az':
      url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
      break;
    case '!wiki':
      url = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
      break;
    case '!maps':
      url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      break;
    case '!reddit':
      url = `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`;
      break;
    case '!x':
      url = `https://twitter.com/search?q=${encodeURIComponent(query)}`;
      break;
    default:
      // Default to DuckDuckGo
      url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
  }

  saveVisit(q);
  window.location.href = url;
});

// Storage functions
function saveVisit(query) {
  chrome.storage.local.get(["recentSites"], (result) => {
    const list = result.recentSites || [];
    const entry = {
      name: query.slice(0, 10),
      url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      icon: `https://icons.duckduckgo.com/ip3/duckduckgo.com.ico`
    };
    const filtered = list.filter((x) => x.url !== entry.url);
    filtered.unshift(entry);
    chrome.storage.local.set({ recentSites: filtered.slice(0, 6) }, () => {
      renderRecent();
    });
  });
}

function renderRecent() {
  const wrap = document.getElementById("recent");
  chrome.storage.local.get(["recentSites"], (result) => {
    // Clear existing content safely
    while (wrap.firstChild) {
      wrap.removeChild(wrap.firstChild);
    }

    const list = result.recentSites || [];

    list.forEach((site) => {
      const a = document.createElement("a");
      a.className = "site";
      a.href = site.url;

      const img = document.createElement("img");
      img.src = site.icon;
      img.className = "icon";
      img.alt = site.name;

      const span = document.createElement("span");
      span.textContent = site.name;

      a.appendChild(img);
      a.appendChild(span);
      wrap.appendChild(a);
    });
  });
}

renderRecent();
