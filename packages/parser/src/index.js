// import EventEmitter from 'events';
// import Node from './lib/node';
// import Superviser from './lib/superviser';
// import Commands from './lib/commands';
// import { pipe, map, trim, split, filter, reduce, head, last } from "lodash/fp";

// function codeParser(instructions = '') {
//     // const removeComments = cmd => cmd.split('#')[0];
//     // const removeEmptyStrings = cmd => cmd.trim() !== '';
//     // const trim = cmd => cmd.trim();

//     // create object of function representation, name - function name, body - array of commands
//     const parseFunction = funcText => {
//         let [name, ...body] = funcText
//             .split('\n')
//             .map(removeComments)
//             .filter(removeEmptyStrings)
//             .map(trim);

//         body = body.map((cmd, i) => new Node(cmd, i));

//         return { name, body };
//     };

//     function createTuples(instructions) {
//         let numberOfString = 1;

//         return pipe(
//             split('\n'),
//             map(pipe(
//                 split('#'),
//                 head,
//                 trim,
//                 str => [numberOfString++, str],
//             )),
//             filter(last),
//             reduce((acc, [number, command]) => {
//                 if (command.includes('function')) {
//                     acc.push([command.split(' ').pop()]);
//                 } else {
//                     const len = acc.length;
//                     acc[len - 1].push([number, command]);
//                 }

//                 return acc;
//             }, []),
//             reduce((acc, [functionName, ...commands]) => {
//                 acc[functionName] = commands.map(([numOfString, cmdString], i) => [numOfString, new Node(cmdString, i, numOfString)]);
//                 return acc;
//             }, {})
//         )(instructions);
//     }

//     let res = createTuples(instructions);

//     // Object.keys(res).forEach(key => {
//     //     console.log(key);
//     //     console.log(res[key]);
//     // });
//     // process.exit(0);

//     // spliting source code to functions
//     // let res = instructions
//     //     .split('function')
//     //     .slice(1)
//     //     .map(parseFunction);

//     // console.log(res);

//     // // transform array to object, key - function name, value - array of commands
//     // res = res.reduce((prev, current) => {
//     //     prev[current.name] = current.body;
//     //     return prev;
//     // }, {});

//     // console.log(res);

//     return res;
// }

// function parser(instructions = '', debug = false, breakpoints = null) {
//     const emitter = new EventEmitter();
//     const stack = new Superviser();

//     function subscribe(...args) {
//         // commands.on(...args);
//         emitter.on(...args);
//     }

//     function emit(...args) {
//         // commands.emit(...args);
//         emitter.emit(...args);
//     }

//     function next() {
//         emit('next');
//     }

//     function interpret() {
//         return new Promise((resolve, reject) => {
//             setImmediate(() => {
//                 try {
//                     const functions = codeParser(instructions);
//                     const commands = new Commands(stack, functions, emitter, { debug, breakpoints });

//                     subscribe('finish', function (data) {
//                         resolve(data);
//                     });

//                     commands.call('main').then(() => console.log('MAIN CALLED'));
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//         });
//     }

//     return {
//         interpret,
//         subscribe,
//         emit,
//         next
//     };
// }

// export { parser };

export { parser } from './lib/parser';