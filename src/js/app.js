(function(){

    let currentCurrencies = {};
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

        document.addEventListener("keydown", 
        //debounce(
            function(e){
                let elm = e.target;

                if(elm && elm.classList && elm.classList.contains("curr-input-text")){
                    console.log("HERE, Converting..");
                    manageConvertCurrency();
                }
            }
        //,200)
        );
    }

    async function manageConvertCurrency(){

        let value = DOM.currInputFirst.text.innerText;
        let firstType = DOM.currInputFirst.type;
        let secondType = DOM.currInputSecond.type;

        let resultElm = DOM.currInputSecond.text;

        console.log("KKK",await fetchCurrencyJSON("USD","TRY"));

    }

    async function fetchCurrencyJSON(from, to){
        return await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
        .then((resp) => resp.json())
        .then((data)=>{
            return data;
        });
    }

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