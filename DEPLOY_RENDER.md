# Инструкция по деплою Car Stables на Render

## Подготовка

1. Убедитесь, что у вас есть аккаунт на [render.com](https://render.com)
2. Репозиторий уже создан на GitHub: https://github.com/mzakh0808-alt/Car_Stables

## Способ 1: Blueprint (рекомендуется)

1. Зайдите на [dashboard.render.com](https://dashboard.render.com)
2. Нажмите **New +** → **Blueprint**
3. Подключите ваш GitHub аккаунт, если ещё не подключён
4. Выберите репозиторий `Car_Stables`
5. Render автоматически найдёт файл `render.yaml` и предложит настройки
6. Нажмите **Create Web Service**

## Способ 2: Ручная настройка

1. Зайдите на [dashboard.render.com](https://dashboard.render.com)
2. Нажмите **New +** → **Web Service**
3. Подключите репозиторий `Car_Stables`
4. Заполните настройки:

   **Build & Deploy:**
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

   **Advanced:**
   - Health Check Path: `/api/health`

   **Environment Variables:**
   - Key: `STATE_FILE`
   - Value: `/var/data/state.json`

   **Persistent Disk:**
   - Name: `car-stables-data`
   - Mount Path: `/var/data`
   - Size: `1 GB`

5. Нажмите **Create Web Service**

## После деплоя

1. Render автоматически начнёт сборку и деплой
2. Процесс займет 2-5 минут
3. После завершения вы получите URL вида `https://car-stables.onrender.com`
4. Откройте URL и проверьте работу сайта

## Проверка работоспособности

- Главная страница должна загрузиться
- Проверьте форму записи (выбор услуг, даты, времени)
- Проверьте чат-функцию
- Для доступа к панели владельца используйте пароль: `car2024`

## Важные замечания

- **Persistent Disk** нужен для сохранения данных (заявки, чаты)
- Без диска данные будут теряться при каждом перезапуске
- Бесплатный план Render имеет ограничения по времени работы (spins down при неактивности)
- Первый запуск после пробуждения может занять до 30 секунд

## Изменение пароля владельца

Пароль хранится в файле `index.html` в строке:
```javascript
const OWNER_PWD = 'car2024';
```

Для изменения пароля:
1. Отредактируйте строку в `index.html`
2. Закоммитьте изменения: `git add . && git commit -m "Change owner password"`
3. Запушьте: `git push`
4. Render автоматически перезапустит сервис с новым паролем

## Дополнительные файлы

- `render.yaml` - конфигурация для автоматического деплоя
- `README-RENDER.md` - краткая справка по Render
- `server.js` - Express сервер с API
- `index.html` - фронтенд приложения
- `package.json` - зависимости Node.js

## Поддержка

Если возникнут проблемы:
1. Проверьте логи в Render Dashboard → Logs
2. Убедитесь, что все Environment Variables настроены правильно
3. Проверьте, что Persistent Disk подключён
