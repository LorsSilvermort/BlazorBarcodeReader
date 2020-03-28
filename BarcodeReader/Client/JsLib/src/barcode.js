import Quagga from 'quagga';

export function decodeBarcode(instance) {
    var decodedBarcode = '';
    document.getElementById('scanner-container').style.display = 'block';
    document.getElementById('helperlines').style.display = 'block';
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner-container'),
                constraints: {
                    width: 480,
                    height: 320,
                    facingMode: "environment"
                },
                area: { // defines rectangle of the detection/localization area
                    top: "25%",    // top offset
                    right: "5%",  // right offset
                    left: "5%",   // left offset
                    bottom: "25%"  // bottom offset
                },
            },
            numOfWorkers: navigator.hardwareConcurrency,
            locate: false,
            frequency: 10,
            multiple: false,
            locator: {
                halfSample: true,
                patchSize: "medium", // x-small, small, medium, large, x-large
            },
            decoder: {
                readers: [
                    "code_128_reader",
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_reader",
                    "code_39_vin_reader",
                    "codabar_reader",
                    "upc_reader",
                    "upc_e_reader",
                    "i2of5_reader"
                ],
                
            },

        }, function (err) {
            if (err) {
                console.log(err);
                return
            }

            console.log("Initialization finished. Ready to start");
            Quagga.start();

            
        });

        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;
            
            

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "red", lineWidth: 3 });
                    });
                }

                if (result.box) {
                    //Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    //Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'green', lineWidth: 3 });
                }
            }
        });


        Quagga.onDetected(function (result) {
            
            decodedBarcode = result.codeResult.code;
            //alert(result.codeResult.startInfo.error + " | " + result.codeResult.startInfo.error + " Result: " + result.codeResult.code);

            if (result.codeResult.startInfo.error < 0.12) { 
                //alert(result.codeResult.startInfo.error + " | " + result.codeResult.startInfo.error + " Result: " + result.codeResult.code);
            document.getElementById('scanner-container').style.display = 'none';
            Quagga.stop();
            instance.invokeMethod('SetReturnValue', decodedBarcode);
            }
        });
    
}
export function stopReader() {
    document.getElementById('scanner-container').style.display = 'none';
    Quagga.stop();
}


