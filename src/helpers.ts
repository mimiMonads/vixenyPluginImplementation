
import helloWorld from "./plugins/helloWorld";
import url from "./plugins/url";
import { FunRouterOptions } from "vixeny/components/http/types";
import whoIAM from "./plugins/whoIAm";
import adder from "./plugins/adder";

const options = {
    cyclePlugin: {
        helloWorld,
        url,
        dave : whoIAM(),
        avant: whoIAM(),
        adder: adder()
    }
} 

//typing is right
const typing = (I:FunRouterOptions)=> I
typing(options)


export default options