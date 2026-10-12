# Car Stables — Render

Подключите репозиторий в Render и выберите **New → Blueprint** — настройки берутся из `render.yaml`.

Ручная настройка: Runtime Node; Build `npm install`; Start `npm start`; Health Check `/api/health`; Persistent Disk `/var/data`; `STATE_FILE=/var/data/state.json`.

Исправлено: realtime SSE вместо опроса раз в 6 секунд, рабочий ответ владельца через `ownerChatInput`, очередь сохранений, атомарная запись JSON, health endpoint и поддержка Render PORT/0.0.0.0.

Пароль владельца оставлен в клиентской логике, чтобы не менять текущий UX.
