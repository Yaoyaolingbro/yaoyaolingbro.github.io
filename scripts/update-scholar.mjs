import fs from "node:fs";
import https from "node:https";

const outputPath = "data/scholar.yml";
const profileUrl = "https://scholar.google.com/citations?user=wy0YRHUAAAAJ&hl=en";
const timeoutMs = 15000;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readExisting() {
  if (!fs.existsSync(outputPath)) return null;
  const text = fs.readFileSync(outputPath, "utf8");
  const metric = (name) => {
    const match = text.match(new RegExp(`${name}:\\s*(\\d+)`));
    return match ? Number(match[1]) : 0;
  };
  return {
    citations: metric("citations"),
    hIndex: metric("h_index"),
    i10Index: metric("i10_index")
  };
}

function parseMetrics(html) {
  const rows = [...html.matchAll(/<tr><td class="gsc_rsb_sc1">[\s\S]*?<\/tr>/g)];
  const metrics = {};
  for (const row of rows) {
    const labelMatch = row[0].match(/>(Citations|h-index|i10-index)<\/a>/);
    const values = [...row[0].matchAll(/<td class="gsc_rsb_std">(\d+)<\/td>/g)].map((match) => Number(match[1]));
    if (!labelMatch || values.length === 0) continue;
    metrics[labelMatch[1]] = values[0];
  }
  if (metrics.Citations == null || metrics["h-index"] == null || metrics["i10-index"] == null) {
    throw new Error("Could not parse Google Scholar metrics from the profile page.");
  }
  return {
    citations: metrics.Citations,
    hIndex: metrics["h-index"],
    i10Index: metrics["i10-index"]
  };
}

function renderYaml(metrics) {
  return [
    `profile_url: ${profileUrl}`,
    `updated_at: "${today()}"`,
    "metrics:",
    `  citations: ${metrics.citations}`,
    `  h_index: ${metrics.hIndex}`,
    `  i10_index: ${metrics.i10Index}`,
    ""
  ].join("\n");
}

function requestWithHttps(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"
      }
    }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        requestWithHttps(new URL(response.headers.location, url).toString()).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Google Scholar returned HTTP ${response.statusCode}`));
        return;
      }
      response.setEncoding("utf8");
      let html = "";
      response.on("data", (chunk) => {
        html += chunk;
      });
      response.on("end", () => resolve(html));
    });
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Google Scholar request timed out after ${timeoutMs}ms`));
    });
    request.on("error", reject);
  });
}

async function fetchScholarHtml() {
  let timeout;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(profileUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"
      }
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Google Scholar returned HTTP ${response.status}`);
    return response.text();
  } catch (error) {
    console.warn(`Fetch API failed, retrying with https: ${error.message}`);
    return requestWithHttps(profileUrl);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function main() {
  let metrics;
  try {
    metrics = parseMetrics(await fetchScholarHtml());
  } catch (error) {
    const existing = readExisting();
    if (!existing) throw error;
    metrics = existing;
    console.warn(`Keeping cached Scholar metrics: ${error.message}`);
  }
  fs.writeFileSync(outputPath, renderYaml(metrics));
  console.log(`Scholar metrics updated: citations=${metrics.citations}, h-index=${metrics.hIndex}, i10-index=${metrics.i10Index}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
