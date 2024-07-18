import puppeteer from "puppeteer-core";
import { diffMinutes, delay } from "./utils.js";

(async () => {
  const browser = await puppeteer.launch({
      executablePath:
        "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      ignoreDefaultArgs: ["--enable-automation"],
      args: ["--incognito", "--window-size=1024,768"],
      defaultViewport: null,
      headless: false,
      // devtools: true,
      // slowMo: 1200
    }),
    page = await browser.newPage();

  const 蓋棉被純聊天頻道 = "https://discord.com/channels/498209091773267968/",
    勞動賺棉花區 = 蓋棉被純聊天頻道 + "909366297933000744",
    棉棉摸彩箱區 = 蓋棉被純聊天頻道 + "1151829793654980639";

  const keywords = [
    { text: "!摸彩", coolMinute: 25 },
    { text: "+吸塵", coolMinute: 30 },
    { text: "+拖地", coolMinute: 30 },
    { text: "+點香氛", coolMinute: 30 },
    { text: "+擦桌面", coolMinute: 60 },
    { text: "+抹玻璃", coolMinute: 60 },
    { text: "+洗廁所", coolMinute: 60 },
    { text: "+換床單", coolMinute: 60 },
    { text: "+整理衣櫃", coolMinute: 120 },
    { text: "+歸納物品", coolMinute: 120 },
  ];
  for (const keyword of keywords) keyword.times = 0;

  const sendText = async (text) => {
    const selector = "form [data-slate-node]";
    await page.waitForSelector(selector, { timeout: 0 });
    const textarea = await page.$(selector);
    await textarea.click();
    await textarea.type(text);
    await page.keyboard.press("Enter");
  };

  const updateLog = () => {
    console.clear();
    console.log(
      [
        "棉花採集作業中...",
        ...keywords.map(
          (keyword) => `• ${keyword.text.slice(1)} x ${keyword.times}`,
        ),
      ].join("\n"),
    );
  };

  const 開始賺棉花 = async () => {
    try {
      for (const keyword of keywords) {
        const { text, coolMinute, lastTime } = keyword;

        if (lastTime && diffMinutes(lastTime, new Date()) < coolMinute + 5)
          continue;

        const href = await page.evaluate(() => location.href);
        if (text.startsWith("!") && href !== 棉棉摸彩箱區) {
          await page.goto(棉棉摸彩箱區);
        } else if (text.startsWith("+") && href !== 勞動賺棉花區) {
          await page.goto(勞動賺棉花區);
        }

        await sendText(text);
        keyword.times++;
        keyword.lastTime = new Date();
        updateLog();
        await delay(2);
      }
      await delay(60, 開始賺棉花);
    } catch (err) {
      console.clear();
      console.log(err);
      console.log("\n等待恢復棉花採集作業...");
      await delay(15, 開始賺棉花);
    }
  };

  await page.goto(棉棉摸彩箱區);
  await 開始賺棉花();

  // // Locate the full title with a unique string.
  // const textSelector = await page
  //   .locator("text/Customize and automate")
  //   .waitHandle();
  // const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  // // Print the full title.

  // await browser.close();
})();
