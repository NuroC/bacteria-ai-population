import Matrix from './Matrix';

class NeuralNetwork {
  inputNodes: number;
  hiddenNodes: number;
  outputNodes: number;
  weightsInputHidden: Matrix;
  weightsHiddenOutput: Matrix;
  learningRate: number;

  constructor(inputNodes: number, hiddenNodes: number, outputNodes: number) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    this.weightsInputHidden = new Matrix(hiddenNodes, inputNodes);
    this.weightsHiddenOutput = new Matrix(outputNodes, hiddenNodes);

    this.weightsInputHidden.randomize();
    this.weightsHiddenOutput.randomize();

    this.learningRate = 0.1;
  }

  sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  dsigmoid(y: number): number {
    // Derivative of sigmoid
    return y * (1 - y);
  }

  feedForward(inputArray: number[]): number[] {
    const inputs = Matrix.fromArray(inputArray);
    const hidden = Matrix.multiply(this.weightsInputHidden, inputs);
    hidden.map(this.sigmoid);

    const output = Matrix.multiply(this.weightsHiddenOutput, hidden);
    output.map(this.sigmoid);

    return output.toArray();
  }

  train(inputArray: number[], targetArray: number[]): void {
    const inputs = Matrix.fromArray(inputArray);
    const hidden = Matrix.multiply(this.weightsInputHidden, inputs);
    hidden.map(this.sigmoid);

    const outputs = Matrix.multiply(this.weightsHiddenOutput, hidden);
    outputs.map(this.sigmoid);

    const targets = Matrix.fromArray(targetArray);

    const outputErrors = Matrix.subtract(targets, outputs);
    const hiddenErrors = Matrix.multiply(Matrix.transpose(this.weightsHiddenOutput), outputErrors);

    const gradients = Matrix.map(outputs, this.dsigmoid);
    gradients.multiply(outputErrors);
    gradients.multiply(this.learningRate);

    const hiddenT = Matrix.transpose(hidden);
    const weightsHiddenOutputDeltas = Matrix.multiply(gradients, hiddenT);
    this.weightsHiddenOutput.add(weightsHiddenOutputDeltas);

    const hiddenGradient = Matrix.map(hidden, this.dsigmoid);
    hiddenGradient.multiply(hiddenErrors);
    hiddenGradient.multiply(this.learningRate);

    const inputsT = Matrix.transpose(inputs);
    const weightsInputHiddenDeltas = Matrix.multiply(hiddenGradient, inputsT);
    this.weightsInputHidden.add(weightsInputHiddenDeltas);
  }

  copy(): NeuralNetwork {
    const newNN = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
    newNN.weightsInputHidden = this.weightsInputHidden.copy();
    newNN.weightsHiddenOutput = this.weightsHiddenOutput.copy();
    return newNN;
  }

  mutate(rate: number): void {
    const mutation = (val: number) => (Math.random() < rate ? val + Math.random() * 0.1 - 0.05 : val);
    this.weightsInputHidden.map(mutation);
    this.weightsHiddenOutput.map(mutation);
  }

}

export default NeuralNetwork;
