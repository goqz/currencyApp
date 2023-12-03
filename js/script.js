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
const currencyListDiv = document.querySelector('#currList')
const currencyListTwoDiv = document.querySelector('#currListTwo')
const errorInfo = document.querySelector('#errorInfo')

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

const getRates = () => {
    // Inputs are hidden, but check just in case
    if(!isCurrencySymbol(currTwoHidden.value)) return
    if(!isCurrencySymbol(currOneHidden.value)) return

    const URL = API_LINK + API_KEY + API_UNITS + currTwoHidden.value + API_UNITS_2 + currOneHidden.value

    axios
        .get(URL)
        .then(res => {
            if(Number.isNaN(currOneValue.value)) {
                errorInfo.textContent = 'Musisz podać poprawną kwotę'
                return
            } 
            let exchange = parseFloat(res.data.data[currTwoHidden.value])
            currTwoValue.value = Math.round(exchange * currOneValue.value * 100)/100
            errorInfo.textContent = ''
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

convert.addEventListener('click', getRates)
currOne.addEventListener('focus', () => showCurrencyList(currencyListDiv, currOne))
currTwo.addEventListener('focus', () => showCurrencyList(currencyListTwoDiv, currTwo))
currOne.addEventListener('blur', () => hideCurrencyList(currencyListDiv))
currTwo.addEventListener('blur', () => hideCurrencyList(currencyListTwoDiv))
currOne.addEventListener('input', (e) => searchInList(e, currencyList))
currTwo.addEventListener('input', (e) => searchInList(e, currencyListTwo))
currOne.addEventListener('keyup', (e) => handleKeyPress(e, currencyList, currOne, currOneHidden))
currTwo.addEventListener('keyup', (e) => handleKeyPress(e, currencyListTwo, currTwo, currTwoHidden))
currencyList.addEventListener('click', (e) => chooseCurrency(e, currencyListDiv, currOne, currOneHidden))
currencyListTwo.addEventListener('click', (e) => chooseCurrency(e, currencyListTwoDiv, currTwo, currTwoHidden))
currOneValue.addEventListener('keyup', enterCheck)