const API_KEY = '?apikey=fca_live_80ME7ceaLStuJ5qwEyDXbHwaLRz1J78Xz5Ie1H7x'
const API_LINK = 'https://api.freecurrencyapi.com/v1/latest'
const API_UNITS = '&currencies='
const API_UNITS_2 = '&base_currency='

const KEY_ENTER = 13;
const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;

const currOne = document.querySelector('#currOne')
const currTwo = document.querySelector('#currTwo')
const currOneHidden = document.querySelector('#currOneHidden')
const currTwoHidden = document.querySelector('#currTwoHidden')
const currOneValue = document.querySelector('#currOneValue')
const currTwoValue = document.querySelector('#currTwoValue')
const convert = document.querySelector('#convert')
const currencyList = document.querySelector('#currencyList')
const currencyListTwo = document.querySelector('#currencyListTwo')
const currencyListContainer = document.querySelector('#currList')
const currencyListTwoContainer = document.querySelector('#currListTwo')
const errorInfo = document.querySelector('#errorInfo')

const table = document.querySelector('#tableCurrency')
const tableValue = document.querySelector('#tableValue')
const tableCurr = document.querySelector('#tableCurr')
const currListTableCont = document.querySelector('#currListTableContainer')
const currencyListTable = document.querySelector('#currencyListTable')
const tableCurrHidden = document.querySelector('#tableCurrHidden')
const tablePush = document.querySelector('#tablePush')

const tabOne = document.querySelector('#tabLeft')
const tabTwo = document.querySelector('#tabRight')
const mainBox = document.querySelector('#converterBox')
const tableBox = document.querySelector('#tableBox')

const currencies = [
    {
        'symbol': 'EUR',
        'name' : 'Euro'
    },
    {
        'symbol': 'USD',
        'name' : 'Dolar amerykański'
    },
    {
        'symbol': 'JPY',
        'name' : 'Jen japoński'
    },
    {
        'symbol': 'BGN',
        'name' : 'Lev bułgarski'
    },
    {
        'symbol': 'CZK',
        'name' : 'Korona czeska'
    },
    {
        'symbol': 'DKK',
        'name' : 'Korona duńska'
    },
    {
        'symbol': 'GBP',
        'name' : 'Funt brytyjski'
    },
    {
        'symbol': 'HUF',
        'name' : 'Forint węgierski'
    },
    {
        'symbol': 'PLN',
        'name' : 'Polski złoty'
    },
    {
        'symbol': 'SEK',
        'name' : 'Korona szwedzka'
    },
    {
        'symbol': 'CHF',
        'name' : 'Frank szwajcarski'
    },
    {
        'symbol': 'ISK',
        'name' : 'Korona islandzka'
    },
    {
        'symbol': 'NOK',
        'name' : 'Korona norweska'
    },
    {
        'symbol': 'CAD',
        'name' : 'Dolar kanadyjski'
    },
    {
        'symbol': 'SGD',
        'name' : 'Dolar singapurski'
    },
    {
        'symbol': 'THB',
        'name' : 'Baht tajski'
    }
]

// Creating list with all currencies
const createCurrencyList = (listElement) => {
    currencies.forEach((item) => {
        let itemList = document.createElement("li")
        itemList.dataset.value = item.symbol
        itemList.textContent = `${item.name} (${item.symbol})`
        listElement.appendChild(itemList)
    })
}

createCurrencyList(currencyList)
createCurrencyList(currencyListTwo)
createCurrencyList(currencyListTable)

function isCurrencySymbol(zmienna) {
    const regex = /^[A-Z]{3}$/;
    return regex.test(zmienna);
}

const showCurrencyList = (listDiv, inputElement) => {
    inputElement.value = ''
    listDiv.style.display = 'block'
};

const hideCurrencyList = (listDiv) => {
    
    // Delay which allows usage of 'blur' so the list could disappear, when input is not active, but also can be clicked
    setTimeout(() => {
        listDiv.style.display = 'none'
    }, 200)
}

const chooseCurrency = (e, listDiv, inputElement, secondInput) => {
    hideCurrencyList(listDiv)
    inputElement.value = e.target.textContent
    secondInput.value = e.target.dataset.value
}

// Dynamic search in list of currencies
const searchInList = (e, listDiv) => {
    const searchTerm = e.target.value.toLowerCase();

    Array.from(listDiv.children).forEach(item => {
        const listItemText = item.textContent.toLowerCase();
        const isMatch = listItemText.includes(searchTerm);
        item.style.display = isMatch ? 'block' : 'none';
    });
}

// Handling arrows + enter in currency list. 
const handleKeyPress = (e, listDiv, inputElement, hiddenInput) => {
    const visibleItems = Array.from(listDiv.children).filter(item => item.style.display !== 'none')
    let currentIndex = visibleItems.findIndex(item => item.classList.contains('active'))
    const itemHeight = visibleItems.length > 0 ? visibleItems[0].offsetHeight : 0
    let scrollTo
    switch (e.keyCode) {
        case KEY_ENTER:
            if (currentIndex !== -1) {
                chooseCurrency({ target: visibleItems[currentIndex] }, listDiv.parentNode, inputElement, hiddenInput)
            }
            break
        case KEY_ARROW_UP:
            currentIndex = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1

            // Scrolling to currentIndex after every press
            scrollTo = currentIndex * itemHeight
            listDiv.parentNode.scrollTop = scrollTo
            break
        case KEY_ARROW_DOWN:
            currentIndex = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0
            
            scrollTo = currentIndex * itemHeight
            listDiv.parentNode.scrollTop = scrollTo
            break
    }
    visibleItems.forEach(item => item.classList.remove('active'))
    if (currentIndex !== -1) {
        visibleItems[currentIndex].classList.add('active')
    }
}

