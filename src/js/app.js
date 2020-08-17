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
        currResultFirst:{
            value:document.getElementById("curr-result_first-curr-value"),
            typeName:document.getElementById("curr-result_first-curr-name"),
        },
        currResultSecond:{
            value:document.getElementById("curr-result_second-curr-value"),
            typeName:document.getElementById("curr-result_second-curr-name"),
        }
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

        let firstTypeName = DOM.currInputFirst.type.options[DOM.currInputFirst.type.selectedIndex].innerText.split("-")[1].trim();
        let secondTypeName = DOM.currInputSecond.type.options[DOM.currInputSecond.type.selectedIndex].innerText.split("-")[1].trim();

        // Check does currency data exists.
        if(currentCurrencies[firstType+"-"+secondType]){

            console.log("Var 1");
            let currEx = currentCurrencies[firstType+"-"+secondType];

            let calcedCurr = Number(currEx * value);

            writeCurrResult({
                firstCurr:{
                    value:value,
                    name:firstTypeName,
                },
                secondCurr:{
                    value:calcedCurr,
                    name:secondTypeName,
                },
            });
        
        // If inverse currency exist
        }else if(currentCurrencies[secondType+"-"+firstType]){

            console.log("Var 2");
            let currEx = currentCurrencies[secondType+"-"+firstType];

            let calcedCurr = Number((1 / currEx) * value);

            writeCurrResult({
                firstCurr:{
                    value:value,
                    name:firstTypeName,
                },
                secondCurr:{
                    value:calcedCurr,
                    name:secondTypeName,
                },
            });

        }else{
            console.log("Yok 3");

            let currData = await fetchCurrencyJSON(firstType, secondType);
            
            let currEx = currData.rates[secondType];

            // Save currency data
            currentCurrencies[firstType+"-"+secondType] = currEx;

            let calcedCurr = Number(currEx * value);

            writeCurrResult({
                firstCurr:{
                    value:value,
                    name:firstTypeName,
                },
                secondCurr:{
                    value:calcedCurr,
                    name:secondTypeName,
                },
            });
            
        }

    }

    /**
     * 
     * @param {object} data;
     * @param {object} data.firstCurr;
     * @param {number} data.firstCurr.value Ex: 123.30;
     * @param {string} data.firstCurr.name Ex: United States Dollar;
     * @param {object} data.secondCurr;
     * @param {number} data.secondCurr.value;
     * @param {string} data.secondCurr.name;
     */
    function writeCurrResult(data){
        // Write to second input box
        console.log(data);
        DOM.currInputSecond.text.value = data.secondCurr.value.toFixed(2);

        console.log(DOM);

        DOM.currResultFirst.value.innerText = data.firstCurr.value.toLocaleString("en-US");
        DOM.currResultFirst.typeName.innerText = data.firstCurr.name;

        DOM.currResultSecond.value.innerText = data.secondCurr.value.toLocaleString("en-US");
        DOM.currResultSecond.typeName.innerText = data.secondCurr.name;

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