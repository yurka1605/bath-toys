/*
    валидация counter

    ??? counter item ???
*/

const sizeMobile = 1250;


function getCostProducts(){
    function getCostProduct(id, price){
        const result = Number(document.getElementById(id).value) * price;

        document.getElementById(id + '-sum').innerText = result;

        return result;
    }

    let result =0;
    for(let i=0; i < idProductsAndPrice.length; ++i){
        result += getCostProduct(idProductsAndPrice[i].id,
            idProductsAndPrice[i].price)
    }

    document.getElementById('sum-items').innerText = result;

    return result
}
function changeProduct(id, step){
    const el = document.getElementById(id);
    if(Number(el.value) + step < 1){
        return;
    }
    el.value = Number(el.value) + step;
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(nameCity){
		const costs = document.getElementsByClassName("basket__delivery__method-cost");
		for(let i=0; i < costs.length; ++i){
			costs[i].style.display = "none";
		}

		document.getElementById("basket-CDEK-cost").innerText = "0";
		document.getElementById("basket-CDEK-courier-cost").innerText = "0";
		document.getElementById("basket-rusMail-cost").innerText = "0";

		let $amount = Number(document.getElementById("basket__product-1").value);
		
		$.ajax({url: "cdek.php",
			data:{
				receiverCityId: idCity,
				dateExecute: "2019-07-02",//new Date(Date.now()).toString(),////////////////////////////////////////////////////////////////////////////
				tariffId: 10,///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				idProduct: index,
				amount: $amount
			},
			success: function (data) {
				//$("#basket-CDEK-cost").text(JSON.parse(data).result.price);
				if ($amount === Number(document.getElementById("basket__product-1").value)){
					
					document.getElementById("basket-rusMail-cost").innerText =
                        (JSON.parse(data).result) ? JSON.parse(data).result.price : "-";
					document.getElementsByClassName("basket__delivery__method-cost")[0].style.display = "inline-block";
					
					document.getElementById("basket-CDEK-cost").innerText =
						(JSON.parse(data).result) ? JSON.parse(data).result.price : "-";
					document.getElementsByClassName("basket__delivery__method-cost")[1].style.display = "inline-block";
					getSumAll()
				}
			},
			error: (err)=>console.log(err)});
		$.ajax({url: "cdek.php",
			data:{
				receiverCityId: idCity,
				dateExecute: "2019-07-02",//new Date(Date.now()).toString(),////////////////////////////////////////////////////////////////////////////
				tariffId: 11,///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				idProduct: index,
				amount: $amount
			},
			success: function (data) {
				//$("#basket-CDEK-courier-cost").text(JSON.parse(data).result.price);
				if ($amount === Number(document.getElementById("basket__product-1").value)){
					document.getElementById("basket-CDEK-courier-cost").innerText =
						(JSON.parse(data).result) ? JSON.parse(data).result.price : "-";
					document.getElementsByClassName("basket__delivery__method-cost")[2].style.display = "inline-block";
					getSumAll()
				}
			},
			error: (err)=>console.log(err)});
	} else getSumAll()
	
	changeProducts();
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
function changeProducts(){
	let result = 0;
	for(let i=0, len=idProductsAndPrice.length; i < len; ++i){
		result += Number(document.getElementById(idProductsAndPrice[i].id).value);
	}
	document.getElementById("basket__products").innerText = result + " товара";
}

function getCostDelivery(){
    return (nameMethod === "")? 0:
        Number(document.getElementById(nameMethod + "-cost").innerText);
}
function changeDelivery(id){
    if(!document.getElementsByClassName("canChecked")[0]){
        return;
    }

    document.getElementsByClassName("basket__delivery")[0].style.borderRadius = "10px 10px 0 0";
    document.getElementsByClassName("basket__delivery__address")[0].style.display = "block";

    document.getElementsByClassName("basket__headline")[1].style.display = "block";
    document.getElementsByClassName("basket-payment")[0].style.display = "block";
    document.getElementsByClassName("basket-payment-bottom")[0].style.display = "block";

    if(nameMethod !== ""){
        document.getElementById(nameMethod).classList.remove('basket__delivery__method-checked');
    }

    if(id === "basket-CDEK-courier" || id === "basket-rusMail" || id === "basket-rusMail-avia"){
        const  text = document.getElementById("basket__delivery__method-text");
        text.innerHTML          = "Адрес доставки:";
        text.style.width        = "";

        document.getElementById("basket__address").style.display = "inline-block";
    } else{
        document.getElementById("basket__address").style.display = "none";

        const  text = document.getElementById("basket__delivery__method-text");
        text.style.width        = "100%";
        text.innerHTML          = "Адрес филиала: Менеджер согласует с вами самый удобный филиал для получения посылки";
    }

    document.getElementById("basket-result__checked__delivery").classList.add("basket-result__checked");

    document.getElementById(id).classList.add('basket__delivery__method-checked');
    document.getElementById("basket-result__checked__payment").classList.add("basket-result__checked");
    nameMethod = id;

    getSumAll();
    var scrollStart = window.scrollY;
    var to = $('#basket__delivery__method-text').offset();
    var distance = to.top-50 - scrollStart;
    var distancePerMSec = distance/100;
    console.log(to.top, distance, distancePerMSec);
    function scrollTop(i){
        if(i<100){
            window.scrollTo(0, scrollStart + distancePerMSec*i);
            console.log('Вызвали!')
            setTimeout(scrollTop, 1, i+1);
        }
    }
    scrollTop(0);
}


function getSumAll(){
    let result = getCostProducts();
    result += getCostDelivery();

    // document.getElementById("basket__payment__1").innerText = Math.round(result * 0.04);
    // result += getPayment();

    document.getElementById('basket-cost').innerText = result;
    document.getElementById('basket-payment-bottom__result').innerText = result + " р";

    return result
}

const scrollFunction = function(){
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollTop > 230 && window.innerWidth > sizeMobile) {
        document.getElementsByClassName("basket__result")[0].classList.add("basket__fixed");
    } else {
        document.getElementsByClassName("basket__result")[0].classList.remove("basket__fixed");
    }
};
document.onscroll   = scrollFunction;
window.onresize     = scrollFunction;
window.onload       = scrollFunction;

function getPayment() {
    if(idPayment === "basket-payment-1" ) {
        return Number(document.getElementById("basket__payment__1").innerText)
    }
    return 0
}
function changePayment(id) {
    if(idPayment !== ""){
        document.getElementById(idPayment).classList.remove("basket-payment__checked");
    }
    document.getElementById(id).classList.add("basket-payment__checked");
    idPayment = id;

    const buttons = document.getElementsByClassName("basket-payment-bottom__button");
    for(let i=0;i < buttons.length; ++i) {
        buttons[i].style.display = "block";
        buttons[i].innerText = (id === "basket-payment-1") ? "Заказать" : "Оплатить";
    }



    getSumAll();
}
