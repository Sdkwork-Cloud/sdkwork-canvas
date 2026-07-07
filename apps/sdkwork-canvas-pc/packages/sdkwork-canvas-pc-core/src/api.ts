import { Note, AIActionType, AIGenerateType } from "./types";
import { uuid } from "@sdkwork/utils";

export const AIClient = {
  async generateText(prompt: string, type: AIGenerateType): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `This is a generated draft for your request:\n\n**${prompt}**\n\nThe AI assistant generated this temporary ${type} content to demonstrate the frontend workflow. Once the backend SDK is integrated, this text will be replaced by real AI output.`,
        );
      }, 1500);
    });
  },

  async editText(text: string, action: AIActionType): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Here is the edited text (${action}):\n\n${text}\n\n(This is a mock response)`,
        );
      }, 1000);
    });
  },
};

export const defaultNotes: Note[] = [
  {
    id: "coll-whispering-gears",
    title: "The Whispering Gears (蒸汽与齿轮之歌)",
    content: `## 《蒸汽与齿轮之歌》合集专栏总括\n\n> **题材：** 蒸汽朋克 / 科幻惊悚 / 维多利亚架空历史\n> **作者：** A. G. Wells\n> **大纲设定：** 在由庞大钟表发条支柱撑起的维多利亚式高空城市群中，年轻的机械师 Silas Vane 偶然听到了一个秘密的发条震动，该信号预示着上层星区即将发生的倾覆。他必须在午夜之前，对齐中央调节器的振幅，否则整个城市的心跳将彻底停摆。\n\n### 📖 合集操作指南：\n- 本页面为**合集主页面（总纲说明）**，您可以通过在上面直接打字编辑来记录整本书籍的世界观、细纲和创作构想。\n- 在左侧栏 **“分卷合集 / Collections”** 列表中，点击本合集左侧箭头即可**展开/合拢**它包含的所有具体子章节。\n- 点击本合集旁的 **“+” 按钮** 可直接快速在合集内插入全新一章。\n- 选中章节后可在主画布使用最标准的富文本编辑器以及右侧的 **AI 助手** 进行高效率扩写润色！`,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000,
    tags: ["Series", "Steampunk", "Novel"],
    coverUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    isCollection: true
  },
  {
    id: "ch-brass",
    parentId: "coll-whispering-gears",
    title: "第一章：黄铜的振音 (Chapter 1: The Pitch of Brass)",
    content: `## 第一章：黄铜的振音\n\n第七号主轴的重低音蜂鸣从未彻底安静过，但今晚，它夹杂着一种塞拉斯·韦恩（Silas Vane）从未听过的机械震颤。\n\n塞拉斯把定制的黄铜听诊器紧贴在冰冷的铁质外壳上，闭上双眼，任由共鸣充盈耳廓。在他所处的位置——第四区主矿坑，一共精准运行着十二条关键的齿轮传输链。如果七号主轴以 240 赫兹平稳振动，则万事顺遂。但此刻，指针却在剧烈摆动。一种奇特的模式：四声清脆的高频击打，随后是一次粗暴、支离破碎的低音滑音。\n\n“它在哭。” 身边传来一个声音。\n\n塞拉斯不用睁眼也知道是谁。莉拉·索恩（Lyra Thorne），她沾满煤灰和润滑油的脸上，正映射着压力表绿色偏振光。她把那把沉重的万能扳手重重甩在钢板甲板上，用沾着油污的袖子蹭了蹭额角。\n\n“它不是在哭，莉拉。” 塞拉斯低声说，转动着计量器的微调旋钮。“这是振动衰退。60米差速飞轮上的摩擦齿又在打滑了。”\n\n“如果这件事让斯特林监理官知道，” 莉拉靠在一根滚烫的蒸汽主管线旁说，“他会立刻封锁第四星区。他会宣称我们的产出不达标，将蒸汽量削减一半。”\n\n塞拉斯不禁打了个冷战。削减蒸汽量等同于第四区绝对的寒冬。那意味着三万名居住在暗无天日地底的矿工将没有暖气、没有源源不断的空气净化阀门。这是一场被官方层层包装在‘不合规淘汰条例’下的缓刑宣判。\n\n“我们绝不能让他知道，” 塞拉斯语调坚决。“我们自己修。把主调节铁锤递给我。”\n\n* * *\n\n### 💡 AI 创作建议：\n- *您可以双击选中正文文字，使用选区气泡工具，或一键唤起右侧的 **“AI 助手”** 帮助 Silas 和 Lyra 续写下一幕的惊险排故剧情！*`,
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
    tags: ["Chapter", "FirstDraft"]
  },
  {
    id: "ch-regulator",
    parentId: "coll-whispering-gears",
    title: "第二章：冷酷的监管者 (Chapter 2: The Grand Regulator)",
    content: `## 第二章：冷酷的监管者\n\n斯特林男爵（Baron Sterling）的黄铜马靴永远纤尘不染，在充满煤灰和液压漏油的低层矿区，这本身就是个工程奇迹。\n\n他站在高耸的悬空观察平台上，俯瞰着整片弥漫着白气、仿若怪兽食道的第四蒸汽管区。在他的身后，两台半人半齿轮的机械哨兵正以绝对对称、机械的节律站立着，抛光的紫铜表壳闪闪发亮，齿轮呼吸阀里喷射出一股股带着润滑脂气味的蒸汽。\n\n“数据是不会骗人的，” 斯特林开口，声调不带一点起伏，干涸冷酷得像磨砂纸划过松木板。“高等评议会要求绝对的齿轮平衡。如果第四区由于人工效能低下无法维持核心转速，为了维护高尚的璀璨城主塔，我们只能切断这里的热源输送。”\n\n“可……可是阁下，” 他的记录秘书颤抖着翻阅手里的羊皮纸法案，“第四区单是登记在册的自由雇工就有三万四千人。在这个冬至日一旦关闭暖阀，下层矿区将在四十八小时内面临大范围冻伤崩溃。”\n\n斯特林缓缓转过身去。他那只镶嵌着象牙齿轮、以微电极直接连接视觉系统的黄铜偏光假眼发出一连串冷冰冰的对焦声。\n\n“一座城市就是一台引擎，芬奇先生。” 斯特林柔和地摩擦着手杖。“当一颗活塞无法维持额定滑升效率时，任何人都不该为了油脂的损耗而流泪。不合格的零件，只有报废这一条道路。去在午夜前把第四阀门锁定吧。”`,
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4,
    tags: ["Chapter", "Finished"]
  },
  {
    id: "ch-flight",
    parentId: "coll-whispering-gears",
    title: "第三章：飞艇出逃 (Chapter 3: Smuggler's Flight)",
    content: `## 第三章：飞艇出逃\n\n莉拉的轻型飞艇 “铁燕号” 与其说是一艘主权飞艇，不如说是一只临时焊上了锅炉骨架、用油纸糊制的动力风筝。\n\n他们踩上海绵状质地的简易胶木甲板，牢牢抓住挂钩索。飞艇在剧烈颠簸的气流中左右打摆，越过两根擎天重工发条支柱之间的深邃狭谷。在不远处的迷雾深处，四名蒸汽宪兵的巡逻艇正亮着刺眼的探照偏光，亮绿色的光圈像几柄长矛一样在夜幕里疯狂横扫。\n\n“他们咬住我们的气尾了！” 塞拉斯在大风中向驾驶区大喊。\n\n“那是冷凝水蒸汽！不是我们本人！” 莉拉一边用脚狠踩舵机拨片控制左翼，一边用力拉下阀门，“给锅炉火箱继续添煤，塞拉斯！我们需要额外的十磅气压，否则飞艇会在过六号支柱时，直接被其引风风扇的气旋绞得粉碎！”`,
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 3,
    tags: ["Chapter", "FirstDraft"]
  },
  {
    id: "seed-note-1",
    title: "🚀 欢迎使用智能「合集/专栏」多页签工作台",
    content: `## 欢迎使用大至简的 Notes 笔记与合集平台！\n\n为了给您提供最优、最符合直觉的优质写作环境，我们移除了旧版突兀繁杂的 “小说书籍模式”，将其凝练落地为更加自然的 **「合集/专栏」层级文件夹树** 架构！\n\n### 🌟 新版核心优势（大道至简）：\n\n1. **极简直接（Zero Overhead）：** 告别了“小说大纲、角色卡、仪表盘 tabs”等令人头晕的繁缩后台。合集和章节现在与普通笔记**完美共享同样的 Tiptap 富文本编辑器**！不管是写单篇日记、周报，还是写多卷小说，开启即写！\n2. ** sidebar 合集树（Tree Explorer）：** 侧边栏完美拆分为 “自由单篇” 和 “分卷合集” 双页签。\n   - **自由单篇：** 列出所有无层级的普通日记与灵感草稿。\n   - **分卷合集：** 文件夹式折叠。点击合集可展开所属各章节；直接拖放、或通过章节卡片上的微动键对章节进行上下排序，秩序井然。\n3. **自由添加（Add Chapters Locally）：** 在 Collection 列表项上，通过点击 “+” 按钮可一秒钟生成合集内页章节，立即双向锚定，省时高效。\n4. **无损转换与干净编辑器：** 没有了喧宾夺主的框架遮挡，给您最纯白干净的屏前视野。`,
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 300000,
    tags: ["QuickStart", "Guide"]
  }
];

export const NoteService = {
  async getNotes(): Promise<Note[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const saved = localStorage.getItem("sdkwork-canvas-data");
          if (saved) {
            resolve(JSON.parse(saved));
          } else {
            // Seed default canvas
            localStorage.setItem("sdkwork-canvas-data", JSON.stringify(defaultNotes));
            resolve(defaultNotes);
          }
        } catch {
          resolve(defaultNotes);
        }
      }, 300); // simulate network latency
    });
  },

  async createNote(initialData?: Partial<Note>): Promise<Note> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNote: Note = {
          id: uuid(),
          title: initialData?.title || "Untitled Note",
          content: initialData?.content || "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: initialData?.tags || [],
          isCollection: initialData?.isCollection,
          parentId: initialData?.parentId,
        };
        // We do not manage the list state here, just return the created note structure.
        // Real implementation would save to DB.
        resolve(newNote);
      }, 200);
    });
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          title: updates.title || "",
          content: updates.content || "",
          createdAt: Date.now(), // dummy fallback
          updatedAt: Date.now(),
          tags: updates.tags || [],
          ...updates,
        });
      }, 200);
    });
  },

  async deleteNote(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // simulate successful deletion
      }, 200);
    });
  },
};
