import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { protos } from "@google-analytics/data";

type ReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse;

function getClient() {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) return null;
  try {
    return new BetaAnalyticsDataClient({ credentials: JSON.parse(raw) });
  } catch {
    return null;
  }
}

const property = () => `properties/${process.env.GA_PROPERTY_ID}`;

export type TopRow = { label: string; count: number };

function toRows(response: ReportResponse): TopRow[] {
  return (response.rows ?? []).map((r) => ({
    label: r.dimensionValues?.[0]?.value ?? "—",
    count: Number(r.metricValues?.[0]?.value ?? 0),
  }));
}

function metricVal(response: ReportResponse, index: number): number {
  return Number(response.rows?.[0]?.metricValues?.[index]?.value ?? 0);
}

export async function getGAOverview(days = 30) {
  const client = getClient();
  if (!client) return null;

  const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

  const run = (params: Parameters<typeof client.runReport>[0]) =>
    client.runReport(params).then((r) => r as unknown as ReportResponse);

  const [overview, pages, countries, sources, devices] = await Promise.all([
    run({
      property: property(),
      dateRanges: [dateRange],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "bounceRate" },
      ],
    }),
    run({
      property: property(),
      dateRanges: [dateRange],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 8,
    }),
    run({
      property: property(),
      dateRanges: [dateRange],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 8,
    }),
    run({
      property: property(),
      dateRanges: [dateRange],
      dimensions: [{ name: "sessionSource" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 6,
    }),
    run({
      property: property(),
      dateRanges: [dateRange],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }),
  ]);

  return {
    users: metricVal(overview, 0),
    pageViews: metricVal(overview, 1),
    sessions: metricVal(overview, 2),
    bounceRate: Math.round(metricVal(overview, 3) * 100),
    topPages: toRows(pages),
    topCountries: toRows(countries),
    topSources: toRows(sources),
    topDevices: toRows(devices),
  };
}
