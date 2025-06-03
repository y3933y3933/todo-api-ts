# TODO API

基於 `TypeScript` + `Express.js` + `Drizzle ORM` + `PostgreSQL` 的後端 API 服務，支持代辦事項的 CRUD 操作，並且包括用戶認證和管理功能。

## 📋 目錄

- [功能特色](#功能特色)
- [安裝說明](#安裝說明)
- [API 文檔](#api-文檔)

## ✨ 功能特色

- 🚀 代辦事項管理：可以創建、更新、刪除和查詢代辦事項。
- 📊 JWT 認證：使用 JWT 進行安全的 API 請求認證。

## 🚀 安裝說明

### 系統需求

- Node.js >= 21.7.0

### 開發環境建置

```bash
# 複製專案
git clone https://github.com/y3933y3933/todo-api-ts.git

# 進入專案目錄
cd todo-api-ts

# 安裝相依套件
npm install

# 或使用 yarn
yarn install
```

### 環境變數

請確保在根目錄創建 `.env` 文件，並根據需要設置以下環境變數：

```bash
PORT=8080
PLATFORM="dev"
DB_URL=<資料庫>
SECRET=<JWT SECRET>
```

### Docker 啟動資料庫 (Optional)

```bash
docker compose up
```

### 啟動

```
npm run dev
```

應用將會在 [localhost:8080](localhost:8080) 執行

## 📚 API 文檔

### 🏥 健康檢查

#### `GET /api/healthz`

**描述：**
檢查 API 伺服器的健康狀態。

**回傳值：**

```json
{
  "env": "dev",
  "status": "available"
}
```

---

### 👩‍💼 管理員功能

#### `POST /admin/reset`

**描述：**
重置資料庫，清除所有使用者資料。

**回傳值：**

```json
{
  "message": "Database reset successfully"
}
```

---

### 🔐 認證相關

#### `POST /api/register`

**描述：**
用戶註冊新帳號。

**參數：**

- `email` (string): 用戶的電子郵件地址
- `password` (string): 用戶的密碼

**範例請求：**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**回傳值：**

```json
{
  "id": "7707962c-3933-4560-9639-e00487045311",
  "email": "user@example.com",
  "createdAt": "2025-06-03T18:58:04.019Z",
  "updatedAt": "2025-06-03T18:58:04.019Z"
}
```

---

#### `POST /api/login`

**描述：**
用戶登錄，獲取 `access token` 和 `refresh token`。

**參數：**

- `email` (string): 用戶的電子郵件地址
- `password` (string): 用戶的密碼

**範例請求：**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**回傳值：**

```json
{
  "id": "7707962c-3933-4560-9639-e00487045311",
  "email": "user@example.com",
  "createdAt": "2025-06-03T18:58:04.019Z",
  "updatedAt": "2025-06-03T18:58:04.019Z",
  "token": "jwt-access-token",
  "refreshToken": "refresh-token"
}
```

---

#### `POST /api/refresh`

**描述：**
使用 `refresh token` 獲取新的 `access token`。

**參數：**

- `refreshToken` (string): 用戶的 `refresh token`

**回傳值：**

```json
{
  "accessToken": "new-jwt-access-token"
}
```

---

#### `POST /api/revoke`

**描述：**
撤銷（登出）用戶的 `refresh token`。

**參數：**

- `refreshToken` (string): 要撤銷的 `refresh token`

**回傳值：**

staus code `204`

---

### 📝 TODO 管理

#### `POST /api/todos`

**描述：**
創建新的 TODO 項目。

**參數：**

- `title` (string): 代辦事項的標題（必填）
- `description` (string, optional): 代辦事項的描述

**標頭:**

- `Authorization: Bearer <accessToken>`

**範例請求：**

```json
{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread, and cheese"
}
```

**回傳值：**

```json
{
  "id": "6a2eb168-cdcb-44dc-8eaa-f265bdba2510",
  "createdAt": "2025-06-03T19:01:46.894Z",
  "updatedAt": "2025-06-03T19:01:46.894Z",
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread, and cheese",
  "userId": "7707962c-3933-4560-9639-e00487045311"
}
```

---

#### `PUT /api/todos/:id`

**描述：**
更新指定 `id` 的 TODO 項目。

**參數：**

- `title` (string): 新的代辦事項標題（必填）
- `description` (string, optional): 新的代辦事項描述

**範例請求：**

```json
{
  "title": "Buy groceries",
  "description": "Buy drinks."
}
```

**回傳值：**

```json
{
  "id": "6a2eb168-cdcb-44dc-8eaa-f265bdba2510",
  "createdAt": "2025-06-03T19:01:46.894Z",
  "updatedAt": "2025-06-03T19:02:48.229Z",
  "title": "Buy groceries",
  "description": "Buy drinks.",
  "userId": "7707962c-3933-4560-9639-e00487045311"
}
```

---

#### `DELETE /api/todos/:id`

**描述：**
刪除指定 `id` 的 TODO 項目。

**回傳值：**

status code `204`

---

#### `GET /api/todos`

**描述：**
獲取所有的 TODO 項目。

**回傳值：**

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Buy milk, eggs, bread, and cheese",
    "createdAt": "2025-06-04T12:00:00Z",
    "updatedAt": "2025-06-04T12:00:00Z"
  },
  {
    "id": 2,
    "title": "Clean the house",
    "description": "Vacuum and mop the floors",
    "createdAt": "2025-06-04T12:30:00Z",
    "updatedAt": "2025-06-04T12:30:00Z"
  }
]
```

---

#### `GET /api/todos/:id`

**描述：**
獲取指定 `id` 的 TODO 項目。

**回傳值：**

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread, and cheese",
  "createdAt": "2025-06-04T12:00:00Z",
  "updatedAt": "2025-06-04T12:00:00Z"
}
```

---
