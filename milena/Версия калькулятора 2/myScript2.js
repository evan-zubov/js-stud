//TODO
// раставлять запятые на три символа, .map Ф-я может называться normalize display
// принимает state и возвращает state с нормализованным display
// уменьшать текст, когда переполнение дисплея
// корень квадратный из 8 - ошибка, что-то делать с округлением

const OPERATORS = {
  PLUS: "+",
  MINUS: "-",
  MULTIPLICATION: "*",
  DIVISION: "/",
  FRACTION: "frac",
  X_SQUARED: "x2",
  SQUARE_ROOT: "sqrt2",
  PERCENT: "%",
  EQUALS: "=",
};

const OPERATOR_FUNCS = {
  [OPERATORS.PLUS]: (a, b) => a + b, //вычисляемые  значения ключа
  [OPERATORS.MINUS]: (a, b) => a - b,
  [OPERATORS.MULTIPLICATION]: (a, b) => a * b,
  [OPERATORS.DIVISION]: (a, b) => a / b,
};

const ERRORS = {
  DIV_ZERO: "Cannot divide by zero",
};

const getDisabledBtns = () => {
  const btnsOp = document.getElementsByClassName("btn-operator");
  const btnsNumMod = document.getElementsByClassName("btn-number-mod");
  return [...btnsOp, ...btnsNumMod];
};

const disableBtnsOp = () => {
  getDisabledBtns().forEach((element) => {
    element.disabled = true;
  });
};

const enableBtnsOp = () => {
  getDisabledBtns().forEach((element) => {
    element.disabled = false;
  });
};

const showErrorMessage = ({ state, error }) => {
  if (error === ERRORS.DIV_ZERO) {
    return {
      ...state,
      display: ERRORS.DIV_ZERO,
      justPressedOperator: true,
      btnsEnabled: false,
      showingError: true,
    };
  }
  return state;
};

const addEqualsToDisplayMem = (state) => {
  return {
    ...state,
    displayMem:
      state.display === ERRORS.DIV_ZERO
        ? state.displayMem
        : state.displayMem + OPERATORS.EQUALS,
    equalsPressedBefore: true,
  };
};

