const { some } = require("cypress/types/lodash");

it('sem testes, ainda', () =>{ })

const getSomething = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(13);
        }, 1000)
    })
}

 const System = () => {
    console.log('init');
    const prom = getSomething()
    prom.then(some => {
        console.log(`Something is ${some}`);
    })
        console.log('end'); 
}

System();