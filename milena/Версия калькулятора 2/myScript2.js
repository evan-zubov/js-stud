//TODO
// раставлять запятые на три символа, .map Ф-я может называться normalize display
// принимает state и возвращает state с нормализованным display
// уменьшать текст, когда переполнение дисплея
// корень квадратный из 8 - ошибка, что-то делать с округлением


const OPERATORS = {
    PLUS: '+',
    MINUS: '-',
    MULTIPLICATION: '*',
    DIVISION: '/',
    FRACTION: 'frac',
    X_SQUARED: 'x2',
    SQUARE_ROOT: 'sqrt2',
    PERCENT: '%',
    EQUALS: '='
}

const OPERATOR_FUNCS = {
    [OPERATORS.PLUS]: (a, b) => a + b,  //вычисляемые  значения ключа
    [OPERATORS.MINUS]: (a, b) => a - b,
    [OPERATORS.MULTIPLICATION]: (a, b) => a * b,
    [OPERATORS.DIVISION]: (a, b) => a / b,
}

const ERRORS = {
    DIV_ZERO: 'Cannot divide by zero'
}

const disableBtnsOp = () => {
    const btnsOp = document.getElementsByClassName("btn-operator");
    const btnsNumMod = document.getElementsByClassName("btn-number-mod");

    [...btnsOp, ...btnsNumMod].forEach(element => {
        element.disabled = true;
    });
}

const enableBtnsOp = () => {
    const btnsOp = document.getElementsByClassName("btn-operator");
    const btnsNumMod = document.getElementsByClassName("btn-number-mod");

    [...btnsOp, ...btnsNumMod].forEach(element => {
        element.disabled = false;
    });
}

const showErrorMessage = ({ state, error }) => {
    if (error === ERRORS.DIV_ZERO) {
        return {
            ...state,
            display: ERRORS.DIV_ZERO,
            justPressedOperator: true,
            btnsEnabled: false,
            showingError: true
        }
    }
}

const addEqualsToDisplayMem = (state) => {
    return {
        ...state,
        displayMem: state.display === ERRORS.DIV_ZERO ? state.displayMem : state.displayMem + OPERATORS.EQUALS,
        equalsPressedBefore: true
    }
}

const handlePercentInsidePlusMinusStatement = {
    name: 'Percent inside Plus/Minus statement',
    condition: state => (state.currentOperator === OPERATORS.PERCENT) &&
        [OPERATORS.PLUS, OPERATORS.MINUS].includes(state.lastOperator),
    handle: state => {
        const { lastOperator, display, acc } = state;
        const val = (acc * Number(display)) / 100;
        const nextDisplayMem = acc + lastOperator + val;
        return {
            ...state,
            display: String(val),
            displayMem: nextDisplayMem
        }
    }
}

const handlePercentInsideMultiplicDivisionStatement = {
    name: 'Percent inside Multiplication/Division statement',
    condition: state => (state.currentOperator === OPERATORS.PERCENT) &&
        [OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator),
    handle: state => {
        const { lastOperator, display, acc } = state;
        const val = Number(display) / 100;
        const nextDisplayMem = acc + lastOperator + val;
        return {
            ...state,
            display: String(val),
            displayMem: nextDisplayMem
        }
    }
}

const handleFractionInsideStatement = {
    name: 'Fraction inside statement',
    condition: state => (state.currentOperator === OPERATORS.FRACTION) &&
        ([OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator)),
    handle: state => {
        const { lastOperator, display, acc } = state;
        const valFrac = 1 / Number(display);
        const nextDisplayMem = `${acc}${lastOperator}1/(${display})`;
        return {
            ...state,
            display: String(valFrac),
            justPressedOperator: true,
            displayMem: nextDisplayMem
        }
    }
}

const handleFractionSingleNumber = {
    name: 'Fraction single number',
    condition: state => (state.currentOperator === OPERATORS.FRACTION),
    handle: state => {
        const { display } = state;
        const val = 1 / Number(display);
        const nextDisplayMem = `1/(${display})`;
        return {
            ...state,
            acc: val,
            display: String(val),
            justPressedOperator: true,
            displayMem: nextDisplayMem
        }
    }
}

const handleSquaredInsideStatement = {
    name: 'Squared inside statement',
    condition: state => (state.currentOperator === OPERATORS.X_SQUARED) &&
        ([OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator)),
    handle: state => {
        const { lastOperator, display, acc } = state;
        const valSquared = Math.pow(Number(display), 2);
        const nextDisplayMem = `${acc}${lastOperator}sqr(${display})`;
        return {
            ...state,
            display: String(valSquared),
            justPressedOperator: true,
            displayMem: nextDisplayMem
        }
    }
}

