
const $requestModal = $('.js-modal-request');
const $policyModal = $('.js-modal-policy');
const $feedbackModal = $('.js-modal-feedback');
const $thanksRequestkModal = $('.js-modal-thanks-request');
const $thanksFeedbackModal = $('.js-modal-thanks-feedback');
const $setItem = $('.js-set-item');
const $requestForm = $('.js-form-request');
const $feedbackForm = $('.js-form-feedback');

const typeMethod = {};
typeMethod["basket-CDEK-courier"] = 4;
typeMethod["basket-CDEK"] = 3;
typeMethod["basket-rusMail-avia"] = 2;
typeMethod["basket-rusMail"] = 1;

function order($url){
    $requestModal.arcticmodal({
		beforeOpen: function(){
			$requestForm.submit(function(e) {
				e.preventDefault();
				const $currentForm = $(this);
				
				let data = {};
				for(let i=0; i<3; ++i){
					data[$currentForm[0][i].name] = $currentForm[0][i].value
				}
				data["price"] 	= Number(document.getElementById("basket-cost").innerHTML);
				data["type"] 	= typeMethod[nameMethod];
				data["city"] 	= nameCity;
				data["address"] = document.getElementById("basket__address").value;
				data["item"] 	= index;
				data["amount"] 	= Number(document.getElementById("basket__product-1").value);

				const str = JSON.stringify(data);
				
				$.ajax ({
					type: "POST",
					url: $url,
					data: str,
					success: function(data) {
						if($url==="payment_init.php") window.location.href=data.redirect;
						//ym(53095192, 'reachGoal', 'zakaz');
						$requestModal.arcticmodal('close');
						$thanksRequestkModal.arcticmodal();
						$currentForm.trigger('reset');
					},
					error: function(jqXHR, exception) {
						alert('Попробуйте в другой раз, проблема с сервером!');
					}
				});
			});
		},
		afterClose: function(){
			$requestForm.off("submit");
			
			$(".modal-request__price").css({display: "none"});
			$(".modal-request__description").css({display: "block"});
			$(".modal-request__text")[2].style.display = "none";
			$(".modal-request__text")[2].disabled = true;
			$(".modal-request__submit")[0].value = "ОСТАВИТЬ";
		}
	});

    
}

document.getElementsByClassName('basket-payment-bottom__button')[0].onclick = function(){
    if(this.innerText === "Заказать") {	
		order("call0.php");
	}
    if(this.innerText === "Оплатить"){
		$(".modal-request__price").text("Сумма: " + $("#basket-cost").text() + " р");
		$(".modal-request__price").css({display: "block"});	
		$(".modal-request__description").css({display: "none"});
		$(".modal-request__text")[2].style.display = "inline-block";
		$(".modal-request__text")[2].disabled = false;
		$(".modal-request__submit")[0].value = "ОПЛАТИТЬ";
		order("payment_init.php");
	}
};


/**
 * подтягиваем список городов ajax`ом, данные jsonp в зависмости от введённых символов
 */
$(function() {
    $("#basket__town").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "https://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
                dataType: "jsonp",
                data: {
                    q: function () { return $("#basket__town").val() },
                    name_startsWith: function () { return $("#basket__town").val() }
                },
                success: function(data) {
                    response($.map(data.geonames, function(item) {
                        return {
                            label: item.name,
                            value: item.name,
                            id: item.id
                        }
                    }));
                }
            });
        },
        minLength: 1,
        select: function(event,ui) {
            const costs = document.getElementsByClassName("basket__delivery__method-cost");
            for(let i=0; i < costs.length; ++i){
                costs[i].style.display = "none";
            }

            document.getElementById("basket-CDEK-cost").innerText = "0";
            document.getElementById("basket-CDEK-courier-cost").innerText = "0";
            document.getElementById("basket-rusMail-cost").innerText = "0";
            nameCity = ui.item.value;
			idCity = ui.item.id;
			$amount = Number(document.getElementById("basket__product-1").value);
			
			const dateFull = new Date(Date.now());
			const datePart = [ dateFull.getFullYear(), (dateFull.getMonth()+1), dateFull.getDate()];
			const date = datePart[0] + "-" +((datePart[1] < 10) ? "0" + datePart[1] : datePart[1]) 
				+ "-" + ((datePart[2] < 10) ? "0" + datePart[2] : datePart[2]);
			
            $.ajax({url: "cdek.php",
                data:{
                    receiverCityId: idCity,
                    dateExecute: date,
                    tariffId: 10,//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    idProduct: index,
					amount: $amount
                },
                success: function (data) {
                    //$("#basket-CDEK-cost").text(JSON.parse(data).result.price);
                    document.getElementById("basket-CDEK-cost").innerText =
                        (JSON.parse(data).result) ? JSON.parse(data).result.price : "-";
					document.getElementsByClassName("basket__delivery__method-cost")[1].style.display = "inline-block";
					
					
					document.getElementById("basket-rusMail-cost").innerText =
                        (JSON.parse(data).result) ? JSON.parse(data).result.price : "-";
					document.getElementsByClassName("basket__delivery__method-cost")[0].style.display = "inline-block";
                    
                    getSumAll()
                },
                error: console.error});
            $.ajax({url: "cdek.php",
                data:{
                    receiverCityId: idCity,
                    dateExecute: date,
                    tariffId: 11,///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    idProduct: index,
					amount: $amount
                },
                success: function (data) {
                    //$("#basket-CDEK-courier-cost").text(JSON.parse(data).result.price);
                    document.getElementById("basket-CDEK-courier-cost").innerText =
                        (JSON.parse(data).result) ? JSON.parse(data).result.price : "-";
                    document.getElementsByClassName("basket__delivery__method-cost")[2].style.display = "inline-block";
                    getSumAll()
                },
                error: console.error});

            $("#basket__delivery").addClass("canChecked");
        }
    });

});
