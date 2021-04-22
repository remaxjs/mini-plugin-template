import { Page, Frame } from 'puppeteer';
import { setDefaultOptions } from 'expect-puppeteer/lib';

setDefaultOptions({ timeout: 1000 });
jest.setTimeout(20 * 1000);


const getFrame = (type, doc) => {
  if (type === 'page') {
    return doc.frames()[0];
  }

  return doc.childFrames()[0];
};

export const waitForFrame = (page, type = 'page') =>
  new Promise(resolve => {
    const checkFrame = () => {
      const frame = getFrame(type, page);
      if (frame) {
        resolve(frame);
        return;
      }

      if (type === 'frame') {
        setTimeout(checkFrame);
      } else {
        page.once(`frameattached`, checkFrame);
      }
    };
    checkFrame();
  });

export const openPage = (url) => {
  const pageQuery = encodeURIComponent(url.replace(/^\//, ''));
  return page.goto(
    `http://river.alipay.net/appx.html?page=${pageQuery}&launchParams=%7B"enableTabBar"%3A"YES"%7D&url=http://localhost:8888/`
  );
};

export const launchApp = async (url) => {
  await openPage(url);
  const simulartorFrame = await waitForFrame(page);
  return waitForFrame(simulartorFrame, 'frame');
};

export const delay = (time = 100) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
