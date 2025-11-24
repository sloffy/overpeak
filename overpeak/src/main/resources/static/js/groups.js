let allGroups = [];
let allClimbers = [];
let allMountains = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadGroups();
  setupModals();
});

async function loadGroups() {
  const groupsListEl = document.getElementById('groups-list');
  
  if (!groupsListEl) return;

  try {
    // Показываем индикатор загрузки
    groupsListEl.innerHTML = '<p>Загрузка данных...</p>';

    allGroups = await fetchData('/api/groups');

    if (allGroups.length === 0) {
      groupsListEl.innerHTML = '<p>Группы не найдены</p>';
      return;
    }

    // Создаем HTML для списка групп
    const html = `
      <div class="groups-grid">
        ${allGroups.map(group => `
          <div class="group-card">
            <h3>${escapeHtml(group.name)}</h3>
            <div class="group-info">
              <p><strong>Дата создания:</strong> ${formatDate(group.creationDate)}</p>
              <p><strong>Количество участников:</strong> ${group.members ? group.members.length : 0}</p>
              ${group.members && group.members.length > 0 ? `
                <div class="members-list">
                  <strong>Участники:</strong>
                  <ul>
                    ${group.members.map(member => `
                      <li>${escapeHtml(member.name)} ${escapeHtml(member.surname)}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    groupsListEl.innerHTML = html;
  } catch (error) {
    console.error('Ошибка при загрузке групп:', error);
    groupsListEl.innerHTML = '<p class="error">Ошибка при загрузке данных. Проверьте подключение к серверу.</p>';
  }
}

function setupModals() {
  // Модальное окно для создания группы с экспедицией
  const groupModal = document.getElementById('group-expedition-modal');
  const addGroupBtn = document.getElementById('add-group-btn');
  const closeGroupBtn = groupModal?.querySelector('.close');
  const cancelGroupBtn = document.getElementById('cancel-group-btn');
  const groupForm = document.getElementById('group-expedition-form');

  if (addGroupBtn) {
    addGroupBtn.addEventListener('click', async () => {
      await openGroupExpeditionModal();
    });
  }

  if (closeGroupBtn) {
    closeGroupBtn.addEventListener('click', () => closeModal('group-expedition-modal'));
  }

  if (cancelGroupBtn) {
    cancelGroupBtn.addEventListener('click', () => closeModal('group-expedition-modal'));
  }

  if (groupForm) {
    groupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveGroupExpedition();
    });
  }

  // Модальное окно для добавления альпиниста
  const climberModal = document.getElementById('add-climber-modal');
  const addClimberBtn = document.getElementById('add-climber-to-group-btn');
  const closeClimberBtn = climberModal?.querySelector('.close');
  const cancelClimberBtn = document.getElementById('cancel-climber-btn');
  const climberForm = document.getElementById('add-climber-form');

  if (addClimberBtn) {
    addClimberBtn.addEventListener('click', async () => {
      await openAddClimberModal();
    });
  }

  if (closeClimberBtn) {
    closeClimberBtn.addEventListener('click', () => closeModal('add-climber-modal'));
  }

  if (cancelClimberBtn) {
    cancelClimberBtn.addEventListener('click', () => closeModal('add-climber-modal'));
  }

  if (climberForm) {
    climberForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addClimberToGroup();
    });
  }

  // Закрытие по клику вне модального окна
  if (groupModal) {
    window.addEventListener('click', (e) => {
      if (e.target === groupModal) closeModal('group-expedition-modal');
    });
  }

  if (climberModal) {
    window.addEventListener('click', (e) => {
      if (e.target === climberModal) closeModal('add-climber-modal');
    });
  }
}

