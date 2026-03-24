import { getDemoConfig, getEmptyConfig } from '../model/config.js';
import { calculateProjection } from '../model/hesapla.js';
import { saveScenario, loadScenario, deleteScenario, getScenarioList, getLastScenarioName } from '../model/storage.js';
import { renderTable } from '../view/tablo.js';
import { renderChart } from '../view/grafik.js';
import { renderCards } from '../view/kartlar.js';
import { renderForm } from '../view/form.js';
import { exportToCSV, exportToJSON } from '../utils/export.js';

let currentConfig = getDemoConfig();
let currentScenario = "Baz";
let activeTab = "data"; // "data" or "results"

const elements = {
  scenarioSelect: document.getElementById('scenario-select'),
  btnSave: document.getElementById('btn-save'),
  btnSaveAs: document.getElementById('btn-save-as'),
  btnDelete: document.getElementById('btn-delete'),
  btnExport: document.getElementById('btn-export'),
  btnImport: document.getElementById('btn-import'),
  importFile: document.getElementById('import-file'),
  tabData: document.getElementById('tab-data'),
  tabResults: document.getElementById('tab-results'),
  contentData: document.getElementById('content-data'),
  contentResults: document.getElementById('content-results'),
  cardsContainer: document.getElementById('cards-container'),
  chartContainer: document.getElementById('chart-container'),
  tableContainer: document.getElementById('table-container'),
  btnDemo: document.getElementById('btn-demo'),
  btnReset: document.getElementById('btn-reset'),
  btnToResults: document.getElementById('btn-to-results'),
  btnToData: document.getElementById('btn-to-data'),
  btnExportExcel: document.getElementById('btn-export-excel'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-body'),
  modalCancel: document.getElementById('modal-cancel'),
  modalConfirm: document.getElementById('modal-confirm'),
  banner: document.getElementById('banner')
};

const showBanner = (msg, type = 'success') => {
  elements.banner.textContent = msg;
  elements.banner.className = `banner ${type} show`;
  setTimeout(() => {
    elements.banner.classList.remove('show');
  }, 3000);
};

const showModal = (title, bodyHtml, onConfirm) => {
  elements.modalTitle.textContent = title;
  elements.modalBody.innerHTML = bodyHtml;
  elements.modalOverlay.classList.add('show');
  
  const confirmHandler = () => {
    onConfirm();
    closeModal();
    elements.modalConfirm.removeEventListener('click', confirmHandler);
  };
  
  elements.modalConfirm.addEventListener('click', confirmHandler);
  
  const cancelHandler = () => {
    closeModal();
    elements.modalConfirm.removeEventListener('click', confirmHandler);
    elements.modalCancel.removeEventListener('click', cancelHandler);
  };
  elements.modalCancel.addEventListener('click', cancelHandler);
};

const closeModal = () => {
  elements.modalOverlay.classList.remove('show');
};

const updateUI = () => {
  const results = calculateProjection(currentConfig);
  
  if (activeTab === "data") {
    elements.tabData.classList.add('active');
    elements.tabResults.classList.remove('active');
    elements.contentData.classList.remove('hidden');
    elements.contentResults.classList.add('hidden');
    document.getElementById('data-actions').classList.remove('hidden');
    document.getElementById('results-actions').classList.add('hidden');
    renderForm(elements.contentData, currentConfig, updateUI);
  } else {
    elements.tabData.classList.remove('active');
    elements.tabResults.classList.add('active');
    elements.contentData.classList.add('hidden');
    elements.contentResults.classList.remove('hidden');
    document.getElementById('data-actions').classList.add('hidden');
    document.getElementById('results-actions').classList.remove('hidden');
    renderCards(elements.cardsContainer, results);
    renderChart(elements.chartContainer, results);
    renderTable(elements.tableContainer, currentConfig, results);
  }
};

const refreshScenarioList = () => {
  const list = getScenarioList();
  if (!list.includes("Baz")) {
    saveScenario("Baz", getDemoConfig());
    list.push("Baz");
  }
  
  elements.scenarioSelect.innerHTML = list.map(s => `<option value="${s}" ${s === currentScenario ? 'selected' : ''}>${s}</option>`).join('');
};

// Init
const init = () => {
  currentScenario = getLastScenarioName();
  const saved = loadScenario(currentScenario);
  if (saved) currentConfig = saved;
  
  refreshScenarioList();
  updateUI();
};

// Listeners
elements.tabData.addEventListener('click', () => { activeTab = "data"; updateUI(); });
elements.tabResults.addEventListener('click', () => { activeTab = "results"; updateUI(); });
elements.btnToResults.addEventListener('click', () => { activeTab = "results"; updateUI(); });
elements.btnToData.addEventListener('click', () => { activeTab = "data"; updateUI(); });

elements.scenarioSelect.addEventListener('change', (e) => {
  currentScenario = e.target.value;
  const saved = loadScenario(currentScenario);
  if (saved) {
    currentConfig = saved;
    updateUI();
  }
});

elements.btnSave.addEventListener('click', () => {
  saveScenario(currentScenario, currentConfig);
  showBanner(`"${currentScenario}" senaryosu kaydedildi.`);
});

elements.btnSaveAs.addEventListener('click', () => {
  showModal("Farklı Kaydet", `
    <p>Yeni senaryo ismini giriniz:</p>
    <input type="text" id="new-scenario-name" class="modal-input" placeholder="Senaryo Adı">
  `, () => {
    const name = document.getElementById('new-scenario-name').value.trim();
    if (name) {
      currentScenario = name;
      saveScenario(name, currentConfig);
      refreshScenarioList();
      showBanner(`"${name}" olarak kaydedildi.`);
    }
  });
});

elements.btnDelete.addEventListener('click', () => {
  if (currentScenario === "Baz") {
    showBanner("Baz senaryosu silinemez!", "error");
    return;
  }
  showModal("Senaryoyu Sil", `<p>"${currentScenario}" senaryosunu silmek istediğinize emin misiniz?</p>`, () => {
    deleteScenario(currentScenario);
    currentScenario = "Baz";
    currentConfig = loadScenario("Baz") || getDemoConfig();
    refreshScenarioList();
    updateUI();
    showBanner("Senaryo silindi.");
  });
});

elements.btnExport.addEventListener('click', () => {
  exportToJSON(currentScenario, currentConfig);
});

elements.btnImport.addEventListener('click', () => {
  elements.importFile.click();
});

elements.importFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.name && data.config) {
        currentScenario = data.name;
        currentConfig = data.config;
        saveScenario(currentScenario, currentConfig);
        refreshScenarioList();
        updateUI();
        showBanner("Senaryo başarıyla yüklendi.");
      }
    } catch (err) {
      showBanner("Geçersiz dosya formatı!", "error");
    }
  };
  reader.readAsText(file);
});

elements.btnDemo.addEventListener('click', () => {
  showModal("Demo Verileri Yükle", "<p>Mevcut veriler silinecek ve demo verileri yüklenecek. Onaylıyor musunuz?</p>", () => {
    currentConfig = getDemoConfig();
    updateUI();
    showBanner("Demo verileri yüklendi.");
  });
});

elements.btnReset.addEventListener('click', () => {
  showModal("Tüm Verileri Sil", "<p>Tüm veriler sıfırlanacak. Onaylıyor musunuz?</p>", () => {
    currentConfig = getEmptyConfig();
    updateUI();
    showBanner("Tüm veriler silindi.");
  });
});

elements.btnExportExcel.addEventListener('click', () => {
  const results = calculateProjection(currentConfig);
  exportToCSV(currentConfig, results);
});

elements.modalOverlay.addEventListener('click', (e) => {
  if (e.target === elements.modalOverlay) closeModal();
});

init();
window.addEventListener('resize', () => {
  if (activeTab === "results") {
    const results = calculateProjection(currentConfig);
    renderChart(elements.chartContainer, results);
  }
});
