// Unlike ScriptProcessorNode, AudioWorkletNode doesn't have a bufferSize property
// so it has to be implemented manually.

export const stackmatWorkletProcessor = URL.createObjectURL(
    new Blob([
        `
class StackmatWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 10240;
    this.chunkBuffer = new Float32Array(this.bufferSize);
    this.offset = 0;
  }
  process(inputs) {
    const inputChannel = (inputs[0] && inputs[0][0]) || new Float32Array(0);

    this.chunkBuffer.set(inputChannel, this.offset);
    this.offset += inputChannel.length;

    if (this.offset >= this.bufferSize) {
      this.port.postMessage(this.chunkBuffer);
      this.chunkBuffer = new Float32Array(this.bufferSize);
      this.offset = 0;
    }

    return true;
  }
}
registerProcessor('stackmat-processor', StackmatWorkletProcessor);
    `
    ], { type: 'application/javascript' })
);
