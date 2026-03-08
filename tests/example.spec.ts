import { test, BrowserContext, Page } from "@playwright/test";
import fs from "fs";
import jStat from "jstat";

test.setTimeout(0);

// TYPES
type Measurement = {
  from: string;
  to: string;
  time: number;
};

declare global {
  interface Window {
    __measurements: Measurement[];
    __pendingRouteMeasurement: { from: string; to: string } | null;
    __routeStart: number | null;
    router: any;
  }
}

// PERMUTATION
function permute(arr: string[]): string[][] {
  if (arr.length === 0) return [[]];

  const result: string[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = permute(rest);

    for (const p of perms) {
      result.push([arr[i], ...p]);
    }
  }

  return result;
}

// ROUTES
const baseRoutes = ["list", "analytics", "about"];

const baseSequences = permute(baseRoutes).map(seq => ["home", ...seq]);

function expandWithDetail(sequence: string[]) {
  const result: string[][] = [sequence];

  const listIndex = sequence.indexOf("list");

  if (listIndex !== -1) {
    const withDetail = [...sequence];
    withDetail.splice(listIndex + 1, 0, "detail");
    result.push(withDetail);
  }

  return result;
}

const allSequences = baseSequences.flatMap(expandWithDetail);

// STATS 
function groupByRoute(measurements: any[]) {
  const groups: Record<string, number[]> = {};

  for (const m of measurements) {
    const key = `${m.from}->${m.to}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(m.time);
  }

  return groups;
}

function calculateStats(measurements: any[]) {
  const groups = groupByRoute(measurements);

  const result = [];

  for (const route in groups) {
    const values = groups[route];
    const n = values.length;

    const mean = jStat.mean(values);

    let ci = 0;

    if (n > 1) {
      const sd = jStat.stdev(values, true); 

      const t = jStat.studentt.inv(0.975, n - 1);

      ci = t * (sd / Math.sqrt(n));
    }

    result.push({
      route,
      mean: Number(mean.toFixed(2)),
      ci: Number(ci.toFixed(2)),
      n
    });
  }

  const order = ["home", "list", "analytics", "about", "detail"];

  result.sort((a, b) => {
    const [aFrom] = a.route.split("->");
    const [bFrom] = b.route.split("->");

    return order.indexOf(aFrom) - order.indexOf(bFrom);
  });

  return result;
}

// TEST
test("measure realistic navigation flows", async ({ browser }) => {
  const RUNS_PER_SEQUENCE = 2;
  const rawResults: any[] = [];

  let sequenceCounter = 1;

  for (const sequence of allSequences) {
    const sequenceId = `S${sequenceCounter}`;
    const sequenceName = sequence.join("-");

    console.log(`Sequence ${sequenceId}: ${sequenceName}`);

    for (let run = 0; run < RUNS_PER_SEQUENCE; run++) {
      // fresh browser context for every run
      const context: BrowserContext = await browser.newContext();
      const page: Page = await context.newPage();

      await page.goto("/");

      await page.evaluate(() => {
        window.__measurements = [];
      });

      for (let i = 1; i < sequence.length; i++) {

        const next = sequence[i];

        await page.waitForTimeout(5000);

        const beforeCount = await page.evaluate(() => window.__measurements.length);

        if (next === "detail") {
          await page.evaluate(() => {
            return window.router.push("/detail/1");
          });
        } else {
          await page.click(
            `text=${next.charAt(0).toUpperCase() + next.slice(1)}`
          );
        }

        await page.waitForFunction(
          (prev) => window.__measurements.length > prev,
          beforeCount
        );
      }

      const results = await page.evaluate(() => window.__measurements);

      results.forEach((r: Measurement) => {
        rawResults.push({
          sequenceId,
          sequence: sequenceName,
          run: run + 1,
          from: r.from,
          to: r.to,
          time: r.time,
        });
      });

      await context.close();
    }

    sequenceCounter++;
  }

  // RAW CSV 
  const rawRows = rawResults
    .map(r => `${r.sequenceId};${r.sequence};${r.run};${r.from};${r.to};${r.time}`)
    .join("\n");

  const rawCsv = "sequenceId;sequence;run;from;to;time\n" + rawRows;

  // SUMMARY 
  const stats = calculateStats(rawResults);

  const statsRows = stats
    .map(s => `${s.route};${s.mean};${s.ci};${s.n}`)
    .join("\n");

  const statsCsv = "\n\nSUMMARY\nroute;mean;ci;n\n" + statsRows;

  // SAVE
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  const filename = `hybrid-results-${timestamp}.csv`;

  fs.writeFileSync(filename, rawCsv + statsCsv);

  console.log(`CSV saved as ${filename}`);
});