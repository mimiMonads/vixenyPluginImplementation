import { CyclePlugin, FunRouterOptions } from "vixeny/components/http/types";


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
        f: (routerOptions?:FunRouterOptions) => (_) => {
            // Finds and returns the key under which this plugin is stored in routerOptions.
            const currentName = Object
                .keys(routerOptions?.cyclePlugin ?? [])
                //
                .find(name => routerOptions.cyclePlugin[name].name === sym) as string;

            return () => currentName;
        }
    }
}

((I:CyclePlugin)=>I)(whoIAM());

export default whoIAM