import { AptosTrekker } from ".";


const trekker = await AptosTrekker.init()

try {
    await trekker.start()
}
catch (e) {
    console.log("Something went wrong::", e)
}