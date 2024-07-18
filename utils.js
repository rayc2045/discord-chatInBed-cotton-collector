export function diffMinutes(time1, time2) {
  return Math.floor(Math.abs(time1 - time2) / 1000 / 60);
}

export async function delay(sec, fn) {
  return new Promise((resolve) =>
    setTimeout(() => {
      fn && fn();
      resolve();
    }, sec * 1000),
  );
}
