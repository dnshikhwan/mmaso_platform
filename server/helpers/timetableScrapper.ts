import puppeteer from "puppeteer";
import { logger } from "./log.helper";

// scrape timetable from website MAI
// required query params ?=group
const scrapeTimetable = async () => {
  try {
    puppeteer.launch().then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(
        "https://mai.ru/education/studies/schedule/index.php?group=%D0%9C3%D0%9E-308%D0%91%D0%BA%D0%B8-22#"
      );

      // await page.screenshot({ path: "timetable.png" });

      // const classes = await page.$$eval(
      //   "#step-item",
      //   function (className: string) {
      //     return className.;
      //   }
      // );

      // await browser.close();
    });
  } catch (err) {
    logger.error(err);
  }
};

export default scrapeTimetable;
