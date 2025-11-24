let allMountains = [];
let allClimbersCount = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadMountains();
  setupMountainModal();
});

async function loadMountains() {
  const mountainsListEl = document.getElementById('mountains-list');
  
  if (!mountainsListEl) return;

  try {
    // Показываем индикатор загрузки
    mountainsListEl.innerHTML = '<p>Загрузка данных...</p>';

    allMountains = await fetchData('/api/mountains');
    allClimbersCount = await fetchData('/api/mountains/climbers-count');

    // Создаем карту для быстрого поиска количества альпинистов
    const climbersCountMap = new Map();
    allClimbersCount.forEach(item => {
      climbersCountMap.set(item.mountainId, item.climbersCount);
    });

    if (allMountains.length === 0) {
      mountainsListEl.innerHTML = '<p>Горы не найдены</p>';
      return;
    }

    // Создаем HTML для списка гор
    const html = `
      <div class="mountains-grid">
        ${allMountains.map(mountain => `
          <div class="mountain-card">
            <h3>${escapeHtml(mountain.name)}</h3>
            <div class="mountain-info">
              <p><strong>Высота:</strong> ${mountain.height} м</p>
              <p><strong>Регион:</strong> ${escapeHtml(mountain.region || 'Не указан')}</p>
              <p><strong>Страна:</strong> ${escapeHtml(mountain.country || 'Не указана')}</p>
              <p><strong>Количество альпинистов:</strong> ${climbersCountMap.get(mountain.id) || 0}</p>
            </div>
            <div class="mountain-actions">
              <button class="btn btn-small" onclick="viewMountainGroups(${mountain.id})">Группы восхождений</button>
              <button class="btn btn-small btn-secondary" onclick="editMountain(${mountain.id})">Редактировать</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    mountainsListEl.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при загрузке гор:', error);
    mountainsListEl.innerHTML = '<p class="error">Ошибка при загрузке данных. Проверьте подключение к серверу.</p>';
  }
}

function setupMountainModal() {
  const modal = document.getElementById('mountain-modal');
  const addBtn = document.getElementById('add-mountain-btn');
  const closeBtn = document.querySelector('.close');
  const cancelBtn = document.getElementById('cancel-btn');
  const form = document.getElementById('mountain-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openMountainModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMountainModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeMountainModal);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveMountain();
    });
  }

  if (modal) {
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeMountainModal();
      }
    });
  }
}

function openMountainModal(mountainId = null) {
  const modal = document.getElementById('mountain-modal');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('mountain-form');
  const errorDiv = document.getElementById('mountain-error');
  
  errorDiv.style.display = 'none';
  form.reset();
  document.getElementById('mountain-id').value = '';

  if (mountainId) {
    const mountain = allMountains.find(m => m.id === mountainId);
    if (mountain) {
      title.textContent = 'Редактировать вершину';
      document.getElementById('mountain-id').value = mountain.id;
      document.getElementById('mountain-name').value = mountain.name;
      document.getElementById('mountain-height').value = mountain.height;
      document.getElementById('mountain-region').value = mountain.region || '';
      document.getElementById('mountain-country').value = mountain.country || '';
    }
  } else {
    title.textContent = 'Добавить новую вершину';
  }

  modal.style.display = 'block';
}

function closeMountainModal() {
  const modal = document.getElementById('mountain-modal');
  modal.style.display = 'none';
}

