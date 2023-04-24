declare global {
  namespace BuffBot {
    export type DayOfWeekStr = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
    export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
    export type HM = `${number}:${number}`;
  }
}

export {};
