import { Node } from './lib/node';
import Superviser from './lib/superviser';
import Commands from './lib/commands';

function codeParser(instructions = '') {
    const removeComments = cmd => cmd.split('#')[0];
    const removeEmptyStrings = cmd => cmd.trim() !== '';
    const trim = cmd => cmd.trim();

    // create object of function representation, name - function name, body - array of commands
    const parseFunction = funcText => {
        let [name, ...body] = funcText
            .split('\n')
            .map(removeComments)
            .filter(removeEmptyStrings)
            .map(trim);

        body = body.map((cmd, i) => new Node(cmd, i));

        return { name, body };
    };

    // spliting source code to functions
    let res = instructions
        .split('function')
        .slice(1)
        .map(parseFunction);

    // transform array to object, key - function name, value - array of commands
    res = res.reduce((prev, current) => {
        prev[current.name] = current.body;
        return prev;
    }, {});

    return res;
}

function parser(instructions = '') {
    const stack = new Superviser();
    const functions = codeParser(instructions);
    const commands = new Commands(stack, functions);

    function subscribe(fnName, handler) {
        commands.on(fnName, handler);
    }

    function interpret() {
        // subscribe('out', function (value) {
        //     console.log('out', value);
        // });

        // subscribe('finish', function (data) {
        //     console.log(data);
        // });

        // subscribe('ret', function (data) {
        //     console.log(data);
        // });

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                try {
                    subscribe('finish', function (data) {
                        resolve(data);
                    });

                    commands.call('main');
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    return {
        interpret,
        subscribe
    };
}

export { parser };