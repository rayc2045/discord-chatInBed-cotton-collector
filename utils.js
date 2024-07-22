export function thousandFormat(num) {
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function diffSeconds(time1, time2) {
  return Math.floor(Math.abs(time1 - time2) / 1000);
}

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
