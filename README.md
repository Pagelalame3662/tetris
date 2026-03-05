# Tetris (TDD + GitHub Pages)

這個專案是一個純前端俄羅斯方塊遊戲，採用測試驅動開發（TDD）流程建置，並透過 GitHub Actions 自動部署到 GitHub Pages。

## 技術重點

- 遊戲核心邏輯：`src/core/game.js`
- 核心單元測試：`tests/game.test.js`
- 畫面與操作：`index.html`、`styles.css`、`src/main.js`、`src/ui/renderer.js`
- CI 測試流程：`.github/workflows/ci.yml`
- 自動部署 Pages：`.github/workflows/deploy-pages.yml`

## 本機開發（Vite）

```bash
npm ci
npm run dev
```

如果你只要跑測試：

```bash
npm test
```

如果你想要邊改邊跑測試：

```bash
npm run test:watch
```

## TDD 流程建議

每次新增功能時，維持以下循環：

1. 先在 `tests/` 寫失敗測試（Red）
2. 在 `src/core/game.js` 補最小可行實作（Green）
3. 重構並保持測試綠燈（Refactor）

## GitHub Pages 部署

本專案已提供 Actions workflow，當 `main` 分支有新 commit 時：

1. 安裝依賴並執行測試
2. 使用 Vite 打包產生 `dist/`
3. 上傳 `dist/` artifact
4. 部署到 GitHub Pages

第一次使用時，請到 GitHub repository 設定：

1. `Settings` -> `Pages`
2. `Build and deployment` 的 `Source` 選擇 `GitHub Actions`

部署完成後，網址會出現在 Actions 的 `deploy` job 環境輸出中。