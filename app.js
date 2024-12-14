import puppeteer from "puppeteer-core";
import { thousandFormat, diffMinutes, delay, login } from "./utils.js";

const { clear, log } = console;

const 蓋棉被純聊天頻道 = "https://discord.com/channels/498209091773267968/",
  勞動賺棉花 = 蓋棉被純聊天頻道 + "909366297933000744",
  棉棉摸彩箱 = 蓋棉被純聊天頻道 + "1151829793654980639",
  棉棉夢工廠 = 蓋棉被純聊天頻道 + "1265665369826263172",
  commands = [
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
for (const command of commands) command.times = command.lastTime = 0;
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
const updateLog = () => {
  const sum = commands.reduce((acc, obj) => acc + obj.revenu * obj.times, 0),
    paragraph = [
      `棉花採集作業中... (≈${thousandFormat(Math.round(sum))})`,
      ...commands
        .filter((command) => command.times > 0)
        .map((command) => `• ${command.text.slice(1)} x ${command.times}`),
    ].join("\n");
  clear();
  log(paragraph);
};

const startCollectingCotton = async () => {
  const browser = await puppeteer.launch({
      // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      // executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
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
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized", "--mute-audio"],
    }),
    page = await browser.newPage();

  await page.goto(commands[0].area, { waitUntil: "networkidle2" });
  if (await page.$(`input[type="password"]`)) await login(page, "Discord");

  const sendText = async (text) => {
      const inputSelector = "form [data-slate-node]";
      await page.waitForSelector(inputSelector);
      const textarea = await page.$(inputSelector);
      await textarea.click();
      await textarea.type(text);
      await page.keyboard.press("Enter");
    },
    collectCotton = async () => {
      try {
        const startTime = new Date();

        // reset revenu and cool time value
        const hour = startTime.getHours(),
          lottery = commands.find((command) => command.text.endsWith("摸彩"));
        if (hour >= 3 && hour < 8) {
          lottery.revenu = 25;
          lottery.coolMinute = 180;
        } else {
          lottery.revenu = 8.3;
          lottery.coolMinute = 60;
        }

        const endOfMinute = startTime.getMinutes().toString().slice(-1);
        if (endOfMinute === "0" || endOfMinute === "5") {
          // send commands
          for (let i = 0; i < commands.length; i++) {
            const { text, coolMinute, lastTime, area } = commands[i];
            if (diffMinutes(lastTime, new Date()) < coolMinute + 5) continue;
            await page.goto(area, { waitUntil: "networkidle2" });
            await sendText(text);
            commands[i].times++;
            if (i > 0 && coolMinute === commands[i - 1].coolMinute)
              commands[i].lastTime = commands[i - 1].lastTime;
            else {
              commands[i].lastTime = new Date();
              commands[i].lastTime.setSeconds(0, 0);
            }
            updateLog();
            if (i < commands.length - 1) await delay(2000);
          }

          // search from ID
          const editorContainer = await page.$(".DraftEditor-editorContainer");
          await editorContainer.click();
          const fromSelector = `[aria-label="從: 使用者"]`;
          await page.waitForSelector(fromSelector, { visible: true });
          await page.click(fromSelector);
          await editorContainer.type("your-discord-id");
          await page.keyboard.press("Enter");
          // delete all command messages on the first page
          const commandText = commands.map((command) => command.text);
          const resultSelector = `li[id^="search-results"]`;
          await page.waitForSelector(resultSelector);
          const searchResults = await page.$$(resultSelector);
          for (result of searchResults) {
            const content = await result.evaluate(
              (el) =>
                el.querySelector(`div[id^="message-content"] > span`)
                  .textContent,
            );
            if (commandText.includes(content)) {
              await result.click({ button: "right" });
              const deleteSelector = "#message-delete";
              await page.waitForSelector(deleteSelector, { visible: true });
              await page.keyboard.down("Shift");
              await page.click(deleteSelector);
              await page.keyboard.up("Shift");
            }
          }
          await page.click(`div[aria-label="清除搜尋"]`);
        }

        // 1 minute countdown
        const endTime = new Date();
        const nextMinute = new Date(startTime.getTime() + 60_000);
        nextMinute.setSeconds(0, 0);
        const delayTime = nextMinute - endTime;
        if (delayTime > 0) await delay(delayTime);
      } catch (err) {
        clear();
        log(err);
        log("\n等待恢復棉花採集作業...");
        await delay(30_000);
        await startCollectingCotton();
      }
    };
  await collectCotton();
};
await startCollectingCotton();
