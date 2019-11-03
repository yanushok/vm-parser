import shortid from 'shortid';
import { parser } from "@vm-parser/parser";
import * as store from "../services/store.service";

export const createTask = (req, res) => {
    const { code, debug, breakpoints } = req.body;
    const parserObj = parser(code, { debug, breakpoints });
    const id = shortid.generate();

    store.setTask(id, parserObj);

    if (parserObj.hasError()) {
        const { error, errorString } = parserObj.getError();
        res.status(400).json({ error, errorString });
    } else {
        parserObj.interpret().then();
        res.status(200).json({ id });
    }
};