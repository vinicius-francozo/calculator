function reset() {
    display.innerText = ''
    isRestart = false
}

function calculate() {
    if (display.innerText) {
        const replaceObject = {
            '÷': '/',
            'X': '*',
        }
        function percentReplace(){
            console.log('teste')
            const lookupTokens = ['(', ')', '+', '-', 'X', '÷', '+']
            let num = ''
            for (let i = display.innerText.indexOf('%') - 1; i >= 0; i--){
                if (display.innerText[i].includes(lookupTokens)){
                    display.innerText = display.innerText.substring(0, i+1) + parseFloat(num)/100 + display.innerText(display.innerText.indexOf('%')+1)
                }
                num = display.innerText + num
            }
        }
        const textSubstring = display.innerText.substring(0)
        for (i of textSubstring){
            if (i == '%') percentReplace()
        }
        const finalValue = display.innerText.replace(/[÷X%]/g, c => replaceObject[c])
        console.log(finalValue)
        display.innerText = eval(finalValue)
        isRestart = true
    }
}

function calculatePercentage() {
    const lastNumber = display.innerText[display.innerText.length - 1]
    if (parseInt(lastNumber) > 0){
        return display.innerText += '%'
    }
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
    switch (parseInt(lastNumber)) {
        case NaN:
            if (lastNumber === undefined){
                if (parseInt(operOrNum)){
                    display.innerText += operOrNum
                } else if (operOrNum == '.'){
                    display.innerText += '0.'
                }
            } else {
                if (parseInt(operOrNum)){
                    display.innerText += operOrNum
                } else if (operOrNum != '.' && !parseInt(operOrNum)){
                    display.innerText = display.innerText.slice(0, -1) + operOrNum
                } else {
                    display.innerText += '0.'
                }
            }
            isRestart = false
            break
        default:
            if (operOrNum == '.'){
                if (display.innerText.indexOf('.') === -1){
                    display.innerText += operOrNum
                }
            } else{
                if (parseInt(operOrNum) && isRestart){
                    reset()
                }
                display.innerText += operOrNum
            }
            isRestart = false
            break
    }
}

let isRestart = false
const display = document.getElementById('display')
const resetButtonEvent = document.getElementById('calc-btn-reset').addEventListener('click', reset)
const parenthesisButtonEvent = document.getElementById('calc-btn-parenthesis').addEventListener('click', addParenthesis)
const percentageButtonEvent = document.getElementById('calc-btn-percent').addEventListener('click', calculatePercentage)
const calculateButtonEvent = document.getElementById('calc-btn-calculate').addEventListener('click', calculate)
const calcButtonEvent = document.querySelectorAll('[id="calc-btn"]').forEach((div) => div.addEventListener('click', addOperatorOrNumber))

