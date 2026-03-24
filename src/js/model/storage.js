const PREFIX = "nakit_akisi_senaryo_";

export const saveScenario = (name, config) => {
  localStorage.setItem(PREFIX + name, JSON.stringify(config));
  localStorage.setItem("nakit_akisi_last_scenario", name);
};

export const loadScenario = (name) => {
  const data = localStorage.getItem(PREFIX + name);
  return data ? JSON.parse(data) : null;
};

export const deleteScenario = (name) => {
  localStorage.removeItem(PREFIX + name);
};

export const getScenarioList = () => {
  const list = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(PREFIX)) {
      list.push(key.replace(PREFIX, ""));
    }
  }
  return list;
};

export const getLastScenarioName = () => {
  return localStorage.getItem("nakit_akisi_last_scenario") || "Baz";
};
