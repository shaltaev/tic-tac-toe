const enum CellValues {
  None = 'None',
  X = 'X',
  O = 'O',
}

type TicTacMap = [
  CellValues, CellValues, CellValues, // 0 1 2
  CellValues, CellValues, CellValues, // 3 4 5
  CellValues, CellValues, CellValues, // 6 7 8
]

const getClearMap = (): TicTacMap => [
  CellValues.None, CellValues.None, CellValues.None,
  CellValues.None, CellValues.None, CellValues.None,
  CellValues.None, CellValues.None, CellValues.None,
]

type FirstStep = { id: number, prevStepId: undefined, field: number }
type Step = { id: number, prevStepId: number, field: number }

export class Board {
  private static instance: Board;
  private map: TicTacMap = getClearMap();
  private steps: [FirstStep, ...Step[]] | [] = [];

  private constructor() {
  }

  public static getInstance(): Board {
    if (!Board.instance) {
      Board.instance = new Board();
    }

    return Board.instance;
  }

  getCurrentMapState() {
    return { map: this.map, steps: this.steps }
  }

  clear() {
    this.steps = [];
    this.map = getClearMap();
    return { result: true }
  }

  firstStep(newStepData: Pick<Step, 'field'>) {
    const isFieldCorrect = newStepData.field >= 0 && newStepData.field <=8;
    const isMapEmpty = this.map.every(f => f === CellValues.None);
    const isStepsLengthZero = this.steps.length === 0;

    const step: FirstStep = { id: 0, prevStepId: undefined, field: newStepData.field }

    if (isStepsLengthZero && isMapEmpty && isFieldCorrect) {
      this.steps = [step]
      this.map = [...this.map.slice(0, newStepData.field), CellValues.O, ...this.map.slice(newStepData.field + 1)] as TicTacMap;
      return { result: true }
    } else {
      return { result: false }
    }
  }

  newStep(newStepData: Pick<Step, 'prevStepId' | 'field'>) {
    const isProgression = this.steps.length > 0 && this.steps.slice(-1)[0].id === newStepData.prevStepId;
    const isFieldCorrect = newStepData.field >= 0 && newStepData.field <=8;
    const isFieldEmpty = this.map[newStepData.field] === CellValues.None;
    const isStepsLengthMoreThenZero = this.steps.length > 0;

    const step: Step = { id: this.steps.length, prevStepId: this.steps.length - 1, field: newStepData.field }

    if (isProgression && isFieldCorrect && isFieldEmpty && isStepsLengthMoreThenZero) {
      this.steps = [this.steps[0], ...this.steps.slice(1, this.steps.length), step]
      this.map = [...this.map.slice(0, newStepData.field), this.steps.length % 2 === 1 ? CellValues.O : CellValues.X, ...this.map.slice(newStepData.field + 1)] as TicTacMap;
      return { result: true }
    } else {
      return { result: false }
    }
  }
}
