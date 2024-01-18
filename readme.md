# Introduction to Plugins in the Vixeny Library

In this guide, we're embarking on an exciting journey to create an application leveraging the power of plugins within the Vixeny library. We'll begin by setting up our file structure, which is the foundation of our application:

```
app.ts
src/
    /plugins/*
    /helpers.ts
```

# Setting Up the Base Application
In `app.ts`, our starting point:

```ts
import fun from 'vixeny/fun';
// Global options
import options from './src/helpers';

Bun.serve({
    fetch: fun(
        options
    )([
        {
            path: '/',
            // A simple route for starters
            f: () => 'Hello World'
        }
    ])
});
```

Next, in in `src/helpers.ts`:

```ts
import { FunRouterOptions } from 'vixeny/components/http/types';
// Setting up a default export for router options
export default {} as FunRouterOptions;
```

# Crafting Our First Plugin

Let's dive into plugin creation by adding `helloWorld.ts` in the `src/plugins` directory:

```ts

const hello = {
    // Names in Vixeny are polymorphic, hence the necessity of inserting a Symbol
    name: Symbol.for('hello'),
    // Currently, no specific type is required
    type: undefined,
    // Ignoring the first two curried functions for now 
    f: (_) => (_) => (_) => 'Hello World'
};


export default {...hello};

```

And modify `helpers.ts`:

```ts
// Here we are using helloWorld, but it can be anything
import helloWorld from './plugins/helloWorld';

const options = {
    cyclePlugin: {
        // Integrating our HelloWorld plugin
        helloWorld
    }
};


// Ensuring correct typing due to TypeScript limitations
const typing = (I: FunRouterOptions) => I;
typing(options);

export default options;
```

And define our final route in `app.ts`:

```ts
        {
            path: '/',
            // Utilizing the HelloWorld plugin
            f: f => f.helloWorld
        }
```

# Implementing the Request Plugin

Now, let's introduce `url.ts`:

```ts
import { CyclePlugin } from "vixeny/components/http/types";


const url = {
    // Use a unique symbol as the name for the plugin. This ensures the name is unique and avoids name collisions.
    name: Symbol.for("hello"),

    // 'type' is not requiered
    type: undefined,

    // Capturing the URL from the request.
    f: (_)=> (_)=>(r: Request)=>r.url
};

// Self-invoking function to enforce type-checking.
// This ensures 'url' adheres to the CyclePlugin type structure.
((I:CyclePlugin)=>I)(url);


export default {...url};

```

We'll incorporate this into `helper.ts` and update `app.ts` accordingly.

```ts
//helper.ts
{
    //other code
        cyclePlugin: {
        helloWorld,
        url
    }
}
```
```ts
//app.ts
        {
            path: '/url',
            f: f => f.url
        }
```

# Exploring GlobalOptions

Understanding the polymorphic nature of Vixeny can be challenging. However, with the use of symbols, we can infer the name of our plugin:

```ts
/**
 * Creates a unique CyclePlugin object each time it's called.
 * This plugin, when used, returns the name assigned to it in the router options.
 */
const whoIAM = () => {
    // Generates a unique symbol for each call, ensuring a distinct identifier.
    const sym = Symbol("whoIAM");

    return {
        name: sym,
        type: undefined,
        f: (routerOptions?:FunRouterOptions) => (_) => (_) => {
            // Finds and returns the key under which this plugin is stored in routerOptions.
            const currentName = Object
                .keys(routerOptions?.cyclePlugin ?? [])
                //
                .find(name => routerOptions.cyclePlugin[name].name === sym) as string;

            return currentName;
        }
    }
}

((I:CyclePlugin)=>I)(whoIAM());
```

After adding it to `helper.ts`, we set up corresponding routes in `app.ts`.

```ts
//helper.ts
{

    cyclePlugin: {
        helloWorld,
        url,
        dave : whoIAM(),
        avant: whoIAM(),
    }
}
```

```ts
//app.ts
        {
            path: '/dave',
            f: f => f.dave
        },
        {
            path: '/avant',
            f: f => f.avant
        }
```

# Introducing Plugin Options

Our next step is to create an adder plugin, which retrieves its value from plugins. We'll add `adder.ts` in our plugins directory:
```ts
/**
 * Creates an 'adder' plugin that can be used to add a number to a given value.
 * Each instance of the plugin has a unique identifier.
 */
const adder = () => {
    // Generates a unique symbol for each call to ensure a distinct identity for the plugin.
    const sym = Symbol("adder");

    return {
        name: sym,
        // 'type' is set as a number, but it can represent a different type if needed.
        type: {} as number,
        f: (routerOptions?: FunRouterOptions) => (userOptions?: Petition) => {
            // Retrieves the name of this plugin from routerOptions based on the unique symbol.
            const currentName = Object
                .keys(routerOptions?.cyclePlugin ?? [])
                .find(name => routerOptions?.cyclePlugin[name].name === sym) as string;

            // Extracts the value associated with this plugin from userOptions.
            const value = userOptions.plugins[currentName] as number;

            // Throws an error if the value is not provided or is not a number.
            if (value === null || value === undefined) {
                throw new Error(`${currentName} requires a number in "plugins"`);
            }

            // Returns a function that adds the provided value to its argument.
            return(_R: Request)=> (n: number) => value + n;
        }
    }
};

// Self-invoking function to enforce type-checking against the CyclePlugin type.
((I: CyclePlugin) => I)(adder());

// Exports the 'adder' function as the default export of this module.
export default adder;

```
Following this, we'll update `helper.ts`` and `app.ts` to integrate the new plugin.

```ts
//helper.ts
    cyclePlugin: {
        helloWorld,
        url,
        dave : whoIAM(),
        avant: whoIAM(),
        adder: adder()
    }
```

```ts
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
```


And that's all for our guide on Vixeny plugins. Thank you for following along, and happy coding!
