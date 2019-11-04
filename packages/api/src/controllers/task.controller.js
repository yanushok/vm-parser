import shortid from 'shortid';
import { parser } from "@vm-parser/parser";
import * as store from "../services/store.service";

export const createTask = (req, res) => {
    const { code, debug, breakpoints } = req.body;
    const id = shortid.generate();
    const parserObj = parser(code, { debug, breakpoints });

    store.setTask(id, parserObj);

    try {
        parserObj.parse();
    } catch (err) {
        return res.status(400).json({ errors: err });
    }

    parserObj.interpret().then();
    res.status(200).json({ id });
};