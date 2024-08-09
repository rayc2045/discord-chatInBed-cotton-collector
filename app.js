import puppeteer from "puppeteer-core";
import fs from "node:fs";
import { thousandFormat, diffMinutes, delay } from "./utils.js";

(async () => {
  const browser = await puppeteer.launch({
      // executablePath: ""C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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
      headless: true,
      // devtools: true,
      // slowMo: 1200
    }),
    page = await browser.newPage();

  const 蓋棉被純聊天頻道 = "https://discord.com/channels/498209091773267968/",
    勞動賺棉花 = 蓋棉被純聊天頻道 + "909366297933000744",
    棉棉摸彩箱 = 蓋棉被純聊天頻道 + "1151829793654980639",
    棉棉夢工廠 = 蓋棉被純聊天頻道 + "1265665369826263172";

  const keywords = [
    { text: "+吸塵", revenu: 10, coolMinute: 30, area: 勞動賺棉花 },
    { text: "+拖地", revenu: 10, coolMinute: 30, area: 勞動賺棉花 },
    { text: "+點香氛", revenu: 10, coolMinute: 30, area: 勞動賺棉花 },
    { text: "+擦桌面", revenu: 20, coolMinute: 60, area: 勞動賺棉花 },
    { text: "+抹玻璃", revenu: 20, coolMinute: 60, area: 勞動賺棉花 },
    { text: "+洗廁所", revenu: 20, coolMinute: 60, area: 勞動賺棉花 },
    { text: "+換床單", revenu: 20, coolMinute: 60, area: 勞動賺棉花 },
    { text: "+整理衣櫃", revenu: 30, coolMinute: 120, area: 勞動賺棉花 },
    { text: "+歸納物品", revenu: 30, coolMinute: 120, area: 勞動賺棉花 },
    { text: "!摸摸彩", revenu: 8.3, coolMinute: 60, area: 棉棉摸彩箱 }, // ((200-50)/2 - 50) * 60 coolMinute/最長 3 小時冷卻時間
    // { text: "!做美夢", revenu: 100, coolMinute: 720, area: 棉棉夢工廠 }, // (800-200+1500-500)/2 * 50/100 - 300
  ];
  for (const keyword of keywords) keyword.times = keyword.lastTime = 0;
  /*
              30 /  30min
              80 /  60min
              60 / 120min
    [摸摸彩] -100 /  60min
    ––––––––––––––––––––––––––––––––––
    11.5 小時 => 30*23 + 80*11 + 60*5 - 100*11 => 770
    12   小時 => 30*24 + 80*12 + 60*6 - 100*12 => 840

    [做美夢] -800 / cooltime = 12hr = 720min
  */

  const sendText = async (text) => {
    const selector = "form [data-slate-node]";
    await page.waitForSelector(selector, { timeout: 0 });
    const textarea = await page.$(selector);
    await textarea.click();
    await textarea.type(text);
    await page.keyboard.press("Enter");
  };

  const updateLog = () => {
    const sum = keywords.reduce((acc, obj) => acc + obj.revenu * obj.times, 0),
      paragraph = [
        `棉花採集作業中... (≈${thousandFormat(Math.round(sum))})`,
        ...keywords
          .filter((keyword) => keyword.times > 0)
          .map((keyword) => `• ${keyword.text.slice(1)} x ${keyword.times}`),
      ].join("\n");
    console.clear();
    console.log(paragraph);
  };

  const startCollectingCotton = async () => {
    try {
      const startTime = new Date();

      const currHour = startTime.getHours(),
        lottery = keywords.find((keyword) => keyword.text.endsWith("摸彩"));
      if (currHour >= 3 && currHour < 8) {
        lottery.revenu = 25;
        lottery.coolMinute = 180;
      } else {
        lottery.revenu = 8.3;
        lottery.coolMinute = 60;
      }

      const unitsDigitOfMinute = String(startTime.getMinutes()).at(-1);
      if (unitsDigitOfMinute === "0" || unitsDigitOfMinute === "5") {
        for (let i = 0; i < keywords.length; i++) {
          const { text, coolMinute, lastTime, area } = keywords[i];
          if (diffMinutes(lastTime, new Date()) < coolMinute + 5) continue;

          const href = await page.evaluate(() => location.href);
          if (href !== area) await page.goto(area);

          await sendText(text);
          keywords[i].times++;
          if (i > 0 && coolMinute === keywords[i - 1].coolMinute)
            keywords[i].lastTime = keywords[i - 1].lastTime;
          else {
            keywords[i].lastTime = new Date();
            keywords[i].lastTime.setSeconds(0, 0);
          }
          updateLog();
          await delay(2);
        }
      }

      // 1 minute countdown
      const endTime = new Date();
      const nextMinute = new Date(startTime.getTime() + 60_000);
      nextMinute.setSeconds(0, 0);
      const delayTime = nextMinute - endTime;
      if (delayTime > 0) await delay(delayTime / 1000);
      await startCollectingCotton();
    } catch (err) {
      console.clear();
      console.log(err);
      console.log("\n等待恢復棉花採集作業...");
      await delay(15, startCollectingCotton);
    }
  };

  // login Discord
  await page.goto("https://discord.com/login");
  await page.waitForSelector("form", { timeout: 0 });
  const [email, password] = fs
      .readFileSync("login.txt", "utf8")
      .trim()
      .split("\n"),
    emailInput = await page.$("input[name='email']"),
    passwordInput = await page.$("input[name='password']"),
    loginButton = await page.$("button[type='submit']");
  await emailInput.type(email.trim());
  await passwordInput.type(password.trim());
  await loginButton.click();
  await startCollectingCotton();

  // // Locate the full title with a unique string.
  // const textSelector = await page
  //   .locator("text/Customize and automate")
  //   .waitHandle();
  // const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  // await browser.close();
})();
