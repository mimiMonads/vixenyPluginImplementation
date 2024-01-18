import { Petition } from "vixeny/components/http/src/framework/optimizer/types";
import { CyclePlugin, FunRouterOptions } from "vixeny/components/http/types";




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