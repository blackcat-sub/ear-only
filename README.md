[README.md](https://github.com/user-attachments/files/27312193/README.md)
# 耳朵only 👂

> 打开即听 · 无推荐 · 无干扰
>
> Open and listen. No recommendations. No distractions.

An ADHD-friendly personal audio player. Not a content platform — a sound tool.

一个为容易分心的人设计的私人声音播放器。不是内容平台，是声音工具。

---

## 为什么做这个？ Why this?

主流音乐App（QQ音乐、网易云、Spotify）的核心逻辑是**用推荐留住用户时长**。但对于一部分人来说（尤其是有ADHD倾向的用户），打开App想听歌 → 被推荐吸引 → 刷歌单 → 忘了自己本来要干嘛。

Mainstream music apps keep users engaged through recommendations. But for people with ADHD tendencies, opening an app to listen → getting distracted by recommendations → browsing playlists → forgetting what they originally wanted to do.

**耳朵only** 做的是减法：打开就是你的声音，没有推荐流、没有社交、没有排行榜。你来是为了**用**，不是为了**逛**。

---

## 核心理念：按精力分，不按场景分

### The Energy-Based Model

大部分音乐App按**场景**分内容（通勤、工作、睡前）。但对于ADHD用户，同一个场景下精力状态可能完全不同——早上通勤精力充沛能听深度播客，晚上通勤累了只想听白噪声。**场景一样，精力不同，需要的内容也不同。**

Most apps organize content by **scene** (commuting, working, sleeping). But for ADHD users, energy levels vary wildly within the same scene. **Same scene, different energy, different needs.**

耳朵only的核心维度是**信息密度**，按精力水平匹配内容：

| 精力水平 Energy | 信息密度 Density | 典型内容 Content |
|---|---|---|
| 🔴 高精力 High | 高密度 | 深度播客、有声书、学习内容 |
| 🟡 中精力 Mid | 中密度 | 轻播客、有歌词的音乐、聊天节目 |
| 🟢 低精力 Low | 低密度 | 纯音乐、Lo-fi、白噪声、自然声 |

---

## 核心功能 Core Features

### 1. 24小时精力曲线 Energy Timeline（已确定 ✅）

一条24小时时间轴，代表用户一天的**精力起伏**，而非场景切换。

- 用户在时间轴上拖拽画出自己的精力曲线
- 系统根据精力高低自动匹配对应密度的内容
- 例如：`7:00-9:00 高精力 → 深度播客` → `14:00-15:00 午后低谷 → 纯音乐` → `22:00 低精力 → 白噪声`
- 长期使用后，AI学习用户习惯，自动生成精力曲线（用户仍可随时手动覆盖）

### 2. 精力快速检测 Energy Check-in（已确定 ✅）

用户不一定能自我判断当前精力状态，尤其是ADHD用户。提供两种入口：

**快速模式：** 如果用户明确知道自己当前状态（比如"我现在很累"），直接选择精力档位，一键播放。

**辅助判断模式：** 通过3个简短问题帮助用户判断当前精力：

```
Q1: 你现在能集中注意力多久？
    → 30分钟以上 / 10-30分钟 / 几分钟都很难

Q2: 你现在想用脑还是放空？
    → 想学点东西 / 随便听听 / 什么都不想想

Q3: 你现在的情绪是？
    → 精力充沛 / 还行 / 很疲惫
```

根据回答自动匹配精力档位和内容。问题设计原则：**不超过3题，每题不超过3个选项，10秒内完成。**

### 3. 极简交互 Minimal Interface（已确定 ✅）

**设计哲学：苹果式的克制与聚焦。**

- 主界面只有两个核心元素：**一个大播放按钮** + **一个精力滑块**
- 没有搜索框、没有推荐流、没有社交入口、没有排行榜
- 打开即进入当前精力状态对应的内容，一键播放
- 减少决策点，缩短"想听 → 在听"的路径

### 4. 双内容源 Dual Content Source（已确定 ✅）

**本地模式（基础盘）：**
- 用户导入本地音乐文件
- 零版权压力，MVP阶段即可运行
- 支持音乐、播客、白噪声等任意音频文件

**外接模式（增强，实验性）：**
- 对接第三方音乐服务API（网易云、QQ音乐等）
- 参考项目：[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 等开源方案
- ⚠️ 非官方接口，随时可能失效，且商用有法律风险，定位为实验性功能

### 5. AI个性化 AI Personalization（规划中 🔧）

| 阶段 Phase | AI能力 | 说明 |
|---|---|---|
| 前期 Early | 内容分类 | 用户导入音频，AI按信息密度自动分类 |
| 中期 Mid | 精力预测 | 学习用户时间模式，自动生成精力曲线 |
| 后期 Late | 多信号融合 | 结合天气、日历、可穿戴设备等做智能匹配 |

AI模型：计划使用 Claude Opus 4.6/4.7 或 GPT-5.5 的API，需控制调用频率。

---

## ADHD友好设计原则 Design Principles

### 我们遵循的原则

1. **减少认知负荷（Cognitive Load）**：界面元素越少越好，每个屏幕只做一件事
2. **高对比度重点突出**：核心操作（播放按钮、精力滑块）视觉权重最高，其他元素退后
3. **Hick's Law**：选项越多，决策越难——严格限制每个界面的选项数量
4. **零装饰原则**：没有动画干扰、没有弹窗、没有Badge角标
5. **可预测的结构**：每次打开都是同样的布局，降低认知适应成本
6. **用户掌控**：所有自动化行为用户都能手动覆盖，AI建议而非AI决定

### 参考项目 References

- [awesome-adhd](https://github.com/XargsUK/awesome-adhd) — ADHD相关App、书籍和资源合集
- [Leantime](https://github.com/Leantime/leantime) — 为ADHD/自闭症/阅读障碍设计的开源项目管理工具，设计理念值得借鉴
- [Noise-Stimulant](https://github.com/teleoflexuous/Noise-Stimulant) — 开源噪声刺激工具，面向注意力问题用户
- [ADHDExec](https://github.com/lyndskg/ADHDExec) — Apple风格的ADHD执行助手，UI设计参考
- [UXPA: Designing for ADHD](https://uxpa.org/designing-for-adhd-in-ux/) — ADHD友好UX设计指南
- [Neurodiversity UX Resources](https://stephaniewalter.design/blog/neurodiversity-and-ux-essential-resources-for-cognitive-accessibility/) — 认知无障碍设计资源汇总

---

## 产品原则 Product Principles

- **打开即用**：启动后直接进入当前精力状态，一键播放
- **零干扰**：没有推荐算法、没有社交功能、没有排行榜、没有广告
- **用户掌控**：所有自动化行为用户都能手动覆盖
- **ADHD友好**：减少决策点，缩短"想听 → 在听"的路径
- **加功能前先问**：这会不会让用户分心？会就不加

---

## 技术规划 Tech Plan

### 技术栈（暂定）

- **前端**：React（当前原型已用React实现）
- **后端**：待定（Node.js / Python）
- **AI接入**：Anthropic API / OpenAI API
- **数据存储**：本地存储 + 云同步（待定）

### MVP路径

```
Phase 1 — 网页版验证核心体验
├── 本地音乐导入与播放
├── 精力档位选择（高/中/低）
├── 24小时精力时间轴
├── 精力快速检测（3问）
└── 极简播放界面（大按钮 + 精力滑块）

Phase 2 — AI接入
├── 音频按信息密度自动分类
├── 精力模式学习与自动切换
└── 用户习惯数据积累

Phase 3 — 多端扩展
├── 移动端App（最终形态）
├── 外接音乐源（实验性）
└── 可穿戴设备联动（远期）
```

### 为什么先做网页不做小程序？

小程序的音频后台播放有平台限制，网页端反而更自由，适合快速验证核心体验。

---

## 当前状态 Status

- [x] 产品方向确定
- [x] 核心交互原型完成（React组件，见 `ear-only-prototype.jsx`）
- [ ] 精力曲线时间轴（替代原型中的场景比例滑块）
- [ ] 精力快速检测流程
- [ ] 极简主界面重构（大按钮 + 精力滑块）
- [ ] 本地音乐导入功能
- [ ] 后端架构设计
- [ ] AI分类能力接入

---

## 项目结构 Structure

```
ear-only/
├── README.md                  ← 你在这里
├── ear-only-prototype.jsx     ← 交互原型（当前版本，待更新）
└── ...                        ← 待补充
```

---

## 参与开发 Contributing

目前项目处于早期阶段，核心方向已确定，具体实现细节开放讨论。

如果你要接手开发，请注意：
- **已确定的部分**（标 ✅ 的）是产品核心，改动前请先沟通
- **规划中的部分**（标 🔧 的）欢迎自由发挥
- 保持"减法"的产品理念——加功能前先问：**这会不会让用户分心？**

---

## License

待定
