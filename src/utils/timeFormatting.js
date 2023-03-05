import dayjs from "dayjs";

export function formatTime() {
  return dayjs().format("HH:mm:ss");
}

export function now() {
  return Date.now();
}
