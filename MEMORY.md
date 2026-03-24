# MEMORY.md - Long-term memory

*Created on 2026-03-18*

## First contact
- 2026-03-18: Initial conversation with user (Feishu direct message)
- User asked "你好吗" (How are you?) and "你能帮我干什么？" (What can you help with?)
- This is the first interaction, so need to establish identity and preferences.

## User requests
- 2026-03-19: User wants to create calendar event in Feishu Calendar for Friday 14:30 "年度总结会议" at "公司二楼大会议室". Currently Feishu calendar integration not available.
- 2026-03-19: User requested installation of two skills from ClawHub:
  - JimLiuxinghai/find-skills: Skill discovery and installation helper
  - gpyAngyoujun/multi-search-engine: Integration of 17 search engines for web crawling without API keys
  Both skills installed to C:\Users\Komorebi\.openclaw\extensions\
- 2026-03-19: User requested installation of skill from ClawHub: Jacky1n7/openclaw-tavily-search
  - Manual installation due to ClawHub CLI slug errors
  - Created directory: C:\Users\Komorebi\.openclaw\extensions\openclaw-tavily-search
  - Created SKILL.md and scripts/tavily_search.py
  - API key stored in ~/.openclaw/.env
- 2026-03-19: Re-installed find-skills skill manually after previous installation was missing
  - Created directory: C:\Users\Komorebi\.openclaw\extensions\find-skills
  - Created SKILL.md with content from ClawHub page
  - Skill helps discover and install skills from open agent skills ecosystem
- 2026-03-19: Installed skill-vetter security vetting protocol
  - Created directory: C:\Users\Komorebi\.openclaw\extensions\skill-vetter
  - Created SKILL.md with security-first vetting protocol
  - Skill provides security review guidelines for installing new skills
- 2026-03-19: User requested search for Midea brand water purifier product: P80弱碱净水器(MRC868-3000)
  - Used multi-search-engine via web_fetch with Baidu search
  - Found product information including specifications and features
  - User requested product introduction and details

## 2026-03-20
- User pointed out that the livestream script generated yesterday contained unverified data: "中国环境监测数据显示：一线城市家庭自来水，90%在入户后二次污染！"
- User emphasized that data must have authoritative sources and not be fabricated
- Assisted user in searching for official sources of water quality standards (GB 5749-2022 and CJJ/T 206-2020)
- Installed self-improving-agent skill from GitHub (peterskoett/self-improving-agent)
  - User confirmed installation after manual review of the skill content
  - Skill helps track learning and improvements in workspace

## 2026-03-21
- User requested creation of calendar event on March 23rd 10:00 AM: "与品牌沟通助播事项"
- User indicated calendar permissions have been granted, but direct calendar creation tools are not available in OpenClaw
- Offered alternatives: cron reminder, document memo, manual calendar entry
- User manually added the calendar event, but requested cron reminder (option A)
- OpenClaw cron encountered gateway connection issues
- Created Windows PowerShell ScheduledJob as fallback: "BrandCommunicationReminder" set for 2026-03-23 09:55:00 to send Feishu message reminder
- User reported message delivery delays on Feishu platform, causing duplicate questions - noted for future reference
- User asked if I know whether they are using computer or phone; I cannot determine this from Feishu interface but offered troubleshooting suggestions for message delays
- **Important security rule established**: Must use Skill Vetter to review any skill before installation, then confirm with user and obtain explicit installation permission before proceeding. This is now mandatory procedure.
- **Skill installation directory**: All new skills must be installed to `C:\Users\Komorebi\.openclaw\workspace\skills` (instead of extensions directory). Existing skills remain in extensions directory for now.## 2026-03-21
- **���ܰ�װĿ¼ƫ��**���û�ָ������Skill��װ�� \C:\Users\Komorebi\.openclaw\workspace\skills\ Ŀ¼������Ӱ��ʹ���������ѡ�
- **word-document-processor�ƶ�**���ѽ����ܴ�extensionsĿ¼�ƶ���workspace\skillsĿ¼��

- **excel-xlsx��װ**���ѳɹ���װivangdavila/excel-xlsx���ܵ�workspace\skillsĿ¼������Excel/XLSX�ļ�������


## 2026-03-24


## 2026-03-24
- 嘉之派直播方案：用户的话术学习项目
  - 位置：C:\Users\Komorebi\.openclaw\workspace\嘉之派直播方案
  - **分类规则：按品类分类**（非日期）
  - 新商品 → 自动创建新子文件夹（如 02_花胶）
  - 当前已收录：01_美的净水器（话术01分析已完成）