function keyboardFocus(){
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(display.childNodes[display.childNodes.length - 1], display.childNodes[display.childNodes.length - 1].textContent.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function validateKeyboard(event) {
    if (!calculateSize()) event.preventDefault()
    const keyCode = event.keyCode || event.which;
    const allowedKeys = [8, 9, 13, 37, 39, 37, 46, 40, 41, 42, 43, 47, 45]; 
    if ((keyCode < 48 || keyCode > 57) && allowedKeys.indexOf(keyCode) === -1){
        event.preventDefault();
    } else if (keyCode === 37) {
        event.preventDefault()
        calculatePercentage()
        keyboardFocus()
    } else if ((keyCode > 47 && keyCode < 58) || [42, 45, 43, 47].includes(keyCode) ){
        event.preventDefault()
        addOperatorOrNumber(event.key)
        keyboardFocus()
        isContinuousCalc = false
    } else if (keyCode === 13){
        event.preventDefault()
        calculate()
        return keyboardFocus()
    } else if ([40, 41].includes(keyCode)){
        event.preventDefault()
        addParenthesis()
        keyboardFocus()
    }
    if (display.innerText) eraseButton.classList.remove('d-none')
    isContinuousCalc = false
}

function erase() {
    display.innerText = display.innerText.slice(0, -1)
    displayContainer.classList.remove('border', 'border-danger')
}

function reset() {
    display.innerText = ''
    isRestart = false
    displayContainer.classList.remove('border', 'border-danger')
    eraseButton.classList.add('d-none')
    isContinuousCalc = false
}

function calculateSize() {
    if (display.innerText.length <= 13) return true
    displayContainer.classList.add('border', 'border-danger')
    return false
}

function calculate() {
    if (display.innerText) {
        const replaceObject = {
            '÷': '/',
            'X': '*',
            '%': '/100'
        }
        const finalValue = display.innerText.replace(/[÷X%]/g, c => replaceObject[c])

        if (!isContinuousCalc){
            lastOperation = ''
            for (index = display.innerText.length - 1; index>=0; index--){
                lastOperation = finalValue[index] + lastOperation
                if (lookupTokens.includes(finalValue[index])) break
            }
        }
        
        if (isContinuousCalc && display.innerText) {
            display.innerText = eval(display.innerText + lastOperation)
            if (!calculateSize()) {
                display.innerText = 'Conta muito grande'
                displayContainer.classList.add('border', 'border-danger')    
            }
            return
        }
        try {
            for (index of display.innerText.split('')){
                if (lookupTokens.includes(index)) isContinuousCalc = true
            }

            display.innerText = eval(finalValue)
            if (!calculateSize()) {
                display.innerText = 'Conta muito grande'
                displayContainer.classList.add('border', 'border-danger')
                return    
            }
            displayContainer.classList.remove('border', 'border-danger')
        } catch {
            displayContainer.classList.add('border', 'border-danger')
        }
        isRestart = true
    }
}

function calculatePercentage() {
    if (!calculateSize()) return
    const lastNumber = display.innerText[display.innerText.length - 1]
    if (parseInt(lastNumber) || lastNumber === '0' || lastNumber === ')'){
        isContinuousCalc = false
        return display.innerText += '%'
    }
    displayContainer.classList.add('border', 'border-danger')
}

function addParenthesis() {
    if (isRestart){
        reset()
    }
    const lastNumber = display.innerText[display.innerText.length - 1]

    const openParenthesisCount = (display.innerText.match(/\(/g) || []).length
    const closeParenthesisCount = (display.innerText.match(/\)/g) || []).length

    function parenthesisAddFunc(){
        const parenthesisCalc = openParenthesisCount - closeParenthesisCount
        if (parenthesisCalc > 0){
            return ')'
        } else {
            return 'X('
        }
    }
    
    if (!calculateSize()) return

    displayContainer.classList.remove('border', 'border-danger')
    eraseButton.classList.remove('d-none')
    isContinuousCalc = false
    switch (lastNumber) {
        case undefined:
            display.innerText += '('
            break
        case '%':
            display.innerText += parenthesisAddFunc()
            break
        case '(':
            display.innerText += '('
            break
        case ')':
            display.innerText += parenthesisAddFunc()
            break
        case '÷':
            display.innerText += '('
            break
        case 'X':
            display.innerText += '('
            break
        case '-':
            display.innerText += '('
            break
        case '+':
            display.innerText += '('
            break
        default:
            display.innerText += parenthesisAddFunc()
    }
    isRestart = false
}

function addOperatorOrNumber(eventOrValue) {
    if (!calculateSize()) return
    const operOrNum = eventOrValue.target?.attributes['data-target'].value || eventOrValue
    const lastNumber = display.innerText[display.innerText.length - 1]

    function canInsertComma() {
        let commaCount = 0
        for (index of display.innerText){
            if (index === '.') commaCount++
            if (lookupTokens.includes(index)){
                commaCount = 0
            }
        }
        if (commaCount === 0) return true
        return false
    }
    displayContainer.classList.remove('border', 'border-danger')
    eraseButton.classList.remove('d-none')
    isContinuousCalc = false

    if (lastNumber === undefined){
        if (parseInt(operOrNum) || operOrNum === '0'){
            display.innerText += operOrNum
        } else if (operOrNum == '.' && canInsertComma()){
            display.innerText += '0.'
        }
        isRestart = false
    } else{
        if (!parseInt(lastNumber) && lastNumber !== '0'){
            if (parseInt(operOrNum) || operOrNum === '0'){
                if (lastNumber === ')' || lastNumber === '%'){
                    display.innerText += `X${operOrNum}`
                } else {
                    display.innerText += operOrNum
                }
            } else if (operOrNum != '.' && !parseInt(operOrNum) && operOrNum !== '0'){
                if (['(', ')'].includes(lastNumber)){
                    display.innerText += operOrNum
                } else {
                    display.innerText = display.innerText.slice(0, -1) + operOrNum
                }
            } else {
                if (canInsertComma()) display.innerText += '0.'
            }
        } else {
            if (operOrNum == '.'){
                if (canInsertComma()) display.innerText += operOrNum
            } else{
                if ((parseInt(operOrNum) || operOrNum === '0') && isRestart){
                    reset()
                }
                display.innerText += operOrNum
            }
        }
        isRestart = false
    }
}

let isRestart = false
let isContinuousCalc = false
let lastOperation = ''
const lookupTokens = ['(', ')', '+', '-', 'X', '÷', '+', '%', '*', '/']
const eraseButton = document.getElementById('erase')
const displayContainer = document.getElementById('displayContainer')
const display = document.getElementById('display')
const displayFocus = document.getElementById('display').focus()
const documentKeydownEvent = document.addEventListener('keydown', () => {display.focus()})
const displayKeypressEvent = document.getElementById('display').addEventListener('keypress', validateKeyboard)
const eraseButtonEvent = document.getElementById('erase').addEventListener('click', erase)
const resetButtonEvent = document.getElementById('calc-btn-reset').addEventListener('click', reset)
const parenthesisButtonEvent = document.getElementById('calc-btn-parenthesis').addEventListener('click', addParenthesis)
const percentageButtonEvent = document.getElementById('calc-btn-percent').addEventListener('click', calculatePercentage)
const calculateButtonEvent = document.getElementById('calc-btn-calculate').addEventListener('click', calculate)
const calcButtonEvent = document.querySelectorAll('[id="calc-btn"]').forEach((div) => div.addEventListener('click', addOperatorOrNumber))

