var fio = {};
var address_full = {}
$("#fio-input").suggestions({
    token: "6d1b40168325a08eb44518ce5a82996a55a1f26a",
    type: "NAME",
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function(suggestion) {
        fio.name = suggestion.data.name;
        fio.surName = suggestion.data.surname;
        fio.secondName = suggestion.data.patronymic;
        fio.string = suggestion.value;
        fio.gender = suggestion.data.gender;
    }
});
$("#address-input").suggestions({
    token: "6d1b40168325a08eb44518ce5a82996a55a1f26a",
    type: "ADDRESS",
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function(suggestion) {
        address_full.postalCode = suggestion.data.postal_code;
        address_full.address = suggestion.value;
        address_full.city_kladr = suggestion.data.city_kladr_id;
        console.log(address_full);
    }
});


$(function() {

    const $requestModal = $('.js-modal-request');
    const $policyModal = $('.js-modal-policy');
    const $feedbackModal = $('.js-modal-feedback');
    const $thanksRequestkModal = $('.js-modal-thanks-request');
    const $thanksFeedbackModal = $('.js-modal-thanks-feedback');
    const $setItem = $('.js-set-item');
    const $requestForm = $('.js-form-request');
    const $feedbackForm = $('.js-form-feedback');

    /* галерея */

    $('.js-gallery').each(function(i,el) {
        $(el).lightGallery({
            thumbnail : true
        }); 
    });

    /* табы */ 

    $('.js-tabs').each(function(i, el) { 

        const $tab = $(el).find('.js-tab');
        const $buttonTab = $(el).find('.js-tab-min');
        
        $buttonTab.off('tab').on('click.tab', function(){
            
            let data = $(this).data('tab');
            let $element = $tab.filter('[data-tab=' + data +']');
            $tab.not($element).addClass('hiden');
            $element.removeClass('hiden');

        });
    });

    // fancybox 
    $('[data-fancybox]:not(.slick-cloned)').fancybox({
        afterClose : function(){
            reloadSlider();
            $('body').removeClass('fancybox-active');
            $('body').removeClass('compensate-for-scrollbar');
            return true;
        }
    });

    /* слайдер отзывов */
    reloadSlider();
    function reloadSlider() {
        $('.js-feedback-slider').each(function(i, el) {

            const $slider = $(el).find('.js-feedback-slider-items');
            const $sliderPrev = $(el).find('.js-prev');
            const $sliderNext = $(el).find('.js-next');
    
            $slider.slick({
                draggable: false,
                centerMode: true,
                infinite: true,
                nextArrow: $sliderNext,
                prevArrow: $sliderPrev,
                cssEase: 'linear',
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                      breakpoint: 768,
                      settings: {
                        arrows: false,
                        slidesToShow: 1
                      }
                    }
                ]
            });
        });
    }

    /* контейнер для видео */
    //
    // $('.js-video').each(function(i, el) {
    //     $(el).off('video').on('click.video', function() {
    //         $(this).fadeOut();
    //     });
    // });

    /* мобильная навигация */

    $('.js-header').each(function(i,el) {

        $button = $(el).find('.js-burger');
        $nav = $(el).find('.js-nav-mobile');

        $button.off('button').on('click.button', function(){
            $(this).toggleClass('is-active');
            $nav.toggleClass('showed-nav');
            $('.wrapper').toggleClass('nav-open');
        });
    });

    /* анимация */ 

    function afterReveal (el) {
        if ($(el).hasClass('deliver__item')) {
            $(el).on('animationend', function () {
                $(this).addClass('finishStepAnimate');
            });
        }
    }
    
    new WOW({ callback: afterReveal }).init();

    /* маска для ввода телефона */

    $('.js-tel').each(function(i,el) {
        $(el).mask("+7(999) 999-9999");
    });

    /* модальные окна */

    $('.js-request').each(function(i,el) {
        $(this).off('modalRequest').on('click.modalRequest', function(){
            $requestModal.arcticmodal({
				beforeOpen: function(){
					$requestForm.submit(function(e) {
						e.preventDefault();
						const $currentForm = $(this);
						
						let data = {};
						for(let i=0; i<3; ++i){
							data[$currentForm[0][i].name] = $currentForm[0][i].value
						}
						data["phone"] = data["tel"];
						var _phone = data["phone"];
                        var _name = data["name"];
                        data.form = $currentForm.serialize();
                        var info = {
                            fio: fio,
                            address_full: address_full
                        };
						const str = JSON.stringify(data);//$currentForm.serialize();
                        var form = $(this).serialize();
                        form = form + "&info=" + JSON.stringify(info);
                        $currentForm.find(".modal-request__submit").prop("disabled", true);
                        // console.log(JSON.stringify(info))
						$.ajax ({
							type: "POST",
							url: "mail.php",//"http://bath-toys.ru/call.php",
							data: form,
							success: function(data) {
                                fbq('track', 'Lead');
								ym(53095192, 'reachGoal', 'zakaz');
                                console.log(data);
                                $currentForm.find(".modal-request__submit").prop("disabled", false);
								$requestModal.arcticmodal('close');
								$thanksRequestkModal.arcticmodal();
								$currentForm.trigger('reset');
                                // window.location.replace('/payment.php?phone='+_phone.replace(/[\s\(\)\+\-]/g, '')+"&name="+_name)

							},
							error: function(jqXHR, exception) {
								alert('Попробуйте повторить позже, проблема с сервером!');
								console.log(jqXHR);
								console.log(exception);
							}
						});
					});
				},
                afterClose: function(){
                    $requestForm.off("submit");
                }
            });
        });
    });

    $('.js-policy').each(function(i,el) {
        $(this).off('modalPolicy').on('click.modalPolicy', function(){
            $policyModal.arcticmodal();
        })
    });

    $('.js-feedback').each(function(i,el) {
        $(this).off('modalFeedback').on('click.modalFeedback', function(){
            $feedbackModal.arcticmodal();

            $feedbackForm.submit(function(e) {
                e.preventDefault();
                const $currentForm = $(this);
                $feedbackModal.arcticmodal('close');
                $thanksFeedbackModal.arcticmodal();
                $currentForm.trigger('reset');
            });
        })
    });

    /* изменение инпута при выборе файла */ 

    $('.js-file').each(function(i, el){
        $(el).change(function(){
            $(this).parent().addClass('choosen');
        });
    });

    /* якоря */

    $('.js-link').each(function(i,el){
        $(el).off('link').on('click.link', function(event){
            event.preventDefault();
            let $currentId = $(this).attr('id');
            let $currentBlock = $('.' + $currentId);
            
            $('.js-nav-mobile').removeClass('showed-nav');
            $('.js-burger').removeClass('is-active');
            $('.wrapper').removeClass('nav-open');
            $('html,body').stop().delay(300).animate({ scrollTop: $currentBlock.offset().top }, 2000);
        });
    });

    /* высота слайдера наборов */

    function setHeight () {
        let height = $setItem.innerHeight();
        $setItem.parent().parent().css({
            'height': height,
        })
    }

    setHeight();

    window.setTimeout(function(){
        setHeight();
      }, 1500);

    $(window).resize(function(){
        setHeight();
    });
});