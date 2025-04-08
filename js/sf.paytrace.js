sf.paytrace = {};

sf.paytrace.config = {
  baseEndpointUri : {
    baseUri: '', // e.g. https://rmcigarfestival.com/wp-includes/
    path: '' // e.g. endpoints/sf/
  },
  endpoints: {
    postPtProtectAuth: 'postPtProtectAuth.php',
    getPtProtectToken: 'getPtProtectToken.php'
  },
  debug: false
};

sf.paytrace.state = {
  init: false
};

sf.paytrace.forms = {
	'ui': {
		'overlay': {
			'id': ''
		}
	},
  'protect': {
    id: 'ProtectForm',
    ui: {
      'id': '',
      elements: {
        'outerContainer' : {
          'id': ''
        },
        'hpfForm' : {
          'id': 'pt_hpf_form'
        },
        'titleContainer' : {
          'id': ''
        },
        'title' : {
          'id': ''
        },
        'messageContainer' : {
          'id': ''
        },
        'message' : {
          'id': ''
        },
        'amountContainer' : {
          'id': ''
        },
        'amount' : {
          'id': ''
        },
        buttons: {
            'submit': {
              'id': '',
              'onclick': {}
            },
            'cancel': {
              'id': '',
              'onclick': {}
            },
            'finish': {
              'id': '',
              'onclick': {}
            }
        }
      }
    }
  }
};

sf.paytrace.request = {
 'payment_fields': {
    'amount': {
      'id': ''
    },
    'billing': {
      'name': {
        'id': ''
      },
      'email_address': {
        'id': ''
      },
      'phone': {
        'id': ''
      }
    },
    'billing_address' : {
        'street': {
          'id': ''
        },
        'street2': {
          'id': ''
        },
        'city': {
          'id': ''
        },
        'state': {
          'id': ''
        },
        'country': {
          'id': ''
        },
        'postal_code': {
          'id': ''
        },
        'city_state_postal_code': {
          'id': '',
          'delimiter': ','
        }
    },
    'shipping_address' : {
      'useBillingAddress': false,
      'street': {
        'id': ''
      },
      'street2': {
        'id': ''
      },
      'city': {
        'id': ''
      },
      'state': {
        'id': ''
      },
      'country': {
        'id': ''
      },
      'postal_code': {
        'id': ''
      },
      'city_state_postal_code': {
        'id': '',
        'delimiter': ','
      }
    }
  }
};

sf.paytrace.init = function() {
  sf.paytrace.state.init = true;
};

