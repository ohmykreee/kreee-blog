# Blowfish 主题配置对比报告

- 对比方向：`themes/blowfish/config/_default/`（新模板，v3.0.0，大版本 breaking change）vs 项目 `config/_default/`（基于旧版 v2.1xx 模板 + 大量自定义）
- 结论概览：除 `languages.*.toml` 的两个键名更名外，v3 相对 v2 主要是**新增**设置项；设置项**删除**的只有 `article.showCategoryOnly` 一个。

## 一、文件级概览

| 文件 | 状态 |
|---|---|
| `hugo.toml` | 无设置项变更（仅默认值/注释差异，项目自定义均有效） |
| `markup.toml` | 新增 2 项（建议补齐） |
| `module.toml` | 无变化（双方均为空文件） |
| `languages.en.toml` / `languages.zh-cn.toml` | 2 个键名更名（需处理）+ author links 新增若干图标选项 |
| `menus.en.toml` / `menus.zh-cn.toml` | 结构无变化 |
| `params.toml` | 新增 20+ 项、删除 1 项、默认值调整若干 |

---

## 二、hugo.toml

无设置项增删。差异仅为模板注释状态与默认值：

| 键 | 项目值 | 新模板 | 说明 |
|---|---|---|---|
| `theme` / `baseURL` / `defaultContentLanguage` / `pluralizeListTitles` | 已启用 | 注释/`en` | 项目自定义，保持即可 |

---

## 三、markup.toml（主题要求项，建议补齐）

新模板在 `[goldmark]` 下新增：

```toml
[goldmark.parser]
  wrapStandAloneImageWithinParagraph = false

  [goldmark.parser.attribute]
    block = true
```

> 这两项是 v3 新增的必需配置，缺少时独立图片段落渲染与块级属性解析行为与 v3 预期不一致。其余（`renderer.unsafe`、passthrough、highlight、tableOfContents）双方一致。

---

## 四、languages.*.toml（唯一 breaking change 所在）

### ⚠️ 键名更名（v2.102.0 起，v3 沿用；Hugo 0.158+ 已弃用旧名）

| 旧键（项目现状） | 新键（模板） |
|---|---|
| `languageCode = "en"` / `"zh-cn"` | `locale = "en"` / `"zh-cn"` |
| `languageName = "English"` / `"简体中文"` | `label = "English"` / `"简体中文"` |

其余项目自定义（`weight`、`title`、`[params]` 下的 `logo`、`copyright`、`[params.author]`、`[params.homepage]` 等）v3 中全部继续有效，`[params.homepage].showMoreLinkDest` 按语言覆盖首页「更多」链接的方式仍可用。

### ➕ author links 新增可选图标（模板注释清单新增）

`github`、`github_gist`、`strava`、`untappd`、`printables`、`twitter`、`bluesky`（bluesky 旧模板已有）。项目如需展示这些社交链接可直接添加，无需改模板。

---

## 五、menus.*.toml

结构无变化。项目启用条目（Article/Status/Portfolio/About、footer Tags/Categories）与模板示例完全兼容。

---

## 六、params.toml（重点）

### ❌ 已删除设置项（唯一，需迁移）

| 项目现状 | v3 状态 |
|---|---|
| `[article] showCategoryOnly = true` | **已删除**（v2.102.0 起被取代），v3 布局不再读取它，保留无效 |

v3 替代方案（badge 分类展示控制，见 `layouts/partials/article-meta/basic.html`）：

```toml
[article]
  showTaxonomies = true                # 总开关（项目原为 false）
  showCategories = true                # 显示分类 badge
  showTags = false                     # 项目原来是"仅分类"，请关掉标签
  showCategoriesInSecondaryColor = false
```

### ➕ 新增设置项（模板有、项目无）

