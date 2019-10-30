import { parser } from "@vm-parser/parser";

export const parseVmCode = (req, res) => {
    const parserObj = parser(req.body.instructions);
    let response = {};

    parserObj.subscribe('out', result => {
        response.out = result;
    });

    parserObj
        .interpret()
        .then(data => {
            response = {
                ...response,
                ...data
            };
            res.json(response);
        })
        .catch(e => console.log(e));
};