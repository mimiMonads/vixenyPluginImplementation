import fun from 'vixeny/fun'
import options from './src/helpers'


Bun.serve({
    fetch: fun(
        options
    )([
        {
            path: '/',
            f: f => f.helloWorld
        },
        {
            path: '/url',
            f: f => f.url
        },
        {
            path: '/dave',
            f: f => f.dave
        },
        {
            path: '/avant',
            f: f => f.avant
        },
        {
            path: '/addFive/:number',
            f: f =>  f.adder(Number(f.param.number) || 0 ).toString(),
            plugins:{
                adder: 5
            }
        },
        {
            path: '/addFour/:number',
            f: f =>  f.adder(Number(f.param.number) || 0 ).toString(),
            plugins:{
                adder: 4
            }
        },
    ])
})




