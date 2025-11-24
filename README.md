# Overpeak Project

## Требования
- Java 21
- Maven 3.6+
- Docker и Docker Compose (для запуска через Docker)
- PostgreSQL (для локального запуска)

## Способ 1: Запуск через Docker Compose (Рекомендуется)

1. **Соберите проект:**
   ```bash
   cd overpeak
   mvn clean package
   cd ..
   ```

2. **Запустите проект:**
   ```bash
   docker-compose up --build
   ```

3. **Приложение будет доступно по адресу:**
   - Frontend: http://localhost:8087
   - API: http://localhost:8087/api/...

## Способ 2: Локальный запуск

1. **Запустите только PostgreSQL через Docker:**
   ```bash
   docker-compose up postgres
   ```

2. **Соберите и запустите приложение:**
   ```bash
   cd overpeak
   mvn spring-boot:run
   ```

   Или соберите JAR и запустите:
   ```bash
   mvn clean package
   java -jar target/overpeak-0.0.1-SNAPSHOT.jar
   ```

3. **Приложение будет доступно по адресу:**
   - http://localhost:8087

## Настройки базы данных

- **Host:** localhost
- **Port:** 5434
- **Database:** overpeak
- **Username:** postgres
- **Password:** overpeakPass

## Остановка

Для остановки Docker контейнеров:
```bash
docker-compose down
```