async function openGroupExpeditionModal() {
  const modal = document.getElementById('group-expedition-modal');
  const errorDiv = document.getElementById('group-expedition-error');
  const mountainSelect = document.getElementById('expedition-mountain');
  
  errorDiv.style.display = 'none';
  document.getElementById('group-expedition-form').reset();

  // Загружаем горы
  try {
    allMountains = await fetchData('/api/mountains');
    mountainSelect.innerHTML = '<option value="">Выберите гору</option>';
    allMountains.forEach(mountain => {
      const option = document.createElement('option');
      option.value = mountain.name;
      option.textContent = mountain.name;
      mountainSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Ошибка при загрузке гор:', error);
  }

  modal.style.display = 'block';
}

async function saveGroupExpedition() {
  const errorDiv = document.getElementById('group-expedition-error');
  const groupName = document.getElementById('group-name').value;
  const mountainName = document.getElementById('expedition-mountain').value;
  const expeditionName = document.getElementById('expedition-name').value;
  const startDate = document.getElementById('expedition-start-date').value;
  const endDate = document.getElementById('expedition-end-date').value;
  const status = document.getElementById('expedition-status').value;

  try {
    errorDiv.style.display = 'none';

    // Сначала создаем группу
    const groupResponse = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: groupName })
    });

    if (!groupResponse.ok) {
      throw new Error('Ошибка при создании группы');
    }

    const group = await groupResponse.json();

    // Затем создаем экспедицию
    const expeditionData = {
      name: expeditionName,
      startDate: startDate,
      endDate: endDate || null,
      status: status,
      mountainName: mountainName,
      groupName: groupName
    };

    const expeditionResponse = await fetch('/api/expeditions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expeditionData)
    });

    if (!expeditionResponse.ok) {
      const errorData = await expeditionResponse.json().catch(() => ({ message: 'Ошибка при создании экспедиции' }));
      throw new Error(errorData.message || 'Ошибка при создании экспедиции');
    }

    closeModal('group-expedition-modal');
    await loadGroups();
  } catch (error) {
    console.error('Ошибка при создании группы с экспедицией:', error);
    errorDiv.textContent = error.message || 'Ошибка при создании группы с экспедицией';
    errorDiv.style.display = 'block';
  }
}

async function openAddClimberModal() {
  const modal = document.getElementById('add-climber-modal');
  const errorDiv = document.getElementById('add-climber-error');
  const climberSelect = document.getElementById('climber-select');
  const groupSelect = document.getElementById('group-select');
  
  errorDiv.style.display = 'none';
  document.getElementById('add-climber-form').reset();

  // Загружаем альпинистов из групп
  try {
    const groups = await fetchData('/api/groups');
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
    allClimbers = Array.from(climbersMap.values());

    climberSelect.innerHTML = '<option value="">Выберите альпиниста</option>';
    allClimbers.forEach(climber => {
      const option = document.createElement('option');
      option.value = climber.id;
      option.textContent = `${climber.name} ${climber.surname}`;
      climberSelect.appendChild(option);
    });

    groupSelect.innerHTML = '<option value="">Выберите группу</option>';
    allGroups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.name;
      groupSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }

  modal.style.display = 'block';
}

async function addClimberToGroup() {
  const errorDiv = document.getElementById('add-climber-error');
  const climberId = document.getElementById('climber-select').value;
  const groupId = document.getElementById('group-select').value;

  if (!climberId || !groupId) {
    errorDiv.textContent = 'Пожалуйста, выберите альпиниста и группу';
    errorDiv.style.display = 'block';
    return;
  }

  try {
    errorDiv.style.display = 'none';

    const response = await fetch(`/api/climbers/${climberId}/group/${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Ошибка при добавлении альпиниста' }));
      throw new Error(errorData.message || 'Ошибка при добавлении альпиниста в группу');
    }

    closeModal('add-climber-modal');
    await loadGroups();
  } catch (error) {
    console.error('Ошибка при добавлении альпиниста:', error);
    errorDiv.textContent = error.message || 'Ошибка при добавлении альпиниста в группу';
    errorDiv.style.display = 'block';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
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
