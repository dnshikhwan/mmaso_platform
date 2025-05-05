// src/helpers/scraper.helper.ts

import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export interface TimetableEntry {
  date: string;
  subject: string;
  time: string;
  instructor: string;
  room: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/114.0.0.0 Safari/537.36";

async function fetchPage(url: string): Promise<string> {
  // 1️⃣ Try axios with AJAX header
  try {
    const { data: htmlAjax } = await axios.get<string>(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "X-Requested-With": "XMLHttpRequest",
      },
      timeout: 10_000,
    });
    if (htmlAjax.includes('ul class="step mb-5"')) {
      console.log("🗂️  Got snippet via AJAX header");
      return htmlAjax;
    }
    console.log("ℹ️  AJAX header didn’t yield snippet");
  } catch (e: any) {
    console.warn("axios AJAX attempt failed:", e.message);
  }

  // 2️⃣ Try plain GET
  try {
    const { data: htmlRaw } = await axios.get<string>(url, {
      headers: { "User-Agent": USER_AGENT },
      timeout: 10_000,
    });
    if (htmlRaw.includes('ul class="step mb-5"')) {
      console.log("🗂️  Got snippet via plain GET");
      return htmlRaw;
    }
    console.log("ℹ️  Plain GET didn’t yield snippet");
  } catch (e: any) {
    console.warn("axios plain GET failed:", e.message);
  }

  // 3️⃣ Puppeteer fallback, intercepting the AJAX response
  console.log("⚙️  Falling back to Puppeteer…");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);

    let snippet = "";
    page.on("response", async (response) => {
      const req = response.request();
      const hdrs = req.headers();
      if (
        req.resourceType() === "xhr" &&
        req.url().startsWith(url) &&
        hdrs["x-requested-with"] === "XMLHttpRequest"
      ) {
        try {
          const text = await response.text();
          if (text.includes('ul class="step mb-5"')) {
            snippet = text;
            console.log("🗂️  Captured snippet via Puppeteer XHR interception");
          }
        } catch {}
      }
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });

    // wait a couple seconds for the XHR to fire
    await new Promise((r) => setTimeout(r, 2000));

    if (snippet) {
      return snippet;
    }
    console.warn(
      "⚠️  Puppeteer did not capture the AJAX snippet; falling back to full HTML"
    );
    return await page.content();
  } finally {
    await browser.close();
  }
}

export async function fetchTimetable(group: string): Promise<TimetableEntry[]> {
  const url =
    "https://mai.ru/education/studies/schedule/index.php?group=" +
    encodeURIComponent(group);

  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const schedule: TimetableEntry[] = [];
  $("ul.step.mb-5 > li.step-item").each((_, el) => {
    const $el = $(el);

    // Date
    let date = $el.find(".step-title").text().trim();
    date = date.replace(/\u00a0/g, " ");

    // Subject
    const subject = $el
      .find("p.fw-semi-bold.text-dark")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // Time / Instructor / Room
    const items = $el
      .find("ul.list-inline li.list-inline-item")
      .map((_, li) => $(li).text().replace(/\s+/g, " ").trim())
      .get();

    const [time = "", instructor = "", room = ""] = items;
    schedule.push({ date, subject, time, instructor, room });
  });

  console.log(`🗓  fetched ${schedule.length} entries for group "${group}"`);
  return schedule;
}
