export const enum CellValues {
  None = 'None',
  X = 'X',
  O = 'O',
}

export type TicTacMap = [
  CellValues, CellValues, CellValues, // 0 1 2
  CellValues, CellValues, CellValues, // 3 4 5
  CellValues, CellValues, CellValues, // 6 7 8
]

export type FirstStep = { id: number, prevStepId: undefined, field: number }
export type Step = { id: number, prevStepId: number, field: number }
