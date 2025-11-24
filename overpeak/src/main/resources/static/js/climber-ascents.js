document.addEventListener("DOMContentLoaded", async () => {
  await loadClimberAscents();
});

async function loadClimberAscents() {
  const ascentsListEl = document.getElementById('ascents-list');
  
  if (!ascentsListEl) return;

  try {
    const ascents = await fetchData('/api/climbers/ascents');
    const climbers = await fetchData('/api/groups').then(groups => {
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
      return Array.from(climbersMap.values());
    });
    const mountains = await fetchData('/api/mountains');

    const climbersMap = new Map(climbers.map(c => [c.id, c]));
    const mountainsMap = new Map(mountains.map(m => [m.id, m]));

    if (ascents.length === 0) {
      ascentsListEl.innerHTML = '<p>Данные о восхождениях не найдены</p>';
      return;
    }

    // Группируем по альпинистам
    const climberAscentsMap = new Map();
    ascents.forEach(ascent => {
      if (!climberAscentsMap.has(ascent.climberId)) {
        climberAscentsMap.set(ascent.climberId, []);
      }
      climberAscentsMap.get(ascent.climberId).push(ascent);
    });

    const html = `
      <div class="climber-ascents-list">
        ${Array.from(climberAscentsMap.entries()).map(([climberId, climberAscents]) => {
          const climber = climbersMap.get(climberId);
          if (!climber) return '';
          
          return `
            <div class="climber-ascent-card">
              <h3>${escapeHtml(climber.name)} ${escapeHtml(climber.surname)}</h3>
              <div class="ascents-table">
                <table>
                  <thead>
                    <tr>
                      <th>Гора</th>
                      <th>Количество восхождений</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${climberAscents.map(ascent => {
                      const mountain = mountainsMap.get(ascent.mountainId);
                      return `
                        <tr>
                          <td>${escapeHtml(mountain ? mountain.name : 'Неизвестная гора')}</td>
                          <td><strong>${ascent.ascents}</strong></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    ascentsListEl.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при загрузке восхождений:', error);
    ascentsListEl.innerHTML = '<p class="error">Ошибка при загрузке данных. Проверьте подключение к серверу.</p>';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

