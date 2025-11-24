document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('period-search-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await searchExpeditionsByPeriod();
  });
});

async function searchExpeditionsByPeriod() {
  const resultEl = document.getElementById('expeditions-result');
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  if (!startDate || !endDate) {
    resultEl.innerHTML = '<p class="error">Пожалуйста, заполните обе даты</p>';
    return;
  }

  try {
    resultEl.innerHTML = '<p>Загрузка данных...</p>';

    const expeditions = await fetchData(`/api/expeditions/by-period?start=${startDate}&end=${endDate}`);

    if (expeditions.length === 0) {
      resultEl.innerHTML = '<p>Восхождения не найдены за указанный период</p>';
      return;
    }

    const html = `
      <h2>Найдено восхождений: ${expeditions.length}</h2>
      <div class="ascents-grid">
        ${expeditions.map(expedition => `
          <div class="ascent-card">
            <h3>${escapeHtml(expedition.name)}</h3>
            <div class="ascent-info">
              <p><strong>Гора:</strong> ${escapeHtml(expedition.mountainName || 'Не указана')}</p>
              <p><strong>Группа:</strong> ${escapeHtml(expedition.groupName || 'Не указана')}</p>
              <p><strong>Дата начала:</strong> ${formatDate(expedition.startDate)}</p>
              <p><strong>Дата окончания:</strong> ${formatDate(expedition.endDate)}</p>
              <p><strong>Статус:</strong> <span class="status status-${getStatusClass(expedition.status)}">${formatStatus(expedition.status)}</span></p>
              ${expedition.climbers && expedition.climbers.length > 0 ? `
                <div class="climbers-list">
                  <strong>Участники:</strong>
                  <ul>
                    ${expedition.climbers.map(climber => `
                      <li>${escapeHtml(climber.name)} ${escapeHtml(climber.surname)}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    resultEl.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при поиске восхождений:', error);
    resultEl.innerHTML = '<p class="error">Ошибка при загрузке данных. Проверьте подключение к серверу.</p>';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return 'Не указана';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  } catch (e) {
    return dateString;
  }
}

function formatStatus(status) {
  if (!status) return 'Не указан';
  const statusMap = {
    'PLANNED': 'Запланировано',
    'IN_PROGRESS': 'В процессе',
    'COMPLETED': 'Завершено',
    'CANCELLED': 'Отменено'
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  if (!status) return 'unknown';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('planned')) return 'planned';
  if (statusLower.includes('progress')) return 'in-progress';
  if (statusLower.includes('completed')) return 'completed';
  if (statusLower.includes('cancelled')) return 'cancelled';
  return 'unknown';
}

