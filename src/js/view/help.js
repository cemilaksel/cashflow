export const renderHelp = (container, helpData) => {
  let html = `
    <div class="help-content">
      <div class="help-header">
        <p class="help-intro">Nakit akışı projeksiyonu aracını en verimli şekilde kullanmak için aşağıdaki adımları takip edebilirsiniz:</p>
      </div>
      
      <div class="help-grid">
        ${helpData.sections.map(section => `
          <div class="help-card">
            <div class="help-card-icon">${section.icon}</div>
            <div class="help-card-body">
              <h3>${section.heading}</h3>
              <p>${section.text}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="help-scenario-container">
        <div class="help-scenario-badge">Örnek Senaryo</div>
        <div class="help-scenario-card">
          <h3>${helpData.scenario.title}</h3>
          <div class="help-steps">
            ${helpData.scenario.steps.map((step, index) => `
              <div class="help-step">
                <span class="step-number">${index + 1}</span>
                <p>${step}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
};
