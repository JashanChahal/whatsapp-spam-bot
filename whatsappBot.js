const puppeteer = require("puppeteer");

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
        const smily = await page.$("#main > footer > div._3SvgF._1mHgA.copyable-area > div._3qpzV.rN1v9 > div.nw8RZ._1isZ2 > button._37evB._16P6V._2gB8p.hLiSc._3guyl > span");
        await smily.click();

        const stickerSpan = " div._3qpzV.rN1v9 > div.nw8RZ._1isZ2._3c42S > button._37evB._16P6V._3x5p4._3guyl > span"
        await page.waitForSelector(stickerSpan);
        const stickerButton = await page.$(stickerSpan);
        await stickerButton.click();

        let k = 1;
        for (let i = 0; i < repeat; i++) {
            const st = `#main > footer > div._3pk0T > div > div:nth-child(3) > div._3Xjbn > div.s-vzs > div._3Z2oJ > div > div > div > div:nth-child(${k}) > div > img`;
            await page.waitForSelector(st);
            const dance = await page.$(st);
            await dance.click();
            k = (k) % 3 + 1;
        }
    } else if (!!message.text) {
        const imp = await page.$("#main > footer > div._3SvgF._1mHgA.copyable-area > div.DuUXI > div > div._1awRl.copyable-text.selectable-text")
        let text = !!message.text ? message.text : [];
        for (let i = 0; i < repeat; i++) {
            for (let j = 0; j < text.length; j++) {
                await imp.type(text[j]);
                await page.keyboard.press("Enter");
            }
        }

    }


}

const message = {
    recepient: "Chirag NITJ CSE",
    isGroup: true,
    stickers: false,
    text: ["hahaha", "hey", "Hi", "whatsup", "how are you"],
    repeat: 20
}
try {
    whatsappBot(message);
} catch (error) {
    console.log(error);
}