const handleSquaredSingleNumber = {
    name: 'Squared single number',
    condition: state => (state.currentOperator === OPERATORS.X_SQUARED),
    handle: state => {
        const { display } = state;
        const val = Math.pow(Number(display), 2);
        const nextDisplayMem = `sqr(${display})`;
        return {
            ...state,
            acc: val,
            display: String(val),
            justPressedOperator: true,
            displayMem: nextDisplayMem
        }
    }
}

const handleSquareRootInsideStatement = {
    name: 'Square Root inside statement',
    condition: state => (state.currentOperator === OPERATORS.SQUARE_ROOT) &&
        ([OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator)),
    handle: state => {
        const { lastOperator, display, acc } = state;
        const valRoot = Math.sqrt(Number(display));
        const nextDisplayMem = `${acc}${lastOperator}\u{0221A}(${display})`;  // шаблонные строки
        return {
            ...state,
            display: String(valRoot),
            justPressedOperator: true,
            displayMem: nextDisplayMem
        }
    }
}

const handleSquareRootSingleNumber = {
    name: 'Square Root single number',
    condition: state => (state.currentOperator === OPERATORS.SQUARE_ROOT),
    handle: state => {
        const { display } = state;
        const val = Math.sqrt(Number(display));
        return {
            ...state,
            acc: val,
            display: String(val),
            justPressedOperator: true,
            displayMem: `\u{0221A}(${display})`
        }
    }
}

const handleDivisionByZero = {
    name: 'Division by zero',
    condition: state => (state.lastOperator === OPERATORS.DIVISION && Number(state.display) === 0),
    handle: state => {
        const { lastOperator, display, acc, currentOperator } = state;
        state.displayMem = acc + lastOperator + display + currentOperator;
        return showErrorMessage({ state, error: ERRORS.DIV_ZERO });
    }
}

const handlePlusMinusMultDivOperations = {
    name: 'Plus/Minus/Multiplication/Division operations',
    condition: state => [OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator),
    handle: state => {
        const { lastOperator, display, acc, currentOperator } = state;
        const func = OPERATOR_FUNCS[lastOperator];
        const res = func(acc, Number(display));
        const val = (+res.toFixed(15));
        const nextDisplayMem = val + currentOperator;
        return {
            ...state,
            acc: val,
            display: String(val),
            lastOperator: currentOperator,
            justPressedOperator: true,
            displayMem: nextDisplayMem
        };
    }
}

const handleEqualsFractionSquaredSquareRootOperations = {
    name: 'Fraction/Squared/SquareRoot operations after Equals pressed',
    condition: state => [OPERATORS.FRACTION, OPERATORS.X_SQUARED, OPERATORS.SQUARE_ROOT].includes(state.currentOperator) &&
        (state.lastOperator === undefined),
    handle: state => {
        const { display, equalsPressedBefore } = state;
        return {
            ...state,
            ...(equalsPressedBefore && { displayMem: display })
        };
    }
}
// спред - берем и перекладываем все поля из одного объекта в другой
const handleEqualsDivisionByZero = {
    name: 'Division by zero after Equals pressed',
    condition: state => (state.lastOperator === OPERATORS.DIVISION && Number(state.display) === 0),
    handle: state => {
        return showErrorMessage({ state, error: ERRORS.DIV_ZERO });
    }
}

const handleEqualsPlusMinusMultDivOperations = {
    name: 'Plus/Minus/Multiplication/Division operations after Equals pressed',
    condition: state => [OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator),
    handle: state => {
        const { lastOperator, display, acc, equalsPressedBefore } = state;
        const func = OPERATOR_FUNCS[lastOperator];
        const res = (equalsPressedBefore ? func(Number(display), acc) : func(acc, Number(display)));
        const val = (+res.toFixed(15));
        const nextDisplayMem = (equalsPressedBefore ? display + lastOperator + acc : acc + lastOperator + display);
        return {
            ...state,
            ...(equalsPressedBefore ? { display: String(val) } : { acc: Number(display), display: String(val) }),
            justPressedOperator: true,
            operatorPressedBefore: false,
            displayMem: nextDisplayMem,
        };
    }
}

const calcEquals = (state) => {
    const foundHandlerEquals = [
        handleEqualsFractionSquaredSquareRootOperations,
        handleEqualsDivisionByZero,
        handleEqualsPlusMinusMultDivOperations
    ].find(handler => handler.condition(state));
    console.log('Handler triggered after Equals: ', foundHandlerEquals ? foundHandlerEquals.name : 'none');
    return foundHandlerEquals ? foundHandlerEquals.handle(state) : {
        ...state,
        displayMem: display
    };
}

