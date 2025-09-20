# User API Specification

## 概要
ユーザーのレビュー履歴とお気に入り展示を管理するためのRESTful API仕様

## 認証
すべてのエンドポイントはJWT認証が必要
```
Authorization: Bearer <jwt_token>
```

## エンドポイント

### 1. ユーザーレビュー履歴取得

**GET** `/api/user/reviews`

#### パラメータ
- `page` (optional): ページ番号 (default: 1)
- `limit` (optional): 1ページあたりの件数 (default: 10, max: 50)
- `sort` (optional): ソート順 ('created_at_desc' | 'created_at_asc' | 'rating_desc' | 'rating_asc')

#### レスポンス
```json
{
  "success": true,
  "data": [
    {
      "id": "review_123",
      "exhibitionId": "ex_456",
      "exhibitionName": "化学実験ショー",
      "location": "1号館 実験室A",
      "schedule": "10:00-17:00",
      "rating": 5,
      "comment": "とても楽しい実験でした！",
      "createdAt": "2024-11-02T10:30:00Z",
      "updatedAt": "2024-11-02T10:30:00Z",
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. ユーザーお気に入り一覧取得

**GET** `/api/user/favorites`

#### パラメータ
- `page` (optional): ページ番号 (default: 1)
- `limit` (optional): 1ページあたりの件数 (default: 10, max: 50)
- `sort` (optional): ソート順 ('created_at_desc' | 'created_at_asc' | 'name_asc')

#### レスポンス
```json
{
  "success": true,
  "data": [
    {
      "id": "fav_789",
      "exhibitionId": "ex_101",
      "exhibitionName": "美術部作品展",
      "location": "1号館 ギャラリー",
      "schedule": "9:00-17:00",
      "type": "展示",
      "tags": ["アート・文化", "子供向け"],
      "createdAt": "2024-11-02T09:00:00Z",
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. お気に入り追加

**POST** `/api/user/favorites`

#### リクエストボディ
```json
{
  "exhibitionId": "ex_101"
}
```

#### レスポンス
```json
{
  "success": true,
  "data": {
    "id": "fav_789",
    "exhibitionId": "ex_101",
    "createdAt": "2024-11-02T09:00:00Z"
  }
}
```

### 4. お気に入り削除

**DELETE** `/api/user/favorites/{favoriteId}`

#### レスポンス
```json
{
  "success": true,
  "message": "お気に入りを削除しました"
}
```

### 5. レビュー投稿

**POST** `/api/user/reviews`

#### リクエストボディ
```json
{
  "exhibitionId": "ex_456",
  "rating": 5,
  "comment": "とても楽しい実験でした！"
}
```

#### レスポンス
```json
{
  "success": true,
  "data": {
    "id": "review_123",
    "exhibitionId": "ex_456",
    "rating": 5,
    "comment": "とても楽しい実験でした！",
    "createdAt": "2024-11-02T10:30:00Z"
  }
}
```

### 6. レビュー更新

**PUT** `/api/user/reviews/{reviewId}`

#### リクエストボディ
```json
{
  "rating": 4,
  "comment": "更新されたコメント"
}
```

### 7. レビュー削除

**DELETE** `/api/user/reviews/{reviewId}`

## エラーレスポンス

### 認証エラー (401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です"
  }
}
```

### バリデーションエラー (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが無効です",
    "details": {
      "rating": "1-5の範囲で入力してください",
      "exhibitionId": "展示IDは必須です"
    }
  }
}
```

### リソース未発見 (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "指定されたリソースが見つかりません"
  }
}
```

### サーバーエラー (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "サーバー内部エラーが発生しました"
  }
}
```

## セキュリティ考慮事項

1. **認証**: すべてのエンドポイントでJWT認証を必須とする
2. **認可**: ユーザーは自分のデータのみアクセス可能
3. **レート制限**: API呼び出し回数を制限（例：1分間に60回）
4. **入力検証**: すべての入力データを厳密に検証
5. **SQLインジェクション対策**: パラメータ化クエリを使用
6. **XSS対策**: 出力時のエスケープ処理

## パフォーマンス最適化

1. **ページネーション**: 大量データの分割取得
2. **インデックス**: データベースの適切なインデックス設定
3. **キャッシュ**: Redis等を使用したキャッシュ戦略
4. **画像最適化**: 画像URLの最適化とCDN使用
5. **データベース最適化**: N+1問題の回避