// TODO: можно попробовать вот такой стиль
const handleCalcPercentInsidePlusMinusStatement = {
  name: "Percent inside Plus/Minus statement",
  condition: ({ currentOperator, lastOperator }) =>
    currentOperator === OPERATORS.PERCENT &&
    [OPERATORS.PLUS, OPERATORS.MINUS].includes(lastOperator),
  handle: ({ lastOperator, display, acc }) => {
    const val = (acc * Number(display)) / 100;
    const nextDisplayMem = acc + lastOperator + val;
    return {
      ...state,
      display: String(val),
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcPercentInsideMultiplicDivisionStatement = {
  name: "Percent inside Multiplication/Division statement",
  condition: (state) =>
    state.currentOperator === OPERATORS.PERCENT &&
    [OPERATORS.MULTIPLICATION, OPERATORS.DIVISION].includes(state.lastOperator),
  handle: (state) => {
    const { lastOperator, display, acc } = state;
    const val = Number(display) / 100;
    const nextDisplayMem = acc + lastOperator + val;
    return {
      ...state,
      display: String(val),
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcFractionInsideStatement = {
  name: "Fraction inside statement",
  condition: (state) =>
    state.currentOperator === OPERATORS.FRACTION &&
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(state.lastOperator),
  handle: (state) => {
    const { lastOperator, display, acc } = state;
    const valFrac = 1 / Number(display);
    const nextDisplayMem = `${acc}${lastOperator}1/(${display})`;
    return {
      ...state,
      display: String(valFrac),
      justPressedOperator: true,
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcFractionSingleNumber = {
  name: "Fraction single number",
  condition: (state) => state.currentOperator === OPERATORS.FRACTION,
  handle: (state) => {
    const { display } = state;
    const val = 1 / Number(display);
    const nextDisplayMem = `1/(${display})`;
    return {
      ...state,
      acc: val,
      display: String(val),
      justPressedOperator: true,
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcSquaredInsideStatement = {
  name: "Squared inside statement",
  condition: (state) =>
    state.currentOperator === OPERATORS.X_SQUARED &&
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(state.lastOperator),
  handle: (state) => {
    const { lastOperator, display, acc } = state;
    const valSquared = Math.pow(Number(display), 2);
    const nextDisplayMem = `${acc}${lastOperator}sqr(${display})`;
    return {
      ...state,
      display: String(valSquared),
      justPressedOperator: true,
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcSquaredSingleNumber = {
  name: "Squared single number",
  condition: (state) => state.currentOperator === OPERATORS.X_SQUARED,
  handle: (state) => {
    const { display } = state;
    const val = Math.pow(Number(display), 2);
    const nextDisplayMem = `sqr(${display})`;
    return {
      ...state,
      acc: val,
      display: String(val),
      justPressedOperator: true,
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcSquareRootInsideStatement = {
  name: "Square Root inside statement",
  condition: (state) =>
    state.currentOperator === OPERATORS.SQUARE_ROOT &&
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(state.lastOperator),
  handle: (state) => {
    const { lastOperator, display, acc } = state;
    const valRoot = Math.sqrt(Number(display));
    const nextDisplayMem = `${acc}${lastOperator}\u{0221A}(${display})`; // шаблонные строки
    return {
      ...state,
      display: String(valRoot),
      justPressedOperator: true,
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcSquareRootSingleNumber = {
  name: "Square Root single number",
  condition: (state) => state.currentOperator === OPERATORS.SQUARE_ROOT,
  handle: (state) => {
    const { display } = state;
    const val = Math.sqrt(Number(display));
    return {
      ...state,
      acc: val,
      display: String(val),
      justPressedOperator: true,
      displayMem: `\u{0221A}(${display})`,
    };
  },
};

const handleCalcDivisionByZero = {
  name: "Division by zero",
  condition: (state) =>
    state.lastOperator === OPERATORS.DIVISION && Number(state.display) === 0,
  handle: (state) => {
    const { lastOperator, display, acc, currentOperator } = state;
    state.displayMem = acc + lastOperator + display + currentOperator;
    return showErrorMessage({ state, error: ERRORS.DIV_ZERO });
  },
};

const handleCalcPlusMinusMultDivOperations = {
  name: "Plus/Minus/Multiplication/Division operations",
  condition: (state) =>
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(state.lastOperator),
  handle: (state) => {
    const { lastOperator, display, acc, currentOperator } = state;
    const func = OPERATOR_FUNCS[lastOperator];
    const res = func(acc, Number(display));
    const val = +res.toFixed(15);
    const nextDisplayMem = val + currentOperator;
    return {
      ...state,
      acc: val,
      display: String(val),
      lastOperator: currentOperator,
      justPressedOperator: true,
      displayMem: nextDisplayMem,
    };
  },
};

const handleCalcEqualsFractionSquaredSquareRootOperations = {
  name: "Fraction/Squared/SquareRoot operations",
  condition: (state) =>
    [OPERATORS.FRACTION, OPERATORS.X_SQUARED, OPERATORS.SQUARE_ROOT].includes(
      state.currentOperator
    ) && state.lastOperator === undefined,
  handle: (state) => {
    const { display, equalsPressedBefore } = state;
    return {
      ...state,
      ...(equalsPressedBefore && { displayMem: display }),
    };
  },
};
// спред - берем и перекладываем все поля из одного объекта в другой
const handleCalcEqualsDivisionByZero = {
  name: "Division by zero",
  condition: (state) =>
    state.lastOperator === OPERATORS.DIVISION && Number(state.display) === 0,
  handle: (state) => {
    return showErrorMessage({ state, error: ERRORS.DIV_ZERO });
  },
};

const handleCalcEqualsPlusMinusMultDivOperations = {
  name: "Plus/Minus/Multiplication/Division operations",
  condition: (state) =>
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(state.lastOperator),
  handle: (state) => {
    const { lastOperator, display, acc, equalsPressedBefore } = state;
    const func = OPERATOR_FUNCS[lastOperator];
    const res = equalsPressedBefore
      ? func(Number(display), acc)
      : func(acc, Number(display));
    const val = +res.toFixed(15);
    const nextDisplayMem = equalsPressedBefore
      ? display + lastOperator + acc
      : acc + lastOperator + display;
    return {
      ...state,
      ...(equalsPressedBefore
        ? { display: String(val) }
        : { acc: Number(display), display: String(val) }),
      justPressedOperator: true,
      operatorPressedBefore: false,
      displayMem: nextDisplayMem,
    };
  },
};

const calcEquals = (state) => {
  const foundHandlerEquals = [
    handleCalcEqualsFractionSquaredSquareRootOperations,
    handleCalcEqualsDivisionByZero,
    handleCalcEqualsPlusMinusMultDivOperations,
  ].find((handler) => handler.condition(state));
  console.log(
    "CalcEquals handler triggered: ",
    foundHandlerEquals ? foundHandlerEquals.name : "none"
  );
  return foundHandlerEquals
    ? foundHandlerEquals.handle(state)
    : {
        ...state,
        displayMem: display,
      };
};

//ф-я вычисления
const calc = (state) => {
  const foundHandler = [
    handleCalcPercentInsidePlusMinusStatement,
    handleCalcPercentInsideMultiplicDivisionStatement,
    handleCalcFractionInsideStatement,
    handleCalcFractionSingleNumber,
    handleCalcSquaredInsideStatement,
    handleCalcSquaredSingleNumber,
    handleCalcSquareRootInsideStatement,
    handleCalcSquareRootSingleNumber,
    handleCalcDivisionByZero,
    handleCalcPlusMinusMultDivOperations,
  ].find((handler) => handler.condition(state));
  console.log(
    "Calc handler triggered: ",
    foundHandler ? foundHandler.name : "none"
  );
  return foundHandler ? foundHandler.handle(state) : state;
};

const DEFAULT_STATE = {
  acc: 0,
  display: "0",
  lastOperator: undefined,
  currentOperator: undefined,
  justPressedOperator: false,
  displayMem: "",
  equalsPressedBefore: false,
  operatorPressedBefore: false,
  btnsEnabled: true,
  showingError: false,
};

//состояние
let state = /*JSON.parse(localStorage.getItem('state')) || */ DEFAULT_STATE;

//отображение состояния на дисплее
const render = (state) => {
  const displayDomElement = document.getElementById("display");
  const displayMemDomElement = document.getElementById("displayMem");
  displayDomElement.innerText = state.display;
  displayMemDomElement.innerText = state.displayMem;
  if (state.showingError) {
    displayDomElement.classList.add("errorTextSize");
  } else {
    displayDomElement.classList.remove("errorTextSize");
  }
  if (state.btnsEnabled) {
    enableBtnsOp();
  } else {
    disableBtnsOp();
  }
};

const handleReduceNumberJustPressedOperatorAfterDivisionByZero = {
  name: "Number entered after operator pressed and Error Division by Zero displayed",
  condition: ({ state, action }) =>
    action.type === "number" &&
    state.justPressedOperator &&
    state.display === ERRORS.DIV_ZERO,
  handle: ({ action }) => {
    return { ...DEFAULT_STATE, display: action.value };
  },
};

const handleReduceNumberJustPressedOperator = {
  name: "Number entered after operator pressed",
  condition: ({ state, action }) =>
    action.type === "number" && state.justPressedOperator,
  handle: ({ state, action }) => {
    return {
      ...state,
      display: action.value,
      justPressedOperator: false,
    };
  },
};

const handleReduceNumber = {
  name: "Number entered",
  condition: ({ action }) => action.type === "number",
  handle: ({ state, action }) => {
    const { display } = state;
    return {
      ...state,
      display: display === "0" ? action.value : display + action.value,
    };
  },
};

const handleReduceNumberDot = {
  name: "Dot entered",
  condition: ({ state, action }) =>
    action.type === "numberDot" && state.display.indexOf(".") === -1,
  handle: ({ state, action }) => {
    const { display } = state;
    return {
      ...state,
      display: display + action.value,
    };
  },
};

const handleReduceNumberPM = {
  name: "+/- entered",
  condition: ({ state, action }) =>
    action.type === "numberPM" && state.display.indexOf("-") === -1,
  handle: ({ state, action }) => {
    const { display } = state;
    return {
      ...state,
      display: display === "0" ? display : action.value + display,
    };
  },
};

const handleReduceClear = {
  name: "C pressed",
  condition: ({ action }) => action.type === "C",
  handle: () => {
    return DEFAULT_STATE;
  },
};

const handleReduceCancelEntryErrorDisplayed = {
  name: "CE pressed after error displayed",
  condition: ({ state, action }) =>
    action.type === "CE" && state.display === ERRORS.DIV_ZERO,
  handle: () => {
    return DEFAULT_STATE;
  },
};

const handleReduceCancelEntry = {
  name: "CE pressed",
  condition: ({ action }) => action.type === "CE",
  handle: ({ state }) => {
    return {
      ...state,
      display: "0",
    };
  },
};

const handleReduceBackSpaceErrorDisplayed = {
  name: "BackSpace pressed after error displayed",
  condition: ({ state, action }) =>
    action.type === "backSpace" && state.display === ERRORS.DIV_ZERO,
  handle: () => {
    return DEFAULT_STATE;
  },
};

const handleReduceBackSpace = {
  name: "BackSpace pressed",
  condition: ({ action }) => action.type === "backSpace",
  handle: ({ state }) => {
    const { display } = state;
    return {
      ...state,
      display: display.length > 1 ? display.slice(0, length - 1) : "0",
    };
  },
};

const handleReduceOperatorPressedFirsTime = {
  name: "Plus/Minus/Multiplication/Division pressed for the first time",
  condition: ({ state, action }) =>
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(action.type) && !state.operatorPressedBefore,
  handle: ({ state, action }) => {
    const { display } = state;
    return {
      ...state,
      acc: Number(display),
      lastOperator: action.type,
      justPressedOperator: true,
      displayMem: display + action.type,
      operatorPressedBefore: true,
      equalsPressedBefore: false,
    };
  },
};

const handleReduceOperatorPressedNotFirsTime = {
  name: "Plus/Minus/Multiplication/Division pressed not for the first time",
  condition: ({ state, action }) =>
    [
      OPERATORS.PLUS,
      OPERATORS.MINUS,
      OPERATORS.MULTIPLICATION,
      OPERATORS.DIVISION,
    ].includes(action.type) && state.operatorPressedBefore,
  handle: ({ state, action }) => {
    return calc({ ...state, currentOperator: action.type });
  },
};

const handleReduceFracSquaredSquareRoot = {
  name: "Fraction/Squared/SquareRoot pressed",
  condition: ({ action }) =>
    [OPERATORS.FRACTION, OPERATORS.X_SQUARED, OPERATORS.SQUARE_ROOT].includes(
      action.type
    ),
  handle: ({ state, action }) => {
    return calc({ ...state, currentOperator: action.type });
  },
};

const handleReducePercentAfterOperator = {
  name: "Percent pressed after Operator",
  condition: ({ state, action }) =>
    action.type === OPERATORS.PERCENT && state.operatorPressedBefore === true,
  handle: ({ state, action }) => {
    return calc({ ...state, currentOperator: action.type });
  },
};

const handleReducePercentSingleNumber = {
  name: "Percent pressed after single number entered",
  condition: ({ state, action }) =>
    action.type === OPERATORS.PERCENT && state.operatorPressedBefore === false,
  handle: ({ state }) => {
    return {
      ...state,
      acc: 0,
      display: "0",
      currentOperator: undefined,
      displayMem: "0",
    };
  },
};

const handleReduceEqualsErrorDisplayed = {
  name: "Equals pressed after error displayed",
  condition: ({ state, action }) =>
    action.type === OPERATORS.EQUALS && state.display === ERRORS.DIV_ZERO,
  handle: () => {
    return DEFAULT_STATE;
  },
};

const handleReduceEquals = {
  name: "Equals pressed",
  condition: ({ action }) => action.type === OPERATORS.EQUALS,
  handle: () => {
    const calcedState = calcEquals(state);
    const stateWithEqualsAdded = addEqualsToDisplayMem(calcedState);
    return stateWithEqualsAdded;
  },
};

//изменение состояния приложения
const reducer = ({ state, action }) => {
  console.log("Action:", action);

  const foundHandler = [
    handleReduceNumberJustPressedOperatorAfterDivisionByZero,
    handleReduceNumberJustPressedOperator,
    handleReduceNumber,
    handleReduceNumberDot,
    handleReduceNumberPM,
    handleReduceClear,
    handleReduceCancelEntryErrorDisplayed,
    handleReduceCancelEntry,
    handleReduceBackSpaceErrorDisplayed,
    handleReduceBackSpace,
    handleReduceOperatorPressedFirsTime,
    handleReduceOperatorPressedNotFirsTime,
    handleReduceFracSquaredSquareRoot,
    handleReducePercentAfterOperator,
    handleReducePercentSingleNumber,
    handleReduceEqualsErrorDisplayed,
    handleReduceEquals,
  ].find((handler) => handler.condition({ state, action }));

  console.log(
    "Reducer handler triggered: ",
    foundHandler ? foundHandler.name : "none"
  );

  return foundHandler ? foundHandler.handle({ state, action }) : state;
};

render(state); //отображение на дисплее

const containerDomElement = document.getElementById("container");
containerDomElement.addEventListener("click", (event) => {
  const getParentButton = (element) =>
    element.tagName.toUpperCase() === "BUTTON"
      ? element
      : getParentButton(element.parentElement);
  const clickedButton = getParentButton(event.target);
  if (clickedButton.disabled) {
    return;
  }
  //обновляем состояние приложения
  state = reducer({
    state,
    action: clickedButton.dataset,
  });
  console.log("State:", state);
  render(state); //отображение на дисплее
  //localStorage.setItem('state', JSON.stringify(state));
});
