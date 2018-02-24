(function(){

    'use strict';

    $(function() {

        var checkDeviceOrientation = function() {

            // Find matches
            var mql = window.matchMedia('(orientation: portrait)');
            var noticeContent = '<div class="rotate-to-landscape"><div class="rotate-to-landscape-container"><svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 68.13 68.33"><g transform="translate(-18.36 -20.67)" fill="#808284"><path d="M78 55H54.5v4H78c.27 0 .51.11.7.29.19.2.3.44.3.71v24c0 .27-.11.51-.3.71-.19.18-.43.29-.7.29H54.17c-.5 1.65-1.56 3.05-2.95 4H78c2.76-.01 4.99-2.24 5-5V60c-.01-2.76-2.24-4.99-5-5z"/><path d="M54.33 82.81l-.01.19h22.49V61H54.33v21.81M52.36 28.35c-.01-2.76-2.24-4.99-5-5h-24c-2.76.01-4.99 2.24-5 5v54.8c.01 2.76 2.24 4.99 5 5h24c2.76-.01 4.99-2.24 5-5v-54.8zm-4.29 55.51c-.19.19-.43.29-.7.3h-24c-.27 0-.51-.11-.7-.3-.19-.19-.29-.43-.3-.7v-54.8c0-.27.11-.51.3-.71.19-.19.43-.29.7-.29h24c.27 0 .51.11.7.29.19.19.29.43.3.71v54.8c-.01.27-.12.51-.3.7z"/><path d="M24.36 29.54h22v44h-22z"/><circle cx="35.36" cy="78.54" r="3"/><path d="M62.99 29.98c-.45-.43-.58-.51-.84-.73 4.12.5 7.81 2.37 10.6 5.16 2.8 2.8 4.67 6.51 5.16 10.66-.19-.21-.35-.39-.74-.78-1.42-1.46-3.9.15-3.9.15l6.89 7.12 6.33-7.63s-2.59-1.41-3.9.15c-.39.46-.47.6-.65.85-1.07-10.36-9.28-18.59-19.64-19.69.21-.17.4-.32.8-.67 1.53-1.34.08-3.9.08-3.9l-7.51 6.47 7.26 6.75c-.01-.01 1.54-2.52.06-3.91z"/></g></svg><p>Please Rotate Your Device To Access The Website.</p></div></div>';

            // If there are matches, we're in portrait
            if(mql.matches) {
            	// Portrait orientation
                $('body').prepend(noticeContent);
            }

            // Add a media query change listener
            mql.addListener(function(m) {
            	if(m.matches) {
            		// Changed to portrait
                    if ($('.rotate-to-landscape').length <= 0) {
                        $('body').prepend(noticeContent);
                    }
                    $('.rotate-to-landscape').show();
            	}
            	else {
            		// Changed to landscape
                    $('.rotate-to-landscape').hide();
                    location.reload(true);
            	}
            });
        };

        var bsScrollSpy = function() {
            $('[data-spy="scroll"]').each(function () {
                $(this).scrollspy('refresh');
            });

            if(!(isMobile.any)) {
                $(window).on('activate.bs.scrollspy', function (e) {
                    history.replaceState({}, '', $('a[href^="#"]', e.target).attr('href'));
                    $(window).trigger('hashchange');
                });
            }
        };

        var homeScrollAnimation = function() {
            var controller = new ScrollMagic.Controller({
                globalSceneOptions: {
                    triggerHook: 'onLeave'
                }
            });

            // get all slides
            var slides = document.querySelectorAll('article.td-home-section');

            // create scene for every slide
            for (var i=0; i<slides.length; i++) {
                new ScrollMagic.Scene({
                    triggerElement: slides[i]
                })
                .setPin(slides[i])
                .addTo(controller);
            }

            // change behaviour of controller to animate scroll instead of jump
            controller.scrollTo(function(newpos) {
                TweenMax.to(window, 0, {scrollTo: {y: newpos}});
            });

            $(document).on('click', 'a[href^="#"]', function (e) {
                var id = $(this).attr('href');
                if ($(id).length > 0) {
                    e.preventDefault();

                    // trigger scroll
                    controller.scrollTo(id);
                }
            });
        };

        var homeServicesAnimation = function() {
            $('.td-home-services-icons svg').mouseover(function() {
                var $t = $(this).parent();
                var serviceTitle = $t.children('h2').text();
                var sectionBody = $t.closest('.td-home-section-body');
                if($t.hasClass('active-item')) {
                	return false;
                }
                sectionBody.find('.td-home-services-icons div.active-item').removeClass('active-item');
                sectionBody.find('.td-home-services-body div.active-item').fadeOut('normal');
                $t.addClass('active-item');
                sectionBody.find('.td-home-services-body div.active-item').promise().done(function() {
                    $(this).removeClass('active-item');
                    $('.td-home-services-body').find('[data-title = "' + serviceTitle + '"]').addClass('active-item').fadeIn('normal');
                });
            });
        };

        var contactFormAJAX = function() {
            var $contactForm = $('#contact-form');
            $contactForm.submit(function(e) {
                e.preventDefault();
                $.ajax({
                    url: '//formspree.io/nikita@thedesignery.in',
                    method: 'POST',
                    data: $(this).serialize(),
                    dataType: 'json',
                    beforeSend: function() {
                        $contactForm.find('.alert').remove();
                        $contactForm.append('<div class="alert alert--loading">Sending message…</div>');
                    },
                    success: function() {
                        $contactForm.find('.alert--loading').hide();
                        $contactForm.append('<div class="alert alert--success">Message sent!</div>');
                    },
                    error: function() {
                        $contactForm.find('.alert--loading').hide();
                        $contactForm.append('<div class="alert alert--error">Oops, there was an error.</div>');
                    }
                });
            });
        };

        var portfolioMenuAnimation = function() {
            $('.td-portfolio-nav-category-group.collapse.in').prev().addClass('rotate-triangle');

            $('.td-portfolio-nav-category a').click(function() {
                $(this).parent().toggleClass('rotate-triangle');
            });

            var $portfolioList = $('#td-portfolio-nav-list');
            $portfolioList.on('show.bs.collapse', function() {
                $portfolioList.find('.collapse.in').collapse('hide').prev().removeClass('rotate-triangle');
            });
        };

        checkDeviceOrientation();
        bsScrollSpy();
        if(!(isMobile.any)) {
            homeScrollAnimation();
        }
        homeServicesAnimation();
        contactFormAJAX();
        portfolioMenuAnimation();

    });

})();
