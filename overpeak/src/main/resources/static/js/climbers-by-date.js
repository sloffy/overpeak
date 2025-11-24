document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('date-search-form');
  const resultEl = document.getElementById('climbers-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await searchClimbersByDate();
  });
});

async function searchClimbersByDate() {
  const resultEl = document.getElementById('climbers-result');
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  if (!startDate || !endDate) {
    resultEl.innerHTML = '<p class="error">Пожалуйста, заполните обе даты</p>';
    return;
  }

  try {
    resultEl.innerHTML = '<p>Загрузка данных...</p>';

    const climbers = await fetchData(`/api/climbers/by-dates?start=${startDate}&end=${endDate}`);

    if (climbers.length === 0) {
      resultEl.innerHTML = '<p>Альпинисты не найдены за указанный период</p>';
      return;
    }

    const html = `
      <h2>Найдено альпинистов: ${climbers.length}</h2>
      <div class="climbers-grid">
        ${climbers.map(climber => `
          <div class="climber-card">
            <h3>${escapeHtml(climber.name)} ${escapeHtml(climber.surname)}</h3>
            <div class="climber-info">
              <p><strong>Адрес:</strong> ${escapeHtml(climber.address || 'Не указан')}</p>
              <p><strong>Контактная информация:</strong> ${escapeHtml(climber.contactInfo || 'Не указана')}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    resultEl.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при поиске альпинистов:', error);
    resultEl.innerHTML = '<p class="error">Ошибка при загрузке данных. Проверьте подключение к серверу.</p>';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

