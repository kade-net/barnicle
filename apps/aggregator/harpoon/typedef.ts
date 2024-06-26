import { readFile, readFileSync } from "fs"
import path from "path"


const getDef = () => {
    const schema = readFileSync(path.join("./harpoon/schema.graphql"), "utf-8")

    return `#graphql
        ${schema}`
}

const TypeDef = getDef()

export default TypeDef