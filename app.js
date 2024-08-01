import puppeteer from "puppeteer-core";
import { thousandFormat, diffMinutes, delay } from "./utils.js";

(async () => {
  const browser = await puppeteer.launch({
      // executablePath: "/Applications/Firefox.app/Contents/MacOS/firefox",
      // executablePath: "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox",
      // product: "firefox",
      // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      // executablePath: "/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta",
      // executablePath: "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      // executablePath: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      // executablePath: "/Applications/Microsoft Edge Beta.app/Contents/MacOS/Microsoft Edge Beta",
      // executablePath: "/Applications/Microsoft Edge Dev.app/Contents/MacOS/Microsoft Edge Dev",
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
    { text: "+吸塵", number: 10, coolMinute: 30, area: 勞動賺棉花區 },
    { text: "+拖地", number: 10, coolMinute: 30, area: 勞動賺棉花區 },
    { text: "+點香氛", number: 10, coolMinute: 30, area: 勞動賺棉花區 },
    { text: "+擦桌面", number: 20, coolMinute: 60, area: 勞動賺棉花區 },
    { text: "+抹玻璃", number: 20, coolMinute: 60, area: 勞動賺棉花區 },
    { text: "+洗廁所", number: 20, coolMinute: 60, area: 勞動賺棉花區 },
    { text: "+換床單", number: 20, coolMinute: 60, area: 勞動賺棉花區 },
    { text: "+整理衣櫃", number: 30, coolMinute: 120, area: 勞動賺棉花區 },
    { text: "+歸納物品", number: 30, coolMinute: 120, area: 勞動賺棉花區 },
    { text: "!摸摸彩", number: 75, coolMinute: 120, area: 棉棉摸彩箱區 },
  ];
  for (const keyword of keywords) keyword.times = keyword.lastTime = 0;

  const sendText = async (text) => {
    const selector = "form [data-slate-node]";
    await page.waitForSelector(selector, { timeout: 0 });
    const textarea = await page.$(selector);
    await textarea.click();
    await textarea.type(text);
    await page.keyboard.press("Enter");
  };

  const updateLog = () => {
    const sum = keywords.reduce((acc, obj) => acc + obj.number * obj.times, 0),
      paragraph = [
        `棉花採集作業中... (≈${thousandFormat(sum)})`,
        ...keywords
          .filter((keyword) => keyword.times > 0)
          .map((keyword) => `• ${keyword.text.slice(1)} x ${keyword.times}`),
      ].join("\n");
    console.clear();
    console.log(paragraph);
  };

  const startCollectingCotton = async () => {
    try {
      const startTime = new Date(),
        unitsDigitOfMinute = String(startTime.getMinutes()).at(-1);

      if (unitsDigitOfMinute === "0" || unitsDigitOfMinute === "5") {
        for (const keyword of keywords) {
          const { text, coolMinute, lastTime, area } = keyword;
          if (diffMinutes(lastTime, new Date()) < coolMinute + 5) continue;

          const href = await page.evaluate(() => location.href);
          if (href !== area) await page.goto(area);

          await sendText(text);
          keyword.times++;
          keyword.lastTime = new Date();
          keyword.lastTime.setSeconds(0, 0);
          updateLog();
          await delay(2);
        }
      }

      const endTime = new Date();
      const nextMinute = new Date(startTime.getTime() + 60_000);
      nextMinute.setSeconds(0, 0);
      const delayTime = nextMinute - endTime;
      if (delayTime > 0) await delay(delayTime / 1000);
      startCollectingCotton();
    } catch (err) {
      console.clear();
      console.log(err);
      console.log("\n等待恢復棉花採集作業...");
      await delay(15, startCollectingCotton);
    }
  };

  await page.goto(keywords[0].area);
  await startCollectingCotton();

  // // Locate the full title with a unique string.
  // const textSelector = await page
  //   .locator("text/Customize and automate")
  //   .waitHandle();
  // const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  // // Print the full title.

  // await browser.close();
})();
