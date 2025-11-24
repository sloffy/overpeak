document.addEventListener("DOMContentLoaded", async () => {
  const climbersListEl = document.getElementById('climbers-list');
  
  if (!climbersListEl) return;

  try {
    // Показываем индикатор загрузки
    climbersListEl.innerHTML = '<p>Загрузка данных...</p>';

    // Получаем альпинистов из групп
    const groups = await fetchData('/api/groups');
    const ascents = await fetchData('/api/climbers/ascents');

    // Собираем всех уникальных альпинистов
    const climbersMap = new Map();
    groups.forEach(group => {
      if (group.members) {
        group.members.forEach(climber => {
          if (!climbersMap.has(climber.id)) {
            climbersMap.set(climber.id, climber);
          }
        });
      }
    });

    // Создаем карту восхождений
    const ascentsMap = new Map();
    ascents.forEach(ascent => {
      const key = `${ascent.climberId}-${ascent.mountainId}`;
      if (!ascentsMap.has(ascent.climberId)) {
        ascentsMap.set(ascent.climberId, 0);
      }
      ascentsMap.set(ascent.climberId, ascentsMap.get(ascent.climberId) + ascent.ascents);
    });

    const climbers = Array.from(climbersMap.values());

    if (climbers.length === 0) {
      climbersListEl.innerHTML = '<p>Альпинисты не найдены</p>';
      return;
    }

    // Создаем HTML для списка альпинистов
    const html = `
      <div class="climbers-grid">
        ${climbers.map(climber => `
          <div class="climber-card">
            <h3>${escapeHtml(climber.name)} ${escapeHtml(climber.surname)}</h3>
            <div class="climber-info">
              <p><strong>Адрес:</strong> ${escapeHtml(climber.address || 'Не указан')}</p>
              <p><strong>Контактная информация:</strong> ${escapeHtml(climber.contactInfo || 'Не указана')}</p>
              <p><strong>Количество восхождений:</strong> ${ascentsMap.get(climber.id) || 0}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    climbersListEl.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при загрузке альпинистов:', error);
    climbersListEl.innerHTML = '<p class="error">Ошибка при загрузке данных. Проверьте подключение к серверу.</p>';
  }
});

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