| 位置 | 设置项 | 说明 |
|---|---|---|
| 顶层 | `enableStructuredBreadcrumbs = false` | 结构化面包屑（schema.org） |
| 顶层 | `# enableStyledScrollbar`（注释，默认 true） | 自定义滚动条样式开关 |
| 顶层 | `# backgroundCanvas` | 将 `defaultBackgroundImage` 作为全站固定背景 |
| 顶层 | `hotlinkFeatureImage = false` | 文章图片直接外链不本地处理 |
| 顶层 | `# thumbnailAspectRatio`、`# imagePosition` | 缩略图宽高比与焦点位置 |
| 顶层 | `giteaDefaultServer` / `forgejoDefaultServer` | 模板由注释变为默认启用（默认指向 fsfe.org 等），不用可忽略 |
| `[languageRedirect]`（新区块） | `enabled`、`storageKey`、`# fallbackLanguage`、`browserRedirectHomeOnly`、`storedLanguageRedirect` | 多语言客户端重定向（本项目为多语言站，可选开启） |
| `[seo]`（新区块） | `# metaDescriptionOrder` | meta description 回退顺序 |
| `[header]` | `# mobileMenuStyle = "fullscreen"` | 移动端菜单样式（fullscreen/dropdown） |
| `[header]` | `layout` 新增合法值 `floating` | 悬浮式头部 |
| `[homepage]` | `# layoutSwitcher` | 内置布局交互预览（开发用） |
| `[homepage]` | `layout` 新增合法值 `landing` | 落地页布局 |
| `[article]` | `showReadingProgress = false` | 阅读进度条 |
| `[article]` | `showCategories` / `showTags` / `showCategoriesInSecondaryColor` | 取代 `showCategoryOnly` |
| `[article]` | `# externalLinkForceNewTab`（默认 true） | 外部链接新标签页开关 |
| `[list]` | `# featureImageHover` | 卡片缩略图悬停缩放 |
| `[taxonomy]` | `layoutBackgroundBlur` / `layoutBackgroundHeaderSpace` | 与 article/list 同款英雄区背景设置 |
| `[term]` | `layoutBackgroundBlur` / `layoutBackgroundHeaderSpace` | 同上 |
| `[buymeacoffee]` | `globalWidgetPosition` 默认值 `Right` → `right` | 大小写差异，无实际影响 |

### 🔄 仅默认值变化（项目已显式覆盖，无需改动）

`colorScheme`（blowfish→fire）、`enableCodeCopy`（false→true）、`[homepage]` 的 `layout`/`showRecent`/`showRecentItems`/`showMoreLink`/`cardView`、`[article]` 的 `showHero`/`heroStyle`（v3 默认 basic，项目 background 仍合法）/`invertPagination`/`showTableOfContents`/`showZenMode`、`[list]` 的 `showSummary`/`showCards`、`smartTOC`/`smartTOCHideUnfocusedChildren`/`highlightCurrentMenuArea`（模板改为注释，但 v3 布局仍在读取，项目显式启用不受影响）、`showComments`（模板已移除该行，但 `article-comments.html` 仍读取 `article.showComments`，项目 `showComments = true` 依然生效）。

### ✅ 项目自定义、v3 完全兼容

`disableImageOptimization`、`disableImageOptimizationMD`、`disableTextInHeader`、`fingerprintAlgorithm`、`[header] layout = "fixed"`、`[footer]`、`[homepage] homepageImage`、`[article]` 其余项、`[list]`、`[sitemap] excludedKinds`、`[taxonomy]`/`[term]` 已有项、全部 analytics/`[verification]`/`[rssnext]`/`[advertisement]` 区块。

---

## 七、建议操作清单

1. **必做**：`languages.en.toml` / `languages.zh-cn.toml` 中 `languageCode` → `locale`、`languageName` → `label`。
2. **建议**：`markup.toml` 补齐 `[goldmark.parser]` 两项。
3. **必做**：删除 `[article] showCategoryOnly`，按上文改为 `showTaxonomies = true` + `showTags = false`（保持"仅分类"效果）。
4. 可选：按需启用 `[languageRedirect]`、`showReadingProgress`、`showComments` 等新增项。