sf.paytrace.processProtectAuth = function(hpfToken, encKey, ptProtectToken) {
  if(!sf.paytrace.state.init) {
    sf.paytrace.init();
  }
  
  var url = (sf.paytrace.config.baseEndpointUri.baseUri + 
      sf.paytrace.config.baseEndpointUri.path + 
      sf.paytrace.config.endpoints.postPtProtectAuth),
    data = {},
    billingAddressParts = '',
    amount = $('#' + sf.paytrace.request.payment_fields.amount.id).val(),
    billingName = $('#' + sf.paytrace.request.payment_fields.billing.name.id).val(),
    billingEmail = $('#' + sf.paytrace.request.payment_fields.billing.email_address.id).val(),
    billingPhone = $('#' + sf.paytrace.request.payment_fields.billing.phone.id).val(),
    billingAddressStreet = $('#' + sf.paytrace.request.payment_fields.billing_address.street.id).val(),
    billingAddressStreet2 = $('#' + sf.paytrace.request.payment_fields.billing_address.street2.id).val(),
    billingAddressCityStateZipcode = $('#' + sf.paytrace.request.payment_fields.billing_address.city_state_postal_code.id).val(),
    billingAddressCity = $('#' + sf.paytrace.request.payment_fields.billing_address.city.id).val(),
    billingAddressState = $('#' + sf.paytrace.request.payment_fields.billing_address.state.id).val(),
    billingAddressPostalCode = $('#' + sf.paytrace.request.payment_fields.billing_address.postal_code.id).val(),
    billingAddressCountry = $('#' + sf.paytrace.request.payment_fields.billing_address.country.id).val(),
    shippingAddressStreet = $('#' + sf.paytrace.request.payment_fields.shipping_address.street.id).val(),
    shippingAddressStreet2 = $('#' + sf.paytrace.request.payment_fields.shipping_address.street2.id).val(),
    shippingAddressCityStateZipcode = $('#' + sf.paytrace.request.payment_fields.shipping_address.city_state_postal_code.id).val(),
    shippingAddressCity = $('#' + sf.paytrace.request.payment_fields.shipping_address.city.id).val(),
    shippingAddressState = $('#' + sf.paytrace.request.payment_fields.shipping_address.state.id).val(),
    shippingAddressPostalCode = $('#' + sf.paytrace.request.payment_fields.shipping_address.postal_code.id).val(),
    shippingAddressCountry = $('#' + sf.paytrace.request.payment_fields.shipping_address.country.id).val(),
    ptForm = document.getElementById(sf.paytrace.forms.protect.id),
    ptFormSubmitButton = $('#' + sf.paytrace.forms.protect.ui.elements.buttons.submit.id).val(),
    ptFormCancelButton = $('#' + sf.paytrace.forms.protect.ui.elements.buttons.cancel.id).val(),
    ptFormFinishButton = $('#' + sf.paytrace.forms.protect.ui.elements.buttons.finish.id).val(),
    detail = '',
    description = '';
    
  if(billingAddressCityStateZipcode != '') {
    billingAddressParts = billingAddressCityStateZipcode.split(sf.paytrace.request.payment_fields.city_state_postal_code.delimiter);
    billingAddressCity = billingAddressParts[0].trim();
    billingAddressState = (billingAddressParts.length > 1 ? billingAddressParts[1] : '').trim();
    billingAddressPostalCode = (billingAddressParts.length > 2 ? billingAddressParts[2] : '').trim();
  }

  billingAddressCountry = billingAddressCountry != '' ? billingAddressCountry : 'US';

  if(shippingAddressCityStateZipcode != '') {
    shippingAddressParts = shippingAddressCityStateZipcode.split(sf.paytrace.request.payment_fields.city_state_postal_code.delimiter);
    shippingAddressCity = shippingAddressParts[0].trim();
    shippingAddressState = (shippingAddressParts.length > 1 ? shippingAddressParts[1] : '').trim();
    shippingAddressPostalCode = (shippingAddressParts.length > 2 ? shippingAddressParts[2] : '').trim();
  }
  
  shippingAddressCountry = shippingAddressCountry != '' ? shippingAddressCountry : 'US';
  
    // DEBUG
    // console.debug(addressCityStateZipcode);
    
    // DEBUG
    // console.debug('processAuth: ' + ptProtectToken);

  data = {
      "hpf_token": hpfToken,
      "enc_key": encKey,
      "pt_protect_token" : ptProtectToken,
      "amount": amount,
      "billing_address": {
          "street": billingAddressStreet.trim(),
          "street2": billingAddressStreet2.trim(),
          "city": billingAddressCity,
          "state": billingAddressState,
          "country": billingAddressCountry,
          "postal_code": billingAddressPostalCode
      },
      "billing_name": billingName,
      "billing_email": billingEmail,
      "billing_phone": billingPhone,
      "description": description,
      "merchant_id": 0,
      "return_clr": false
  };
  
  if(shippingAddressStreet != '') {
    data['shipping_address'] = {
      "street": shippingAddressStreet.trim(),
      "street2": shippingAddressStreet2.trim(),
      "city": shippingAddressCity,
      "state": shippingAddressState,
      "country": shippingAddressCountry,
      "postal_code": shippingAddressPostalCode
    };
  }

  if(sf.paytrace.request.payment_fields.shipping_address.useBillingAddress) {
    data['shipping_address'] = {
      "street": billingAddressStreet.trim(),
      "street2": billingAddressStreet2.trim(),
      "city": billingAddressCity,
      "state": billingAddressState,
      "country": billingAddressCountry,
      "postal_code": billingAddressPostalCode
    };
  }

    // data['customer_reference_id'] = '';
    // data['marchant_id'] = '';
    
    // DEBUG
    if(sf.paytrace.config.debug) {
      console.debug(JSON.stringify(data));
      console.debug(data);
    }
    // return;
    
    // DEBUG
	  // console.debug(url);    
    
    $.ajax({
      type: "POST",
      dataType: 'json',
      url: url,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
      data: JSON.stringify(data),
      processData: false,
      success: function(data, status, jqXHR) {

        // DEBUG
        // console.debug('data: ' + JSON.stringify(data));
        
        var responseStatus = data['status'],
          responseStatusCode = data['status_code'],
          responseCode = data['data']['response_code'],
          responseMessage = data['data']['response_message'],
          transactionId = '',
          approvalMessage = '',
          formMessage = $('#' + sf.paytrace.forms.protect.ui.elements.message.id);
        
        if(responseStatus != 'success') {
          if('length' in data['data']) {
            if(data['data'][0]) {
              detail = data['data'][0]['detail'];
            }
          }

          // DEBUG
          // console.debug('An error has occurred (' + responseStatusCode + ')');
          formMessage.addClass('red');
          formMessage.removeClass('green');
          formMessage.text('An error has occurred. Please try again. ' + ((!responseStatusCode)?'':' (' + responseStatusCode + ') ') + detail);
          return;
        }
        
        if(responseCode == 101) {
          transactionId = data['data'].transaction_id;
          formMessage.addClass('green');
          formMessage.removeClass('red');
          formMessage.text('Payment successful. Thank you! Transaction ID: ' + transactionId);
          ptFormSubmitButton.addClass('hide');
          ptFormCancelButton.addClass('hide');
          ptFormFinishButton.removeClass('hide');
        }
        else {
          approvalMessage = data['data'].approval_message;
          formMessage.addClass('red');
          formMessage.text('There was a problem processing your transaction: ' + approvalMessage);
        }

        // DEBUG
        // console.debug('(protectAuth):' + JSON.stringify(data));
      	// alert('status:' + status);
      },
      fail: function(xhr, textStatus, errorThrown) {
        // alert('request failed');
      }
  })
  .done(function( data ) {
    // DEBUG
    // console.debug('done: ' + data);
  })
  .fail(function( jqXHR, textStatus, errorThrown ) {
        alert('error(fail): ' + errorThrown + '; status:' + jqXHR.status + ', textStatus:' + textStatus);
  });
    
    // DEBUG
    // alert('posting complete');  
};

