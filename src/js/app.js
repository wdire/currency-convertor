(function(){

    // Store all currencies thus don't need to fetch currency all the time.
    let currentCurrencies = {
        //"USD-TRY":7.36
    };

    const DOM = {
        currInputFirst:{
            text:document.getElementById("curr-input-first-text"),
            type:document.getElementById("curr-input-first-type")
        },
        currInputSecond:{
            text:document.getElementById("curr-input-second-text"),
            type:document.getElementById("curr-input-second-type")
        },
    };

    /**for(const [key, value] of Object.entries(all)){
        console.log(`<option value="${key}">${key} - ${value}</option>`);
    }*/

    init();

    async function init(){

        document.getElementById("curr-swap").addEventListener("click", function(e){
            swapCurrencies();
        });

        document.addEventListener("keyup", 
            function(e){
                let elm = e.target;

                // If pressed any key on text inputs, convert currency.
                if(elm && elm.classList && elm.classList.contains("curr-input-text")){
                    manageConvertCurrency();
                }
            }
        );
        manageConvertCurrency();
    }

    function swapCurrencies(){
        let tmp = DOM.currInputFirst.type.value
        DOM.currInputFirst.type.value = DOM.currInputSecond.type.value;
        DOM.currInputSecond.type.value = tmp;
        manageConvertCurrency();
    }

    async function manageConvertCurrency(){

        let value = DOM.currInputFirst.text.value;
        let firstType = DOM.currInputFirst.type.value;
        let secondType = DOM.currInputSecond.type.value;

        let resultElm = DOM.currInputSecond.text;

        // Check does currency data exists.
        if(currentCurrencies[firstType+"-"+secondType]){

            console.log("Var 1", currentCurrencies[firstType+"-"+secondType]);
            let currEx = currentCurrencies[firstType+"-"+secondType];

            let calcedCurr = (currEx * value).toFixed(2);
            resultElm.value = calcedCurr;

        }else if(currentCurrencies[secondType+"-"+firstType]){

            console.log("Var 2", currentCurrencies[secondType+"-"+firstType]);
            let currEx = currentCurrencies[secondType+"-"+firstType];

            let calcedCurr = ( (1 / currEx) * value).toFixed(2);
            resultElm.value = calcedCurr;

        }else{
            console.log("Yok 3");

            let currData = await fetchCurrencyJSON(firstType, secondType);
            
            let currEx = currData.rates[secondType];

            currentCurrencies[firstType+"-"+secondType] = currEx;

            let calcedCurr = (currEx * value).toFixed(2);
            resultElm.value = calcedCurr;
        }

    }

    // Return's currency data as JSON.
    async function fetchCurrencyJSON(from, to){
        return await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
        .then((resp) => resp.json())
        .then((data)=>{
            return data;
        });
    }

    // Originally taken from Trey Huffine - https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
    function debounce (func, wait){
        let timeout;
      
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
      
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };

})();