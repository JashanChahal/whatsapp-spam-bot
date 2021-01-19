const puppeteer = require("puppeteer");
const TEXT_INPUT_FIELD = "#main > footer > div._3SvgF._1mHgA.copyable-area > div.DuUXI > div > div._1awRl.copyable-text.selectable-text"
const SMILEY = "#main > footer > div._3SvgF._1mHgA.copyable-area > div._3qpzV.rN1v9 > div.nw8RZ._1isZ2 > button._37evB._16P6V._2gB8p.hLiSc._3guyl > span"
const STICKER_ICON = " div._3qpzV.rN1v9 > div.nw8RZ._1isZ2._3c42S > button._37evB._16P6V._3x5p4._3guyl > span";

async function sendText(messageArr, destination) {
    { inputField, page } = destination;
    if (!!messageArr === false || !!inputField === false) {
        return;
    }
    for (let i = 0; i < messageArr.length; i++) {
        await inputField.type(messageArr[i]);
        await page.keyboard.press("Enter");
    }
}

async function whatsappBot(message) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://web.whatsapp.com");

    const element = !!message.isGroup ? "div" : "span";
    await page.waitForSelector(`${element} [title=\'${message.recepient}\']`);
    const target = await page.$(`${element} [title=\'${message.recepient}\']`);
    await target.click();

    let repeat = !!message.repeat ? message.repeat : 1;

    if (!!message.stickers) {
        const smiley = await page.$(SMILEY);
        await smiley.click();

        const stickerIcon = STICKER_ICON;
        await page.waitForSelector(stickerIcon);
        const stickerButton = await page.$(stickerIcon);
        await stickerButton.click();

        let k = 1;
        for (let i = 0; i < repeat; i++) {
            const sticker = `#main > footer > div._3pk0T > div > div:nth-child(3) > div._3Xjbn > div.s-vzs > div._3Z2oJ > div > div > div > div:nth-child(${k}) > div > img`;
            await page.waitForSelector(sticker);
            const dance = await page.$(sticker);
            await dance.click();
            k = (k) % 3 + 1;
        }
    } else if (!!message.text) {
        const inputField = await page.$(TEXT_INPUT_FIELD);
        const destination = {
            page,
            inputField
        }
        for (let i = 0; i < repeat; i++) {
            await sendText(message.text, destination);
        }

    }


}
let recepient = process.argv[2];
let isGroup = !!process.argv[3] ? (process.argv[3].toLowerCase() == "group") : false;
const message = {
    recepient,
    isGroup,
    stickers: false,
    text: ["hello", "Hi", "whatsup", "how are you"],
    repeat: 200
}
try {
    whatsappBot(message);
} catch (error) {
    console.log(error);
}