sf.paytrace.finishPtProtect = function() {
	var formOuter = $('#' + sf.paytrace.forms.protect.ui.elements.outerContainer.id);
	formOuter.addClass('hide');
	$(document.body).removeClass('mode--modal');
};

sf.paytrace.cancelPtProtect = function() {
	var formOuter = $('#' + sf.paytrace.forms.protect.ui.elements.outerContainer.id);
	formOuter.addClass('hide');
	$(document.body).removeClass('mode--modal');
};

sf.paytrace.initPtProtect = function(callbacks) {
  if(!sf.paytrace.state.init) {
    sf.paytrace.init();
  }
  
	var request = '',
    overlay = document.getElementById(sf.paytrace.forms.ui.overlay.id),
		documentBody = $(document.body),
		formOuter = $('#' + sf.paytrace.forms.protect.ui.elements.outerContainer.id),
		ptProtectToken = '',
		amount = $('#' + sf.paytrace.request.payment_fields.amount.id).val();
    
    $('#' + sf.paytrace.forms.protect.ui.elements.message.id).text('');
    
    documentBody.addClass('cover');
    documentBody.addClass('mode--modal');
    
    if(!overlay) {
    	overlay = document.createElement('DIV');
      overlay = $(overlay);
      overlay.addClass('modal-overlay');
      overlay.addClass('cover');
      overlay.prop('id', sf.paytrace.forms.ui.overlay.id);
      documentBody.append(overlay);
    }
    else {
    	overlay = $(overlay);
    }
    
    formOuter.removeClass('hide');
    documentBody.append(formOuter);
    
    // DEBUG
    // alert('overlay');
    
	$(window).on('resize load scroll orientationchange', function () {
    var w_width = $(window).width(),
      w_height = $(window).height(),
      w_scrollTop = window.scrollY;
	
		formOuter.css('left', w_width / 4  + 'px');
    formOuter.css('top', w_scrollTop  + 'px');
    formOuter.css('height', w_height + 'px');
	        
    if(w_width < 550) {
      formOuter.css('left', 0  + 'px');
      formOuter.css('width', '100%');
    }
    else {
			formOuter.css('left', w_width / 4  + 'px');
			formOuter.css('width', '80%');
	  }
	        
    // DEBUG
    // console.debug(w_width);
    // console.debug(w_height);
    // console.debug(w_scrollTop);
	});
    
    // trigger scroll event to repaint UI
    setTimeout(function() {
    	documentBody.css('height', ($(window).height() + 2000) + 'px');
      overlay.css('height', ($(window).height() + 2000) + 'px');
    
    	$('#' + sf.paytrace.forms.protect.ui.elements.amount.id).text(amount);
        
    	$(window).trigger('scroll');
    }, 1000);
    
    // DEBUG
    // console.debug('overlay:');
    // console.debug(overlay);

	// change to: getPTProtectToken.php
	$.post(sf.paytrace.config.baseEndpointUri.baseUri + 
          sf.paytrace.config.baseEndpointUri.path + 
          sf.paytrace.config.endpoints.getPtProtectToken, request, function (data) {
    // DEBUG
		// console.debug('post (pay):' + data);
		// document.getElementById('token').value = data;
		ptProtectToken = data;
			
    // DEBUG
    // console.debug('ptProtectToken:');
    // console.debug(ptProtectToken);
            
    // Minimal Protect.js setup call
    PTPayment.setup({
      styles:
            {
              'code': {
              'font_color':'#5D99CA',
              'border_color':'#EF9F6D',
              'border_style':'dotted',
              'font_size':'13pt',
              'input_border_radius':'5px',
              'input_border_width':'2px',
              'input_font':'serif, cursive, fantasy',
              'input_font_weight':'700',
              'input_margin':'5px 0px 5px 20px',
              'input_padding':'0px 5px 0px 5px',
              'label_color':'#5D99CA',
              'label_size':'16px',
              'label_width':'150px',
              'label_font':'sans-serif, arial, serif',
              'label_font_weight':'bold',
              'label_margin':'5px 0px 0px 20px',
              'label_padding':'2px 5px 2px 5px',
              'label_border_style':'dotted',
              'label_border_color':'#EF9F6D',
              'label_border_radius':'10px',
              'label_border_width':'0px',
              'background_color':'white',
              'height':'25px',
              'width':'110px',
              'padding_bottom':'2px'
              },
              'cc': {
              'font_color':'#5D99CA',
              'border_color':'#EF9F6D',
              'border_style':'solid',
              'font_size':'13pt',
              'input_border_radius':'5px',
              'input_border_width':'2px',
              'input_font':'Times New Roman, arial, fantasy',
              'input_font_weight':'400',
              'input_margin':'5px 0px 5px 0px',
              'input_padding':'0px 5px 0px 5px',
              'label_color':'#5D99CA',
              'label_size':'16px',
              'label_width':'150px',
              'label_font':'Times New Roman, sans-serif, serif',
              'label_font_weight':'light',
              'label_margin':'5px 0px 0px 0px',
              'label_padding':'0px 5px 0px 5px',
              'label_border_style':'solid',
              'label_border_color':'#EF9F6D',
              'label_border_radius':'20px',
              'label_border_width':'0px',
              'background_color':'white',
              'height':'25px',
              'width':'320px',
              'padding_bottom':'0px'
              },
              'exp': {
              'font_color':'#5D99CA',
              'border_color':'#EF9F6D',
              'border_style':'dashed',
              'font_size':'12pt',
              'input_border_radius':'0px',
              'input_border_width':'2px',
              'input_font':'arial, cursive, fantasy',
              'input_font_weight':'400',
              'input_margin':'5px 0px 5px 0px',
              'input_padding':'0px 5px 0px 5px',
              'label_color':'#5D99CA',
              'label_size':'16px',
              'label_width':'150px',
              'label_font':'arial, fantasy, serif',
              'label_font_weight':'normal',
              'label_margin':'5px 0px 0px 0px',
              'label_padding':'2px 5px 2px 5px',
              'label_border_style':'dashed',
              'label_border_color':'#EF9F6D',
              'label_border_radius':'0px',
              'label_border_width':'0px',
              'background_color':'white',
              'height':'25px',
              'width':'85px',
              'padding_bottom':'2px',
              'type':'dropdown'
              },
              'body': {
              'background_color':'white'
              }
            },
        authorization: { 
          clientKey: ptProtectToken
        }
    }).then(function(instance) {
        // use instance object to process and tokenize sensitive data payment fields.
        // this can be any event we chose. We will use the submit event and stop
        // any default event handling and prevent event handling bubbling.

        var ptForm = document.getElementById(sf.paytrace.forms.protect.id),
          ptFormSubmitButton = document.getElementById(sf.paytrace.forms.protect.ui.elements.buttons.submit.id),
          ptFormCancelButton = document.getElementById(sf.paytrace.forms.protect.ui.elements.buttons.cancel.id),
          ptFormFinishButton = document.getElementById(sf.paytrace.forms.protect.ui.elements.buttons.finish.id);


        var submitPayment = function(response, token) {
            // DEBUG
            // console.debug('submit payment: ' + JSON.stringify(response) + ';' + token);
            
            var success = response.success,
              hpfToken = response.message['hpf_token'],
              encKey = response.message['enc_key'];
            
            if(success === true) {
              sf.paytrace.processProtectAuth(hpfToken, encKey, token);

              if(typeof(callbacks.success) == 'function') {
                // DEBUG
                // console.debug(data);
                // return;
              
                callbacks.success(data);
              }
            }
        };

        var handleError = function(error) {
          var formMessage = $('#' + sf.paytrace.forms.protect.ui.elements.message.id),
              message = 'Error: Please fill in all of the fields in the main form, and be sure formatting is correct. ' +
                        'You will have to click CANCEL on this payment form to do so. Error:' + error;
          
          formMessage.addClass('red');
          formMessage.text(message);
        };

        ptFormSubmitButton.addEventListener("click", function(e) {
          e.preventDefault();
          e.stopPropagation();
              
          // DEBUG
          // alert('submitting form');
          
          // To trigger the validation of sensitive data payment fields within
          // the iframe before calling the tokenization process:
          PTPayment.validate(function(validationErrors) {
            // DEBUG
            // alert(JSON.stringify(validationErrors));
              
                if (validationErrors.length >= 1) {
                  if (validationErrors[0]['responseCode'] == '35') {
                    // Handle validation Errors here
                    // This is an example of using dynamic styling to show the Credit card
                    // number entered is invalid
                    PTPayment.style({'cc': {'border_color': 'red'}});
                  }
                } else {
                  // no error so tokenize
                  instance.process()
                    .then((r) => submitPayment(r, ptProtectToken))
                    .catch((err) => handleError(err));
                }
          }); // end of PTPayment.validate
        }); // end of add event listener submit                
        }); // end of PTPayment.setup.then()
      }).fail(function(data) {
        // DEBUG
        console.debug('fail (pay):' + JSON.stringify(data));
        if(typeof(callbacks.fail) == 'function') {
          callbacks.fail(data);
        }
      });
    
    // PTPayment.theme('horizontal');
};
