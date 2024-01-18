
import { CyclePlugin } from "vixeny/components/http/types";


const url = {
    // Use a unique symbol as the name for the plugin. This ensures the name is unique and avoids name collisions.
    name: Symbol.for("hello"),

    // 'type' is not requiered
    type: undefined,

    // Define a function 'f' which is a series of curried functions.
    // The final function takes a Request object 'r' and returns its URL.
    // This structure is typical in middleware or plugin systems where each function layer can add more context or control.
    f: (_)=> (_)=>(r: Request)=>r.url
};

// Self-invoking function to enforce type-checking.
// This ensures 'url' adheres to the CyclePlugin type structure.
((I:CyclePlugin)=>I)(url);


export default {...url};
