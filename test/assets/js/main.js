(function ($) {
    'use strict';
    
    $(function () {
        // Shopify Checkout API
        var client = ShopifyBuy.buildClient({
            domain: 'amalise-beauty.myshopify.com',
            storefrontAccessToken: '0d05ae0a4cefcc3efe9b89cf6bde35b4'
        });
        
        
        // Checkout Form
        var $checkout_form = $('.checkout_form');
        
        if ( $checkout_form.length ) {
            var $address_field = $checkout_form.find('input[name="address_1"]'),
                autocomplete = new google.maps.places.Autocomplete( $address_field[0], {} );
            
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
            });
            
            
            $checkout_form.validate({
                errorPlacement: function () {
                    return;
                }
            });
            
            
            $checkout_form.steps({
                headerTag: 'h2',
                titleTemplate: '<span class="number">#index#</span> #title#',
                labels: {
                    next: 'CONTINUE',
                    finish: 'BUY NOW',
                },
                onStepChanging: function (el, i) {
                    if ( i === 1 ) {
                        return true;
                    }
                    
                    $checkout_form.validate().settings.ignore = ':disabled, :hidden';
                    return $checkout_form.valid();
                },
                onFinishing: function () {
                    $checkout_form.validate().settings.ignore = ':disabled';
                    return $checkout_form.valid();
                },
                onFinished: function () {
                    $checkout_form.addClass('working');
                    
                    client.product.fetchAll().then(function (products) {
                        products = products.filter(function (el) {
                            return el.handle === 'complete-care-pack' || el.handle === 'haitian-black-castor-oil';
                        }).map(function (el) {
                            return {
                                variantId: el.variants[0].id,
                                quantity: 1
                            };
                        });
                        
                        var $checkout_form_inputs = $checkout_form.find('input');
                        
                        client.checkout.create({
                            email: $checkout_form_inputs.filter('[name="email"]').val(),
                            lineItems: products,
                            shippingAddress: {
                                firstName: $checkout_form_inputs.filter('[name="fname"]').val(),
                                lastName: $checkout_form_inputs.filter('[name="lname"]').val(),
                                address1: $checkout_form_inputs.filter('[name="address_1"]').val(),
                                address2: $checkout_form_inputs.filter('[name="address_2"]').val(),
                                country: $checkout_form_inputs.filter('[name="country"]').val(),
                                city: $checkout_form_inputs.filter('[name="city"]').val(),
                                province: $checkout_form_inputs.filter('[name="state"]').val(),
                                zip: $checkout_form_inputs.filter('[name="zip"]').val(),
                                phone: null,
                                company: null
                            }
                        }).then(function (res) {
                            window.open( res.webUrl, '_self' );
                        }).catch(function (err) {
                            err = String( err ).slice(7);
                            err = JSON.parse( err ).map(function (el) {
                                return el.message;
                            }).join('.\n');
                            
                            alert( err );
                            $checkout_form.removeClass('working');
                        });
                    });
                }
            });
        }
        
        
        // Checkout Timer
        var checkout_timer = {
            minutes: 10,
            seconds: 0,
            $el: $('.checkout_timeout strong')
        };
        
        var interval = setInterval(function() {
            var min = checkout_timer.minutes,
                sec = checkout_timer.seconds,
                min_prefix = '';
            
            --sec;
            
            if ( sec < 0 ) {
                min = --min;
                sec = 59;
            }
            
            if ( sec < 10 ) {
                sec = '0' + sec;
            }
            
            if ( min < 10 ) {
                min_prefix = '0';
            }
            
            if ( min === 0 && sec === '00' ) {
                clearInterval( interval );
                // window.location = 'index.html';
            };
            
            checkout_timer.$el.text( min_prefix + min + ':' + sec );
            
            checkout_timer.minutes = min;
            checkout_timer.seconds = sec;
        }, 1000);
    });
}(jQuery));
