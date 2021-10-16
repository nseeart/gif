self.addEventListener('message', function (e) {
    const { cidxBuffer, palleteBuffer, workerId } = e.data;
    const cidx: Array<number> = Array.from(cidxBuffer);
    const pallete: Array<number> = Array.from(palleteBuffer)
    const palleteArray: Array<Array<number>> = [];
    const n = 3;
    const len = pallete.length;
    const lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1);
    for(let i=0;i < lineNum; i++) {
        let temp: Array<number> = pallete.slice(i * n, i * n + n);
        palleteArray.push(temp);
    }
    // const cidxBuffer = Uint8Array.from(cidx);
    // const palleteBuffer = Uint8Array.from(pallete.flat());
    const data = handlerData(palleteArray, cidx);
    self.postMessage(Uint8ClampedArray.from(data));
  }, false);


  function handlerData(pallete: Array<Array<number>>, cidx: Array<number>) {
    let pixels: Array<number> = [];
    for (let i = 0, poff = 0; i < cidx.length; i += 1, poff += 4) {
        /* eslint-disable prefer-destructuring */
        pixels[poff + 0] = pallete[cidx[i]][0];
        pixels[poff + 1] = pallete[cidx[i]][1];
        pixels[poff + 2] = pallete[cidx[i]][2];
        pixels[poff + 3] = 255;
        /* eslint-enable prefer-destructuring */
    }
    return pixels;
    // ctx.putImageData(imgData, 0, 0);
  }

  