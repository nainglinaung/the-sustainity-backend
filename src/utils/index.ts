// filepath: /typescript-node-project/typescript-node-project/src/utils/index.ts

export function log(message: string): void {
  console.log(`[LOG] ${message}`);
}

export function formatDate(date: Date, format: string): string {
  // Simple date formatting logic
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
