import fs from "node:fs";

export function thousandFormat(num) {
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function diffMinutes(time1, time2) {
  return Math.floor(Math.abs(time1 - time2) / 1000 / 60);
}

export async function delay(ms, fn) {
  return new Promise((resolve) =>
    setTimeout(() => {
      fn && fn();
      resolve();
    }, ms),
  );
}

export async function login(page, account) {
  const [email, password] = fs
    .readFileSync(`accounts/${account}.txt`, "utf8")
    .split("\n")
    .map((text) => text.trim())
    .filter((text) => text.length);
  page.type(`input`, email);
  page.type(`input[name="password"]`, password);
  await page.click(`button[type="submit"]`);
}
