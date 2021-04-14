const { Machine, interpret, send, actions } = require('xstate');

const { choose, after } = actions;

const machine = Machine({
    id: 'mac',
    initial: 'light_off',
    states: {
        light_off: {
            entry: (ctx, evt) => {
                console.log('Enter light off');
            },
            on: {
                PIFF: {
                    target: "light_on"
                }
            },
            exit: () => console.log('exit light off')
        },
        light_on: {
            initial: "green",
            onDone: {
                actions: choose([
                    {
                        cond: (ctx, evt) => {
                            return true;
                        },
                        actions: send('BLUE', {
                            delay: "HOLA",
                            id: "my-hola"
                        })
                    },
                    {
                        cond: (ctx, evt) => {
                            return false;
                        },
                        actions: send('YELLOW')
                    }
                ])
            },
            states: {
                green: {
                    on: {
                        BLUE_COLOR: "blue",
                        YELLOW_COLOR: "yellow"
                    }
                },
                blue: {
                    entry: () => {
                        console.log('im final');
                    },
                    type: "final"
                },
                yellow: {
                    type: "final"
                }
            },
            on: {
                // [after(100, "BLUE")]: {
                //     target: "light_off"
                // },
                BLUE: "light_off",
                YELLOW: "light_off"
            }
        }
    }
}, {
    delays: {
        HOLA: (ctx, evt) => 1000
    }
});

// [after(1000, 'light.green')]: {
//         target: 'yellow',
//         cond: 'trafficIsLight'
//       }

const service = interpret(machine)
.onTransition(state => {
    if (state.changed) {
        console.log(`state = ${JSON.stringify(state.value)}`);
    }
})
.start();
service.send('PIFF');
service.send('BLUE_COLOR');
// service.send('PIFF');
// console.log(service.state.value);