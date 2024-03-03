import puppeteer from 'puppeteer-core';
import { exec } from "child_process";

export async function pup(o){
  console.log('[Pup]');

  // function findChromium() {
  //   return new Promise((res, rej) => {
  //     exec("nix eval nixpkgs.chromium.outPath --raw", (error, stdout, stderr) => {
  //       if (error) rej(error.message);
  //       else if (stderr) rej(stderr);
  //       else res(`${stdout}/bin/chromium`);
  //     });
  //   });
  // }
  // const chrome = await findChromium();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/x205pbkd5xh5g4iv0g58xjla55has3cx-chromium-108.0.5359.94/bin/chromium-browser',//chrome,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const web = await browser.newPage();
  await web.goTo(o.url);

  console.log(browser)

  // const titles = await page.$$eval('.storylink', links => links.slice(0, 5));
  return web.content();
}