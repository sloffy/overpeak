// Базовые функции для работы с API
const API_BASE_URL = '/api';

// Делаем функцию глобальной, чтобы она была доступна в других скриптах
window.fetchData = async function(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};

// Загрузка статистики для главной страницы
document.addEventListener("DOMContentLoaded", async () => {
  const mountainsCountEl = document.getElementById('mountains-count');
  const groupsCountEl = document.getElementById('groups-count');
  const climbersCountEl = document.getElementById('climbers-count');
  const ascentsCountEl = document.getElementById('ascents-count');

  if (mountainsCountEl || groupsCountEl || climbersCountEl || ascentsCountEl) {
    try {
      // Загружаем данные параллельно
      const [mountains, groups, expeditions] = await Promise.all([
        fetchData(`${API_BASE_URL}/mountains`),
        fetchData(`${API_BASE_URL}/groups`),
        fetchData(`${API_BASE_URL}/expeditions`)
      ]);

      // Подсчитываем уникальных альпинистов из групп
      const uniqueClimbers = new Set();
      groups.forEach(group => {
        if (group.members) {
          group.members.forEach(climber => {
            uniqueClimbers.add(climber.id);
          });
        }
      });

      if (mountainsCountEl) {
        mountainsCountEl.textContent = mountains.length;
      }
      if (groupsCountEl) {
        groupsCountEl.textContent = groups.length;
      }
      if (climbersCountEl) {
        climbersCountEl.textContent = uniqueClimbers.size;
      }
      if (ascentsCountEl) {
        ascentsCountEl.textContent = expeditions.length;
      }
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
      // Показываем ошибку пользователю
      if (mountainsCountEl) mountainsCountEl.textContent = 'Ошибка';
      if (groupsCountEl) groupsCountEl.textContent = 'Ошибка';
      if (climbersCountEl) climbersCountEl.textContent = 'Ошибка';
      if (ascentsCountEl) ascentsCountEl.textContent = 'Ошибка';
    }
  }
});