//ф-я вычисления
const calc = (state) => {
    const foundHandler = [
        handlePercentInsidePlusMinusStatement,
        handlePercentInsideMultiplicDivisionStatement,
        handleFractionInsideStatement,
        handleFractionSingleNumber,
        handleSquaredInsideStatement,
        handleSquaredSingleNumber,
        handleSquareRootInsideStatement,
        handleSquareRootSingleNumber,
        handleDivisionByZero,
        handlePlusMinusMultDivOperations
    ].find(handler => handler.condition(state));
    console.log('Handler triggered: ', foundHandler ? foundHandler.name : 'none');
    return foundHandler ? foundHandler.handle(state) : state;
}

const DEFAULT_STATE = {
    acc: 0,
    display: '0',
    lastOperator: undefined,
    currentOperator: undefined,
    justPressedOperator: false,
    displayMem: '',
    equalsPressedBefore: false,
    operatorPressedBefore: false,
    btnsEnabled: true,
    showingError: false
}

//состояние
let state = /*JSON.parse(localStorage.getItem('state')) || */ DEFAULT_STATE;

//отображение состояния на дисплее
const render = (state) => {
    const displayDomElement = document.getElementById("display");
    const displayMemDomElement = document.getElementById("displayMem");
    displayDomElement.innerText = state.display;
    displayMemDomElement.innerText = state.displayMem;
    if (state.showingError) {
        displayDomElement.classList.add('errorTextSize');
    } else {
        displayDomElement.classList.remove('errorTextSize')
    }
    if (state.btnsEnabled) {
        enableBtnsOp();
    } else {
        disableBtnsOp();
    }
}

//изменение состояния приложения
const reducer = ({ state, action }) => {
    console.log("Action:", action);
    const { justPressedOperator, operatorPressedBefore, display } = state;

    if (action.type === 'number' && justPressedOperator) {
        if (display === ERRORS.DIV_ZERO) {
            return ({ ...DEFAULT_STATE, display: action.value });
        }
        return {
            ...state,
            display: action.value,
            justPressedOperator: false
        }
    }

    if (action.type === 'number') {
        return {
            ...state,
            display: state.display === '0'
                ? action.value
                : state.display + action.value
        };
    }
    if (action.type === 'numberDot') {
        if (display.indexOf('.') > -1) {   //if (display.includes('.')) {
            return state;
        } else {
            return {
                ...state,
                display: display + action.value
            };
        }
    }
    if (action.type === 'numberPM') {
        if (display.indexOf('-') > -1) {
            return state;
        } else {
            return {
                ...state,
                display: display === '0'
                    ? display
                    : action.value + display
            };
        }
    }
    if (action.type === 'C') {
        return DEFAULT_STATE;
    }
    if (action.type === 'CE') {
        if (display === ERRORS.DIV_ZERO) {
            return DEFAULT_STATE;
        }
        return {
            ...state,
            display: '0'
        };
    }
    if (action.type === 'backSpace') {
        if (display === ERRORS.DIV_ZERO) {
            return DEFAULT_STATE;
        }
        return {
            ...state,
            display: display.length > 1
                ? display.slice(0, length - 1)
                : '0'
        };
    }
    if ([OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(action.type) &&
        (!operatorPressedBefore)) {
        return {
            ...state,
            acc: Number(display),
            lastOperator: action.type,
            justPressedOperator: true,
            displayMem: display + action.type,
            operatorPressedBefore: true,
            equalsPressedBefore: false
        };
    }
    if ([OPERATORS.PLUS, OPERATORS.MINUS, OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(action.type) &&
        (operatorPressedBefore)) {
        return calc({ ...state, currentOperator: action.type });
    }

    if ([OPERATORS.FRACTION, OPERATORS.X_SQUARED, OPERATORS.SQUARE_ROOT].includes(action.type)) {
        return calc({ ...state, currentOperator: action.type })
    }

    if ((action.type === OPERATORS.PERCENT) && (operatorPressedBefore === true)) {
        return calc({ ...state, currentOperator: action.type });
    }
    if ((action.type === OPERATORS.PERCENT) && (operatorPressedBefore === false)) {
        return {
            ...state,
            acc: 0,
            display: '0',
            currentOperator: undefined,
            displayMem: '0'
        };
    }
    if (action.type === OPERATORS.EQUALS) {
        if (display === ERRORS.DIV_ZERO) {
            return DEFAULT_STATE;
        }
        const calcedState = calcEquals(state);
        const stateWithEqualsAdded = addEqualsToDisplayMem(calcedState);
        return stateWithEqualsAdded;
    }
    return state;
}

render(state);   //отображение на дисплее

const containerDomElement = document.getElementById("container");
containerDomElement.addEventListener("click", (event) => {
    const getParentButton = (element) => (element.tagName.toUpperCase() === 'BUTTON')
        ? element
        : getParentButton(element.parentElement)
    const clickedButton = getParentButton(event.target);

    //обновляем состояние приложения
    state = reducer({
        state,
        action: clickedButton.dataset
    });
    console.log("State:", state);
    render(state);   //отображение на дисплее
    //localStorage.setItem('state', JSON.stringify(state));
});
