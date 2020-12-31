// Cell  None | X | Y
// TicTieMap Array 9 items
// 0 1 2
// 3 4 5
// 6 7 8

function getClearMap() {
    return [
        'None', 'None', 'None',
        'None', 'None', 'None',
        'None', 'None', 'None',
    ]
}

const WIN_COMBINATION = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
]

function checkIsGameEnd(map) {
    return WIN_COMBINATION.some(combination => {
        return combination.every(position => map[position] === 'X') ||
        combination.every(position => map[position] === 'O')
    })
}

// steps:
// first: { id: number, prevStepId: undefined, field: number }
// step: { id: number, prevStepId: number, field: number }

// status: 'before_start', 'game', 'finished'

export class Board {
    static instance;
    map = getClearMap();
    steps = [];
    status = 'before_start';

    constructor() {
    }

    static getInstance() {
        if(!Board.instance) {
            Board.instance = new Board();
        }

        return Board.instance
    }

    getCurrentGameState() {
        return { map: this.map, steps: this.steps, status: this.status }
    }

    clear() {
        this.status = 'before_start';
        this.map = getClearMap();
        this.steps = [];
    }

    firstStep(stepData) {
        const isFieldCorrect = stepData.field >= 0 && stepData.field <= 8;
        const isMapEmpty = this.map.every(f => f === 'None');
        const isStepsLengthZero = this.steps.length === 0;

        if (isStepsLengthZero && isMapEmpty && isFieldCorrect) {
            const step = {
                id: 0,
                prevStepId: undefined,
                field: stepData.field,
            }

            this.steps=[step]
            this.map = [...this.map.slice(0, stepData.field), 'O', ...this.map.slice(stepData.field + 1)]
            this.status = 'game'

            return { result: true }
        } else {
            return { result: false }
        }
    }

    step(stepData) {
        const isProgression = this.steps.length > 0 && this.steps.slice(-1)[0].id === stepData.prevStepId;
        const isFieldCorrect = stepData.field >= 0 && stepData.field <= 8 && this.map[stepData.field] === 'None';
        const isGameStatusCorrect = this.status === 'game';

        if(isProgression && isFieldCorrect && isGameStatusCorrect) {
            const step = {
                id: this.steps.length,
                prevStepId: this.steps.length - 1,
                field: stepData.field
            }

            const fieldData = this.steps.length % 2 === 1 ? 'X' : 'O';

            this.steps=[...this.steps, step]
            this.map = [...this.map.slice(0, stepData.field), fieldData, ...this.map.slice(stepData.field + 1)]

            this.checkGameEnd()

            return { result: true }
        } else {
            return { result: false }
        }
    }

    checkGameEnd() {
        const isGameEnd = this.steps.length >= 5 && checkIsGameEnd(this.map);

        if (isGameEnd) {
            this.status = 'finished'
        }
    }
}
