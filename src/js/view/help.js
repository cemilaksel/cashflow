export const renderHelp = (container, helpData) => {
  let html = `
    <div class="help-content">
      <p class="help-intro">Nakit akışı projeksiyonu aracını en verimli şekilde kullanmak için aşağıdaki adımları takip edebilirsiniz:</p>
      
      <div class="help-sections">
        ${helpData.sections.map(section => `
          <div class="help-section">
            <h3>${section.heading}</h3>
            <p>${section.text}</p>
          </div>
        `).join('')}
      </div>

      <div class="help-scenario">
        <h3>💡 ${helpData.scenario.title}</h3>
        <ul>
          ${helpData.scenario.steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  container.innerHTML = html;
};
