function erase() {
    display.innerText = display.innerText.slice(0, -1)
}

function reset() {
    display.innerText = ''
    isRestart = false
    displayContainer.classList.remove('border', 'border-danger')
    eraseButton.classList.add('d-none')
}

function calculate() {
    if (display.innerText) {
        const replaceObject = {
            '÷': '/',
            'X': '*',
            '%': '/100'
        }
        const finalValue = display.innerText.replace(/[÷X%]/g, c => replaceObject[c])
        try {
            display.innerText = eval(finalValue)
        } catch {
            displayContainer.classList.add('border', 'border-danger')
        }
        isRestart = true
    }
}

function calculatePercentage() {
    const lastNumber = display.innerText[display.innerText.length - 1]
    if (parseInt(lastNumber) || lastNumber === '0' || lastNumber === ')'){
        return display.innerText += '%'
    }
    displayContainer.classList.add('border', 'border-danger')
}

function addParenthesis() {
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
    if (isRestart){
        reset()
    }
    displayContainer.classList.remove('border', 'border-danger')
    eraseButton.classList.remove('d-none')
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

function addOperatorOrNumber(event) {
    const operOrNum = event.target.attributes['data-target'].value
    const lastNumber = display.innerText[display.innerText.length - 1]

    function canInsertComma() {
        let commaCount = 0
        const lookupTokens = ['(', ')', '+', '-', 'X', '÷', '+', '%']
        for (i of display.innerText){
            if (i === '.') commaCount++
            if (lookupTokens.includes(i)){
                commaCount = 0
            }
        }
        if (commaCount === 0) return true
        return false
    }
    displayContainer.classList.remove('border', 'border-danger')
    eraseButton.classList.remove('d-none')

    switch (lastNumber) {
        case undefined:
            if (parseInt(operOrNum)){
                display.innerText += operOrNum
            } else if (operOrNum == '.'){
                if (canInsertComma()) display.innerText += '0.'
            }
            isRestart = false
            break
        default:
            if (!parseInt(lastNumber)){
                if (parseInt(operOrNum)){
                    display.innerText += operOrNum
                } else if (operOrNum != '.' && !parseInt(operOrNum)){
                    display.innerText = display.innerText.slice(0, -1) + operOrNum
                } else {
                    display.innerText += '0.'
                }
            } else {
                if (operOrNum == '.'){
                    if (canInsertComma()){
                        display.innerText += operOrNum
                    }
                } else{
                    if (parseInt(operOrNum) && isRestart){
                        reset()
                    }
                    if (lastNumber === ')' || lastNumber === '%'){
                        display.innerText += `X${operOrNum}`
                    } else {
                        display.innerText += operOrNum
                    }
                }
            }
            isRestart = false
            break
    }
}

let isRestart = false
const eraseButton = document.getElementById('erase')
const displayContainer = document.getElementById('displayContainer')
const display = document.getElementById('display')
const eraseButtonEvent = document.getElementById('erase').addEventListener('click', erase)
const resetButtonEvent = document.getElementById('calc-btn-reset').addEventListener('click', reset)
const parenthesisButtonEvent = document.getElementById('calc-btn-parenthesis').addEventListener('click', addParenthesis)
const percentageButtonEvent = document.getElementById('calc-btn-percent').addEventListener('click', calculatePercentage)
const calculateButtonEvent = document.getElementById('calc-btn-calculate').addEventListener('click', calculate)
const calcButtonEvent = document.querySelectorAll('[id="calc-btn"]').forEach((div) => div.addEventListener('click', addOperatorOrNumber))