async function saveMountain() {
  const errorDiv = document.getElementById('mountain-error');
  const mountainId = document.getElementById('mountain-id').value;
  const name = document.getElementById('mountain-name').value;
  const height = parseInt(document.getElementById('mountain-height').value);
  const region = document.getElementById('mountain-region').value;
  const country = document.getElementById('mountain-country').value;

  try {
    errorDiv.style.display = 'none';
    
    const mountainData = {
      name: name,
      height: height,
      region: region,
      country: country
    };

    let response;
    if (mountainId) {
      // Обновление
      response = await fetch(`/api/mountains/${mountainId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mountainData)
      });
    } else {
      // Создание
      response = await fetch('/api/mountains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mountainData)
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Ошибка при сохранении' }));
      throw new Error(errorData.message || 'Ошибка при сохранении');
    }

    closeMountainModal();
    await loadMountains();
  } catch (error) {
    console.error('Ошибка при сохранении горы:', error);
    errorDiv.textContent = error.message || 'Ошибка при сохранении. Проверьте, что на гору не было восхождений (для редактирования).';
    errorDiv.style.display = 'block';
  }
}

async function editMountain(mountainId) {
  openMountainModal(mountainId);
}

async function viewMountainGroups(mountainId) {
  try {
    console.log('Загрузка групп для горы ID:', mountainId);
    
    const mountain = allMountains.find(m => m.id === mountainId);
    if (!mountain) {
      alert('Гора не найдена');
      return;
    }
    
    console.log('Гора:', mountain.name, 'ID:', mountain.id);
    
    // Загружаем все экспедиции для поиска по имени горы
    // Это более надежно, чем поиск по ID, так как экспедиции могут быть связаны с разными горами
    const allExpeditions = await fetchData('/api/expeditions');
    console.log('Всего экспедиций:', allExpeditions.length);
    
    // Фильтруем экспедиции по имени горы (используем имя, а не ID, для надежности)
    const mountainExpeditions = allExpeditions.filter(exp => {
      return exp.mountainName === mountain.name;
    });
    console.log('Найдено экспедиций для горы "' + mountain.name + '":', mountainExpeditions.length);
    
    // Всегда получаем группы из экспедиций по имени горы (более надежно)
    // Получаем все группы
    const allGroups = await fetchData('/api/groups');
    
    // Создаем карту групп по именам
    const groupsMap = new Map();
    allGroups.forEach(group => {
      groupsMap.set(group.name, group);
    });
    
    // Получаем уникальные группы из экспедиций для этой горы
    const uniqueGroupNames = new Set();
    mountainExpeditions.forEach(exp => {
      if (exp.groupName) {
        uniqueGroupNames.add(exp.groupName);
      }
    });
    
    // Формируем список групп с полной информацией
    let groups = Array.from(uniqueGroupNames).map(groupName => {
      return groupsMap.get(groupName) || { name: groupName };
    });
    console.log('Получено групп из экспедиций для горы "' + mountain.name + '":', groups.length);
    
    // Используем уже загруженные экспедиции
    // Создаем карту экспедиций по группам
    const expeditionsByGroup = new Map();
    mountainExpeditions.forEach(exp => {
      if (exp.groupName) {
        if (!expeditionsByGroup.has(exp.groupName)) {
          expeditionsByGroup.set(exp.groupName, []);
        }
        expeditionsByGroup.get(exp.groupName).push(exp);
      }
    });
    
    // Сортируем экспедиции по дате
    expeditionsByGroup.forEach(exps => {
      exps.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return dateA - dateB;
      });
    });
    
    let groupsHtml = '';
    if (groups.length === 0) {
      groupsHtml = '<p style="padding: 20px; text-align: center; color: #666;">На эту гору еще не было восхождений</p>';
    } else {
      // Сортируем группы по дате первой экспедиции
      groups.sort((a, b) => {
        const expA = expeditionsByGroup.get(a.name)?.[0];
        const expB = expeditionsByGroup.get(b.name)?.[0];
        if (!expA && !expB) return 0;
        if (!expA) return 1;
        if (!expB) return -1;
        const dateA = new Date(expA.startDate || 0);
        const dateB = new Date(expB.startDate || 0);
        return dateA - dateB;
      });
      
      groupsHtml = `
        <div class="groups-list">
          ${groups.map((group, index) => {
            const groupExpeditions = expeditionsByGroup.get(group.name) || [];
            const firstExpedition = groupExpeditions.length > 0 ? groupExpeditions[0] : null;
            
            return `
            <div class="group-item">
              <h4>${index + 1}. ${escapeHtml(group.name)}</h4>
              ${group.creationDate ? `<p><strong>Дата создания группы:</strong> ${formatDate(group.creationDate)}</p>` : ''}
              ${firstExpedition ? `
                <p><strong>Дата восхождения:</strong> ${formatDate(firstExpedition.startDate)}</p>
                ${firstExpedition.endDate ? `<p><strong>Дата окончания:</strong> ${formatDate(firstExpedition.endDate)}</p>` : ''}
                <p><strong>Статус:</strong> <span class="status status-${getStatusClass(firstExpedition.status)}">${formatStatus(firstExpedition.status)}</span></p>
              ` : ''}
              ${group.members && group.members.length > 0 ? `
                <div class="members-list">
                  <strong>Участники (${group.members.length}):</strong>
                  <ul>
                    ${group.members.map(member => `
                      <li>${escapeHtml(member.name || '')} ${escapeHtml(member.surname || '')}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : '<p><em>Участники не указаны</em></p>'}
            </div>
          `;
          }).join('')}
        </div>
      `;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
        <h2>Группы, восходившие на ${escapeHtml(mountain.name)}</h2>
        <p style="color: #666; margin-bottom: 20px;">Всего групп: <strong>${groups.length}</strong></p>
        ${groupsHtml}
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.remove());
    }
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  } catch (error) {
    console.error('Ошибка при загрузке групп:', error);
    alert('Ошибка при загрузке групп для этой горы: ' + (error.message || 'Неизвестная ошибка'));
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