const getRates = (cOne, cTwo, valueOne) => {
    // Inputs are hidden, but check just in case
    if(!isCurrencySymbol(cTwo)) return
    if(!isCurrencySymbol(cOne)) return

    const URL = API_LINK + API_KEY + API_UNITS + cTwo + API_UNITS_2 + cOne

    axios
        .get(URL)
        .then(res => {
            if(Number.isNaN(valueOne)) {
                errorInfo.textContent = 'Musisz podać poprawną kwotę'
                return
            } 
            let exchange = parseFloat(res.data.data[cTwo])
            currTwoValue.value = Math.round(exchange * valueOne * 100)/100
            errorInfo.textContent = ''
        })
        .catch(error => {
            console.error('Błąd API:', error)
            errorInfo.textContent = 'Wystąpił błąd.'
        })
}

const getTable = (cOne, vOne) => {
    const URL = API_LINK + API_KEY + API_UNITS + API_UNITS_2 + cOne
    table.innerHTML = '<tr><th class="currency-symbol">Symbol</th><th class="currency-name">Waluta</th><th class="currency-value">Wartość</th></tr>'
    axios
        .get(URL)
        .then(res => {
            if(Number.isNaN(vOne)) {
                errorInfo.textContent = 'Musisz podać poprawną kwotę'
                return
            } 
            let i = 0
            Object.entries(res.data.data).forEach(item => {
                if(cOne === item[0]) {
                } else {
                    let exchange = parseFloat(item[1])
                    currencies.forEach(newItem => {
                        if(newItem['symbol'] === item[0]) {
                            let newRow = document.createElement('tr')
                            let firstColumn = document.createElement('td')
                            let secondColumn = document.createElement('td')
                            let thirdColumn = document.createElement('td')
                            i % 2 == 0 ? newRow.classList.add('second-row') :
                            firstColumn.classList.add('currency-symbol')
                            secondColumn.classList.add('currency-name')
                            thirdColumn.classList.add('currency-value')
                            firstColumn.textContent = newItem['symbol']
                            secondColumn.textContent = newItem['name']
                            thirdColumn.textContent = Math.round(exchange * vOne * 100)/100
                            newRow.append(firstColumn, secondColumn, thirdColumn)
                            table.appendChild(newRow)
                            i++
                        }
                    })
                    
                }
            });
        })
        .catch(error => {
            console.error('Błąd API:', error)
            errorInfo.textContent = 'Wystąpił błąd.'
        })
}

// Working after pressing enter while in first currency input
const enterCheck = (e) => {
    if(e.key === 'Enter') {
        getRates()
    }
}

convert.addEventListener('click', () => getRates(currOneHidden.value, currTwoHidden.value, currOneValue.value))

currOne.addEventListener('focus', () => showCurrencyList(currencyListContainer, currOne))
currTwo.addEventListener('focus', () => showCurrencyList(currencyListTwoContainer, currTwo))
currOne.addEventListener('blur', () => hideCurrencyList(currencyListContainer))
currTwo.addEventListener('blur', () => hideCurrencyList(currencyListTwoContainer))
currOne.addEventListener('input', (e) => searchInList(e, currencyList))
currTwo.addEventListener('input', (e) => searchInList(e, currencyListTwo))
currOne.addEventListener('keyup', (e) => handleKeyPress(e, currencyList, currOne, currOneHidden))
currTwo.addEventListener('keyup', (e) => handleKeyPress(e, currencyListTwo, currTwo, currTwoHidden))

tableCurr.addEventListener('focus', () => showCurrencyList(currListTableCont, tableCurr))
tableCurr.addEventListener('blur', () => hideCurrencyList(currListTableCont))
tableCurr.addEventListener('input', (e) => searchInList(e, currencyListTable))
tableCurr.addEventListener('keyup', (e) => handleKeyPress(e, currencyListTable, tableCurr, tableCurrHidden))

currencyList.addEventListener('click', (e) => chooseCurrency(e, currencyListContainer, currOne, currOneHidden))
currencyListTwo.addEventListener('click', (e) => chooseCurrency(e, currencyListTwoContainer, currTwo, currTwoHidden))
currencyListTable.addEventListener('click', (e) => chooseCurrency(e, currListTableCont, tableCurr, tableCurrHidden))

tablePush.addEventListener('click', () => getTable(tableCurrHidden.value, tableValue.value))

currOneValue.addEventListener('keyup', enterCheck)
tableValue.addEventListener('keyup', enterCheck)

tabOne.addEventListener('click', () => {
    if(tabOne.classList.contains('active-tab')) {

    } else {
        tabTwo.classList.remove('active-tab')
        tabOne.classList.add('active-tab')
        mainBox.classList.remove('hidden')
        mainBox.classList.add('block-active')
        tableBox.classList.add('hidden')
        tableBox.classList.remove('block-active')
        table.classList.add('hidden')
        table.classList.remove('table-active')
    }
})
tabTwo.addEventListener('click', () => {
    if(tabTwo.classList.contains('active-tab')) {

    } else {
        tabTwo.classList.add('active-tab')
        tabOne.classList.remove('active-tab')
        mainBox.classList.add('hidden')
        mainBox.classList.remove('block-active')
        tableBox.classList.remove('hidden')
        tableBox.classList.add('block-active')
        table.classList.remove('hidden')
        table.classList.add('table-active')
    }
})