import { getCurrentTime } from './time_lib';
import { decodeBarcode } from './barcode';

export function GetCurrentTime() {
    return getCurrentTime();
}

export function DecodeBarcode(instance) {
    var code = decodeBarcode(instance);
    return code;
}

