(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.changeBottomImage = exports.automatizeFlux = exports.animateCreditFluxBack = exports.animateCreditFlux = undefined;

var _stepper = require('./stepper.js');

var myForm = $('#creditForm'),
    $stepper = $('.stepper'),
    gradientHeader = $('header.appGradientHeader'),
    progressBar = $('.progressBar');

var animateCreditFlux = exports.animateCreditFlux = function animateCreditFlux($stepBar) {

	if ($stepBar !== 'noMore') {

		if ($stepBar == 1) {
			progressBar.addClass('active');
		}

		if ($.isArray($stepBar)) {
			$stepBar.forEach(function (num) {
				return $('div[data-step=' + num + ']').addClass('done');
			});
		} else {
			$('div[data-step=' + $stepBar + ']').addClass('done');
		}
	} else {
		progressBar.removeClass('active');
	}
};

var animateCreditFluxBack = exports.animateCreditFluxBack = function animateCreditFluxBack($stepBar) {
	var barSteps = $('div.barStep');

	changeBottomImage($stepBar);

	barSteps.each(function (i, el) {
		var barNum = $(el).data('step');
		if (typeof barNum !== 'number') barNum = Number(barNum);
		if (barNum > $stepBar && $(el).hasClass('done')) $(el).removeClass('done');
	});
};

var automatizeFlux = exports.automatizeFlux = function automatizeFlux(stepTime, activeStepFirst) {
	setTimeout(function () {
		var activeStepNow = $('li.active'),
		    stepsMatch = activeStepNow.get(0) == activeStepFirst.get(0) ? true : false;
		if (stepsMatch) (0, _stepper.passNextStep)(activeStepNow, 1);
	}, stepTime);
};

var changeBottomImage = exports.changeBottomImage = function changeBottomImage(barStep) {
	var images = {
		1: 'assets/imgs/side-1.png',
		2: 'assets/imgs/side-2.png',
		3: 'assets/imgs/side-3.png',
		4: 'assets/imgs/side-4.png',
		5: 'assets/imgs/side-5.png',
		6: 'assets/imgs/side-6.png',
		7: 'assets/imgs/side-7.png'
	},
	    imgContainer = $('div.rightBottmImgsContainer'),
	    inCredits = $('div.longFormWrapper').data('place') == 'credits' ? true : false,
	    topLimit = inCredits ? 8 : 5;

	if (sessionStorage.getItem('creditAlone') !== null && sessionStorage.getItem('creditAlone') !== undefined) topLimit = 6;

	barStep = typeof barStep == 'number' ? barStep : Number(barStep);

	barStep < topLimit ? imgContainer.css('background-image', 'url(' + images[barStep] + ')') : imgContainer.css('background-image', 'none');
};

},{"./stepper.js":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var benefitsStep = $('li#benefits'),
    elements = benefitsStep.find('.toAnimate');

var animateBenefits = exports.animateBenefits = function animateBenefits() {
	var index = 0;
	var animationInt = setInterval(function () {
		$(elements).eq(index).addClass('animated');
		index++;
		if (index == 5) clearInterval(animationInt);
	}, 400);
};

var clearBenefits = exports.clearBenefits = function clearBenefits() {
	elements.removeClass('animated');
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.commify = exports.numberInputProcess = undefined;

var _creditCalculator = require('./creditCalculator.js');

var numberInputProcess = exports.numberInputProcess = function numberInputProcess(e, $inp) {
	var kCode = e.keyCode,
	    number = '';

	if (e.key.match(/^[0-9]+$/) && $inp.val().length < 17 || e.key == 'Backspace') {

		var numberInter = setInterval(function () {
			if ($inp.val().length) {
				if ($($inp).prop('type') == 'number') $($inp).prop('type', 'text');

				clearInterval(numberInter);
				number = $inp.val();
				var commifiedNum = commify(number);
				var amount = (0, _creditCalculator.realValue)(commifiedNum);
				amount > 0 ? $inp.val(commifiedNum) : $inp.val(0);
			}
		}, 200);
	} else if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Backspace') {
		e.preventDefault();
	}
};

var commify = exports.commify = function commify(num) {
	num = num.replace(/,/g, '');

	var decimals = num.indexOf('.') !== -1 ? num.slice(num.indexOf('.'), num.indexOf('.') + 4) : '';
	num = num.indexOf('.') !== -1 ? num.slice(0, num.indexOf('.')) : num;
	decimals = Number(decimals) > 0 ? decimals : '';

	var chars = num.split("").reverse();
	var withCommas = [];
	var commaSeparator = 1;

	for (var i = 0; i < chars.length; i++) {

		withCommas.push(chars[i]);
		if (commaSeparator % 3 == 0 && commaSeparator !== chars.length) {
			withCommas.push(",");
		}
		commaSeparator++;
	}

	var val = withCommas.reverse().join("");
	return val + decimals;
};

},{"./creditCalculator.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// this works to add the name used in the second view of the page
// to the next one, to costumize the greeting

var addNameOnGreeting = exports.addNameOnGreeting = function addNameOnGreeting() {
	var userData = {},
	    usrNameSpan = $('span.userName'),
	    nameInput = $('#u_name');

	// we have to see if the value used inside the input is valid
	// an issue is that when you press enter directly to pass to the next step
	// you don't give time enought to the stepper plugin engine to add the valid class in the input
	// therefore we check if at least has a string with a length greater than one
	// as the input is a text input we don't have to check further formats
	if (nameInput.hasClass('valid') || $.trim(nameInput.val()).length > 0) {
		userData.name = nameInput.val();
		// console.log(userData.name);
		usrNameSpan.text(userData.name);
	}
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.realValue = exports.creditCalculator = undefined;

var _commify = require('./commify.js');

var _stepper = require('./stepper.js');

var nameInput = $('input#u_name'),
    creditInput = $('#u_credit'),
    sellsInput = $('#u_sells'),
    debtInput = $('#u_debtPayment'),
    amountTag = $('.amount'),
    creditResultTitle = $('.creditResultTitle'),
    creditResSubtitle = $('.creditResSubtitle'),
    paymentData = $('.paymentData'),
    delayView = $('li.calculationDelayView'),
    backBtn = $('span.backBtn'),
    catSpan = $('span.catSpan'),
    catDiv = $('div.catDiv'),
    catPossible = [],
    tasaAmount = [],
    possibleMonthPay = [],
    finalTasa = '',
    finalCAT = '',
    finalPayment = '';

var lineFactorTypes = {
	revolvente: 6,
	simple: {
		'36Meses': 14,
		'48Meses': 17,
		'60Meses': 20
	}
};

var timeEnought = false,
    amountReady = false;

var changeView = function changeView() {
	if (amountReady && $('li.active').hasClass('calculationDelayView')) {
		(0, _stepper.eventHandler)('pressOnStep', null);
	}
};

var creditCalculator = exports.creditCalculator = function creditCalculator(creditInfo) {
	backBtn.addClass('noVisible');
	// console.log(creditInfo);
	timeEnought = false;
	amountReady = false;
	delayView.data('ready', 'no');

	setTimeout(function () {
		timeEnought = true;
		changeView();
	}, 2000);

	var askedAmount = realValue(creditInput.val()),
	    ventas = sessionStorage.getItem('u_sells') !== undefined && sessionStorage.getItem('u_sells') !== null ? Number(sessionStorage.getItem('u_sells')) : realValue(sellsInput.val()),
	    mensualPayment = realValue(debtInput.val()),
	    fifteenPct = true;

	// console.log(askedAmount, ventas, mensualPayment);

	var askedAmount15Pct = fifteenPct ? .15 : askedAmount * .15;

	var lineFactor = 0;

	if (creditInfo.creditType == 'revolvente') {
		lineFactor = lineFactorTypes.revolvente;
		catPossible = ['35.04%', '31.93%', '30.07%', '20.86%', '19.23%', '17.72%'];
		tasaAmount = ['20.50%', '19.50%', '18.50%', '11.25%', '10.00%', '8.75%'];
	} else {
		lineFactor = lineFactorTypes.simple[creditInfo.monthsToPay];
		tasaAmount = ['29.00%', '28.00%', '27.00%', '18.75%', '17.50%', '16.25%'];
		if (lineFactor == 14) {
			catPossible = ['35.23%', '33.91%', '32.59%', '22.20%', '20.70%', '19.21%'];
			possibleMonthPay = ['4,190.57', '10,340.90', '20,412.61', '36,529.74', '89,755.16', '176,402.92'];
		} else if (lineFactor == 17) {
			catPossible = ['34.81%', '33.49%', '32.18%', '21.82%', '20.31%', '18.83%'];
			possibleMonthPay = ['3,542.67', '8,713.04', '17,141.16', '29,768.36', '72,785.93', '142,342.41'];
		} else if (lineFactor == 20) {
			catPossible = ['34.69%', '33.37%', '32.06%', '21.68%', '20.17%', '18.69%'];
			possibleMonthPay = ['3,174.19', '7,783.96', '15,267.66', '25,803.19', '62,805.53', '122,255.45'];
		}
	}

	var creditAm = (ventas / 12 * askedAmount15Pct - mensualPayment) * lineFactor;

	var credit = Math.min(creditAm, ventas / 12, askedAmount);

	showCreditFn(credit, creditInfo);
};

var realValue = exports.realValue = function realValue(val) {
	if (val !== null && val !== undefined) {
		var numberValue = $.trim(val.replace(/,/g, ''));
		numberValue = Number(numberValue);
		return numberValue;
	}
};

var defineValToShow = function defineValToShow(theNum) {
	// console.log(theNum, 'this is the real money to show', typeof theNum);
	var maxVal = 100000;
	finalCAT = catPossible[0];
	finalTasa = tasaAmount[0];
	finalPayment = possibleMonthPay[0];

	if (theNum > maxVal && theNum <= 250000) {
		maxVal = 250000;
		finalCAT = catPossible[1];
		finalTasa = tasaAmount[1];
		finalPayment = possibleMonthPay[1];
	} else if (theNum > 250000 && theNum <= 500000) {
		maxVal = 500000;
		finalCAT = catPossible[2];
		finalTasa = tasaAmount[2];
		finalPayment = possibleMonthPay[2];
	} else if (theNum > 500000 && theNum <= 1000000) {
		maxVal = 1000000;
		finalCAT = catPossible[3];
		finalTasa = tasaAmount[3];
		finalPayment = possibleMonthPay[3];
	} else if (theNum > 1000000 && theNum <= 2500000) {
		maxVal = 2500000;
		finalCAT = catPossible[4];
		finalTasa = tasaAmount[4];
		finalPayment = possibleMonthPay[4];
	} else if (theNum > 2500000) {
		maxVal = 5000000;
		finalCAT = catPossible[5];
		finalTasa = tasaAmount[5];
		finalPayment = possibleMonthPay[5];
	}

	return maxVal;
};

var showCreditFn = function showCreditFn(approvedMoney, info) {
	approvedMoney = Math.ceil(approvedMoney);

	var userName = sessionStorage.getItem('u_name') !== null && sessionStorage.getItem('u_name') !== undefined ? sessionStorage.getItem('u_name') : nameInput.val();
	var creditTypeSpan = $('span.creditTypeCat');

	if (approvedMoney > 0) {
		catDiv.show();
		var realMoneyToShow = defineValToShow(approvedMoney);

		realMoneyToShow = realMoneyToShow.toString();
		var valWithCommas = (0, _commify.commify)(realMoneyToShow);
		amountTag.data('amount', valWithCommas);
		amountTag.text('$ ' + valWithCommas).append('<span style="font-size: 12px; margin-left: 10px;">M.N.</span>');

		if (info.creditType == 'simple') {

			var months = info.monthsToPay.slice(0, 2);
			months = Number(months);
			paymentData.html('Pagando $ ' + finalPayment + ' por ' + months + ' meses a una tasa de inter&eacute;s fija anual de ' + finalTasa);
			paymentData.show();
			creditTypeSpan.html('Cr&eacute;dito Simple HSBC Fusion');
			creditResSubtitle.html('El monto de tu Cr&eacute;dito Simple HSBC Fusion puede ser hasta de:');
		} else {
			paymentData.html('A una tasa de inter&eacute;s variable anual de ' + finalTasa);
			creditTypeSpan.html('Capital de Trabajo HSBC Fusion');
			creditResSubtitle.html('El monto de tu cr&eacute;dito Capital de Trabajo HSBC Fusion puede ser hasta de:');
		}

		amountTag.show();
		catSpan.html(finalCAT);
		creditResultTitle.html('¡Buenas noticias, ' + userName + '!');
		// ($('#sOptionCreditUse').prop('checked')) ? creditResSubtitle.html('El monto de tu cr&eacute;dito Capital de Trabajo HSBC Fusion puede ser hasta de:') : creditResSubtitle.html('El monto de tu Cr&eacute;dito Simple HSBC Fusion puede ser hasta de:');

	} else {

		catDiv.hide();

		creditResultTitle.html('Est&aacute;s a un paso de hacer que crezca tu negocio, ' + userName);
		creditResSubtitle.html('Nuestro equipo especializado en soluciones de cr&eacute;dito te dará la mejor alternativa para tu negocio');
		amountTag.hide();
		paymentData.hide();
	}

	delayView.data('ready', 'y');
	amountReady = true;
	if (timeEnought) (0, _stepper.eventHandler)('pressOnStep', null);
};

},{"./commify.js":3,"./stepper.js":15}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var checkIfValid = exports.checkIfValid = function checkIfValid(theInput, theVal, whatToCheck, errMsg) {

	if ($.isArray(whatToCheck)) {
		var customValidator = new CustomValid(theVal.toUpperCase());
		var validAlways = true;

		// if any of the values doesn't match whatToCheck its gonna be undefined
		whatToCheck.forEach(function (el) {
			validAlways = (typeof validAlways === 'undefined' ? 'undefined' : _typeof(validAlways)) === undefined ? customValidator[el]() : customValidator[el]() * validAlways;
		});

		validAlways ? $(theInput).data('correct', 'yes') : (errMsg.css('display', 'block'), $(theInput).data('correct', 'no'));
	} else if (whatToCheck == 'sameEmail') {

		var firstMail = $('input#u_email').val(),
		    _customValidator = new CustomValid(theVal, firstMail);

		_customValidator[whatToCheck]() ? $(theInput).data('correct', 'yes') : (errMsg.css('display', 'block'), $(theInput).data('correct', 'no'));
	} else {

		var _customValidator2 = new CustomValid(theVal),
		    ans = _customValidator2[whatToCheck]();

		ans ? $(theInput).data('correct', 'yes') : (errMsg.css('display', 'block'), $(theInput).data('correct', 'no'));
	}
};

var CustomValid = exports.CustomValid = function () {
	function CustomValid(val, toContrast) {
		_classCallCheck(this, CustomValid);

		this.value = val;
		this.constraster = toContrast !== undefined ? toContrast : '';
	}

	_createClass(CustomValid, [{
		key: 'length10',
		value: function length10() {
			var res = this.value.length === 10 ? true : false;
			return res;
		}
	}, {
		key: 'length13',
		value: function length13() {
			var res = this.value.length === 13 ? true : false;
			return res;
		}
	}, {
		key: 'validZip',
		value: function validZip() {
			var data = { data: this.value },
			    url = '';

			var res = this.value.length >= 4 ? true : false;
			return res;
		}
	}, {
		key: 'sameEmail',
		value: function sameEmail() {
			var res = this.value === this.constraster ? true : false;
			return res;
		}
	}, {
		key: 'validRFC',
		value: function validRFC() {
			var res = /^([a-zA-Z]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([a-zA-Z0-9]{3})?$/.test(this.value);
			return res;
		}
	}]);

	return CustomValid;
}();

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var folioCont = $('.folioCont');

// random folio number producer
var folioShower = exports.folioShower = function folioShower(num) {
	var randomNum = Math.floor(Math.random() * 999900) + 100;
	var isRandomNecessary = (sessionStorage.getItem('folioGrabbed') == undefined || sessionStorage.getItem('folioGrabbed') == null) && num == null ? true : false;

	if (isRandomNecessary) {
		sessionStorage.setItem('folioGrabbed', randomNum);
		folioCont.text(randomNum);
	} else {
		num == null ? folioCont.text(sessionStorage.getItem('folioGrabbed')) : (sessionStorage.setItem('folioGrabbed', num), folioCont.text(num));
	}
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var actAsNumber = exports.actAsNumber = function actAsNumber(e) {
	var key = e.key;
	// console.log(key, typeof key);
	if (!key.match(/^[0-9]+$/) && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Backspace' && key !== 'Tab' && key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Enter') e.preventDefault();
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.changeStep = exports.urlHashObserver = undefined;

var _animateCreditFlux = require('./animateCreditFlux.js');

var _stepper = require('./stepper.js');

var _benefitsAnimator = require('./benefitsAnimator.js');

var progressBar = $('.progressBar');
var onBadBrowser = sessionStorage.getItem('noFlex') == '1' ? true : false;
var list = $('ul.stepper'),
    backArrow = $('span.backBtn'),
    floatingText = $('span.floatingText'),
    calculationView = $('li.calculationDelayView');

var urlHashObserver = exports.urlHashObserver = function urlHashObserver() {

	setInterval(function () {

		var lastHash = sessionStorage.getItem('recordedHash');

		var actualHash = window.location.hash;
		actualHash = actualHash.replace('#', '');

		if (lastHash !== actualHash) changeStep(actualHash, lastHash);
	}, 150);
};

var changeStep = exports.changeStep = function changeStep(actualStepName, lastStepName) {

	var actualStep = $('li[data-step-name="' + actualStepName + '"]'),
	    lastStep = $('li[data-step-name="' + lastStepName + '"]'),
	    otherSteps = $('li:not([data-step-name="' + actualStepName + '"])');

	otherSteps.removeClass('active');

	setTimeout(function () {

		actualStep.addClass('active');
		sessionStorage.setItem('recordedHash', actualStepName);

		changesBasedOnName(actualStepName, lastStepName);
		changesBasedOnTheSteps(actualStep, lastStep);
	}, 100);
};

var changesBasedOnTheSteps = function changesBasedOnTheSteps(actual, last) {

	if ((actual.hasClass('withInput') || actual.hasClass('longFormStep')) && actual.data('stepName') !== 'start') {
		$(actual).find('input').first().focus();
	}

	if (actual.hasClass('automaticStep') && !actual.hasClass('calculationDelayView')) {

		(0, _stepper.eventHandler)('automaticStep', null);
	}

	if (actual.hasClass('radioInput')) {
		var radios = $(actual).find('input[type=radio]');
		radios.prop('checked', false);
	}

	if (actual.hasClass('onProgressBar') && last.hasClass('onProgressBar')) {

		var actualBarStep = actual.data('stepBar'),
		    lastBarStep = last.data('stepBar');

		if (typeof actualBarStep !== 'number') actualBarStep = Number(actualBarStep);
		if (typeof lastBarStep !== 'number') lastBarStep = Number(lastBarStep);

		// check if we are really going back
		if (lastBarStep > actualBarStep) {

			(0, _animateCreditFlux.animateCreditFluxBack)(actualBarStep);
		} else if (actualBarStep > lastBarStep) {

			(0, _animateCreditFlux.animateCreditFlux)(actualBarStep);
			(0, _animateCreditFlux.changeBottomImage)(actualBarStep);
		}
	}
};

var changesBasedOnCreditUse = function changesBasedOnCreditUse() {
	var months48 = $('input#sOptionMonths'),
	    months60 = $('input#tOptionMonths');

	months48.closest('p').show();
	months60.closest('p').show();
};

var changesBasedOnName = function changesBasedOnName(actualName, lastName) {

	if (actualName == 'calculationTime' && lastName == 'approvedCredit') {

		window.location.hash = 'debtPayment';
		progressBar.addClass('active');
		progressBar.find('div.barStep').last().removeClass('done');
		(0, _animateCreditFlux.changeBottomImage)(7);
		calculationView.removeClass('noVisible');
		backArrow.removeClass('noVisible');
	} else if (actualName == 'taxRegimen' && lastName == 'membershipsPresentation') {

		progressBar.addClass('active');
		(0, _animateCreditFlux.changeBottomImage)(4);
	} else if (actualName == 'presentation' && lastName == 'creditAsk' || actualName == 'start' && lastName == 'creditAsk' || actualName == 'presentation' && lastName == 'bussinesType') {

		progressBar.removeClass('active');
		progressBar.find('div.barStep').removeClass('done');
		(0, _animateCreditFlux.changeBottomImage)(8);
	} else if (actualName == 'benefits' && lastName == 'presentation') {

		(0, _benefitsAnimator.animateBenefits)();
	} else if (actualName == 'creditUse' && lastName == 'creditType') {

		changesBasedOnCreditUse();
	} else if (actualName == 'shortIntro' && lastName == 'benefits') {

		(0, _benefitsAnimator.clearBenefits)();
	} else if (actualName == 'creditAsk' && lastName == 'approvedCredit') {

		cleanCreditSimulationInputs();
		changesBasedOnCreditUse();
		$('div.barStep').removeClass('done');
		(0, _animateCreditFlux.animateCreditFlux)(1);
		(0, _animateCreditFlux.changeBottomImage)(1);
		calculationView.removeClass('noVisible');
		backArrow.removeClass('noVisible');

		// toggling flexbox style from ul when changing from one view with troubles on that 
		// (where you can see an inner scroll bar) to another without them
	} else if (actualName == 'form' && lastName == 'approvedCredit' || actualName == 'approvedCredit' && lastName == 'form' || actualName == 'memberships' && lastName == 'membershipsPresentation' || actualName == 'membershipsPresentation' && lastName == 'memberships' || actualName == 'end' && lastName == 'approvedCredit' || actualName == 'approvedCredit' && lastName == 'end') {
		$(list).toggleClass('withBlock');
	} else if (actualName === 'membershipsAfter' && lastName == 'end') {

		floatingText.html('Membres&iacute;a <br class="show-on-small hide-on-med-and-up"> HSBC Fusion');
	} else if (actualName === 'end' && lastName == 'membershipsAfter') {

		floatingText.html('Simulador de Cr&eacute;dito');
	}
};

var cleanCreditSimulationInputs = function cleanCreditSimulationInputs() {
	$('input[type=radio]').prop('checked', false);
	$('input.trickyInput').val('');
};

},{"./animateCreditFlux.js":1,"./benefitsAnimator.js":2,"./stepper.js":15}],10:[function(require,module,exports){
'use strict';

var _placeholderNamesTimer = require('./placeholderNamesTimer.js');

var _splashAnimator = require('./splashAnimator.js');

var _costumizeGreeting = require('./costumizeGreeting.js');

var _commify = require('./commify.js');

var _customValidator = require('./customValidator.js');

var _stepper = require('./stepper.js');

var _creditCalculator = require('./creditCalculator.js');

var _hashObserver = require('./hashObserver.js');

var _share = require('./share.js');

var _folioShower = require('./folioShower.js');

var _secondFluxHttpSender = require('./secondFluxHttpSender.js');

var _forceNumberInput = require('./forceNumberInput.js');

$(document).ready(function () {

	window.onbeforeunload = function (event) {
		sessionStorage.removeItem('recordedHash');
	};

	window.location.hash = 'start';
	(0, _hashObserver.urlHashObserver)();

	if (sessionStorage.getItem('u_name') !== null && sessionStorage.getItem('u_name') !== undefined) {
		var recordedName = sessionStorage.getItem('u_name');
		var usrNameSpan = $('span.userName');
		usrNameSpan.text(recordedName);
	}

	// html elements

	var gradientHeader = $('header.appGradientHeader'),
	    myForm = $('#creditForm'),
	    automaticSteps = $('li.automaticStep'),
	    nextBtns = $('.next-step'),
	    mySplashImg = $('div.splash'),
	    allInputs = $('input:not([type=radio])'),
	    nameInput = $('#u_name'),
	    nameInputLabel = $('label#u_nameLabel'),
	    fakePlaceholder = $('span.placeholderFake'),
	    desPayWrapper = $('div.desiredPaymentWrapper'),
	    trickyInputs = $('input.trickyInput'),
	    repeatCreditTag = $('p.simulationAgain'),
	    longFormWrapper = $('.longFormWrapper'),
	    privacyLink = $('span.privacyPolicyLink'),
	    privacyTxtDiv = $('.privacyPolicyWrapper'),
	    privacyTxtCloser = $('span.closePP'),
	    lgFormBtnWrapper = $('div.longFormAction'),
	    lgFormBtn = $('button.formSubmitBtn'),
	    inputsToValidate = $('input.longFormInput[data-check]'),
	    lastFormInputs = $('input.longFormInput'),
	    policyCheckbox = $('input#cb_tc'),
	    folioCont = $('.folioCont'),
	    backBtn = $('span.backBtn'),
	    mistakeDiv = $('div.mistakeDiv');

	var inputsWithArrow = $('div.withArrBtn input');

	// booleans and other variables

	var lastFormFill = false,
	    lastFormNoErr = false,
	    privacyPolicyAccepted = false;

	// data to process

	var wholeData = {},
	    calculationData = {};

	// starts the splash animation in the first view
	if (mySplashImg.length) (0, _splashAnimator.animateSplash)(mySplashImg, nameInputLabel);

	// this three actions applied to the input with the animation names
	// stop that animation when you click or keydown in the input
	nameInput.val('');
	nameInput.click(_placeholderNamesTimer.clearFakePlaceholder);
	fakePlaceholder.click(_placeholderNamesTimer.clearFakePlaceholder);

	nameInput.keypress(function (e) {
		var myKey = e.key;
		if (e.which === 43 || e.which === 45 || myKey === '-' || /^[@#∞¢|¬÷“≠´‚^¿]?$/.test(myKey) || /^[.,;:=º'`´&”<>]?$/.test(myKey) || /^[!¡"·$%&/)[\](*Çç¨{}?]?$/.test(myKey) && myKey !== undefined) e.preventDefault();
		if (e.which == 32 || !/^[a-zA-ZñÑ\s\W]?$/.test(myKey) && e.which !== 186 && myKey !== undefined) e.preventDefault();
	});

	nameInput.keyup(function (e) {
		var valTxt = nameInput.val(),
		    returnedVal = valTxt.charAt(0).toUpperCase() + valTxt.slice(1).toLowerCase();

		nameInput.val(returnedVal);
	});

	allInputs.on('focus', function (e) {
		var errSpan = $(e.target).next('span.requiredField');
		if (errSpan.length > 0) errSpan.remove();
	});

	allInputs.on('keydown', function (e) {
		var errSpan = $(e.target).next('span.requiredField');
		if (errSpan.length > 0) errSpan.remove();
	});

	var questionIcon = $('span.questionIcon');

	questionIcon.click(function (e) {
		var myHelper = $(e.target).closest('p.radioWithQuestionWrapper').find('span.helpText');
		myHelper.toggle();
	});

	inputsWithArrow.on('keyup', function (e) {
		var theInp = $(e.target),
		    arrBtn = theInp.closest('div.withArrBtn').next('div.step-actions').find('img.arrow-right'),
		    val = theInp.val();

		if (val.length > 0) {
			arrBtn.addClass('onGoing');
		} else {
			arrBtn.removeClass('onGoing');
		}
	});

	var phonInput = $('#u_phone'),
	    phonInput2 = $('#u_phone_2'),
	    employInput = $('#u_n_employees'),
	    zipInput = $('#u_zipcode');

	zipInput.on('keydown', function (e) {
		(0, _forceNumberInput.actAsNumber)(e);
	});

	phonInput.on('keydown', function (e) {
		(0, _forceNumberInput.actAsNumber)(e);
	});

	phonInput2.on('keydown', function (e) {
		(0, _forceNumberInput.actAsNumber)(e);
	});

	employInput.on('keydown', function (e) {
		(0, _forceNumberInput.actAsNumber)(e);
	});

	$('input[type=radio]').on('change', function (e) {
		var isRevolvente = $(e.target).hasClass('revCredType') ? true : false;

		if ($(e.target).hasClass('desiredPaymentInput')) {

			var value = $(e.target).next('label').text();
			calculationData.monthsToPay = value.replace(/ /g, '');
		} else if ($(e.target).hasClass('revCredType')) {
			desPayWrapper.css('visibility', 'hidden');
			calculationData.creditType = 'revolvente';
			calculationData.monthsToPay = '';
		} else if ($(e.target).hasClass('simpleCredType')) {
			calculationData.creditType = 'simple';
			desPayWrapper.css('visibility', 'visible');
		} else if ($(e.target).is('#sOptionPersonType')) {

			$('input#u_rs').prop('required', false);
		} else if ($(e.target).is('#tOptionPersonType')) {

			$('input#u_rs').prop('required', true);
		} else if ($(e.target).is('#sOptionCreditUse')) {
			// console.log('you clicked it');

			$('input#sOptionMonths').closest('p').hide();
			$('input#tOptionMonths').closest('p').hide();
		}

		// here you change of view
		setTimeout(function () {
			isRevolvente ? (0, _stepper.eventHandler)('clickOnRadio', 'revolventeClick') : (0, _stepper.eventHandler)('clickOnRadio', null);
		}, 450);
	});

	// to return a step
	backBtn.click(function () {
		var activeStep = $('li.active'),
		    revRadio = $('input#revCredType'),
		    stepBefore = $(activeStep).prev('li'),
		    prevStepName = stepBefore.data('stepName');

		window.location.hash = prevStepName == 'monthsToPay' && revRadio.prop('checked') ? 'creditType' : prevStepName;
	});

	// to repeat simulation
	repeatCreditTag.click(function () {
		return window.location.hash = 'creditAsk';
	});

	automaticSteps.on('click', function (e) {
		if (!$(e.target).hasClass('calculationDelayView')) (0, _stepper.eventHandler)('pressOnStep', null);
	});

	nextBtns.on('click', function (e) {
		e.preventDefault();
		var myActiveStep = $('li.active');
		myActiveStep.is('#debtPayment') ? (0, _stepper.eventHandler)('clickOnBtn', calculationData) : (0, _stepper.eventHandler)('clickOnBtn', null);
	});

	// check when someone press any key inside the form
	$(document).on('keydown', function (e) {
		var active = $('li.active');
		// if someone press enter inside some element of the form
		if (e.keyCode == 13) {

			// prevent the automatic submition of the form
			e.preventDefault();

			if (active.hasClass('automaticStep') && !active.hasClass('calculationDelayView')) {
				(0, _stepper.eventHandler)('pressOnStep', null);
			} else {
				if (!active.hasClass('notPassing')) {
					active.is('#debtPayment') ? (0, _stepper.eventHandler)('enter', calculationData) : (0, _stepper.eventHandler)('enter', null);
				}
			}
			if (active.hasClass('longFormStep')) lgFormBtn.trigger('click');
		} else if (e.which <= 40 && e.which >= 37 || e.key == 'ArrowRight' || e.key == 'ArrowLeft' || e.key == 'ArrowUp' || e.key == 'ArrowDown') {

			if (active.hasClass('radioInput')) e.preventDefault();
		}
	});

	// validating last form with custom messages
	inputsToValidate.on('keydown', function (e) {
		var $inp = $(e.target),
		    toCheck = $inp.data('check'),
		    errMsg = $inp.closest('.input-field').find('span.errMsg'),
		    key = e.key;

		if (errMsg.css('display') == 'block') errMsg.css('display', 'none');
		if (toCheck == 'rfc' && !key.match(/^[a-zA-Z0-9]+$/)) e.preventDefault();
	}).on('blur', function (e) {
		var $inp = $(e.target),
		    toCheck = $inp.data('check'),
		    errMsg = $inp.closest('.input-field').find('span.errMsg'),
		    value = $inp.val(),
		    validCases = {
			rfc: 'validRFC',
			length10: 'length10',
			zipCode: 'validZip',
			sameEmail: 'sameEmail'
		};

		(0, _customValidator.checkIfValid)($inp, value, validCases[toCheck], errMsg);
	});

	inputsToValidate.on('keydown', function (e) {
		var $inp = $(e.target),
		    toCheck = $inp.data('check'),
		    keyCode = e.which;

		// console.log(keyCode);

		if (toCheck == 'rfc' && $inp.val().length > 12 && keyCode !== 8 && keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 9 && keyCode !== 13) e.preventDefault();
		if (toCheck == 'length10' && $inp.val().length > 9 && keyCode !== 8 && keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 9 && keyCode !== 13) e.preventDefault();
		if (toCheck == 'zipCode' && $inp.val().length > 4 && keyCode !== 8 && keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 9 && keyCode !== 13) e.preventDefault();
	});

	// comifying values

	trickyInputs.keydown(function (e) {
		(0, _commify.numberInputProcess)(e, $(e.target));
	});

	// checking mails correspondance 
	$('input#u_email').blur(function () {
		var theInput = $('input#u_email_c'),
		    errMsg = theInput.closest('.input-field').find('span.errMsg'),
		    theVal = $('input#u_email_c').val();

		var firstMail = $('input#u_email').val(),
		    customValidator = new _customValidator.CustomValid(theVal, firstMail);

		customValidator.sameEmail() ? ($(theInput).data('correct', 'yes'), errMsg.css('display', 'none')) : errMsg.css('display', 'block');
	});

	var empInp = $('#u_n_employees'),
	    empInpM = $('#employeesNumber');

	empInp.keypress(function (e) {
		var inpVal = empInp.val();
		if (inpVal.length > 4 && e.key !== 'Backspace' && e.which !== 8 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') e.preventDefault();
	});

	empInpM.keypress(function (e) {
		var inpVal = empInpM.val();
		if (inpVal.length > 5 && e.key !== 'Backspace' && e.which !== 8 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') e.preventDefault();
	});

	function noSpecialChars(e, nTrue) {
		var theKey = e.key;
		var coreValues = nTrue ? /^[0-9a-zA-ZñÑ\s\W]?$/ : /^[a-zA-ZñÑ\s\W]?$/;
		var maxVal = nTrue ? 100 : 80;
		// console.log(e.which, theKey, 'síEstáCambiando');
		if (theKey !== 'Spacebar' && e.which !== 32 && $(e.target).val().length < maxVal && e.key !== 'Left' && e.key !== 'Right') {
			if ((theKey === '+' || theKey === '-' || theKey == "¡" || theKey == "'" || /^[.,;:=º'`&”<>@ª^~{„…–\\]?$/.test(theKey) || /^[!¡"·$%&/)[\](*Çç¨{}?]?$/.test(theKey) || /^[#∞¢|@¬÷“≠‚^¿]?$/.test(theKey)) && theKey !== undefined) e.preventDefault();
			if (theKey !== undefined && !coreValues.test(theKey) && theKey !== 'ArrowLeft' && theKey !== 'ArrowRight' && theKey !== 'Backspace' && theKey !== 'Tab' && theKey !== 'ArrowDown' && theKey !== 'ArrowUp' && theKey !== 'Enter') e.preventDefault();
		} else if ($(e.target).val().length >= maxVal && e.key !== 'Backspace' && e.which !== 8 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Left' && e.key !== 'Right') {
			e.preventDefault();
		}
	}

	var fullnameInput = $('input#u_fullname'),
	    enterpriseInput = $('input#u_rs');

	enterpriseInput.keydown(function (e) {
		noSpecialChars(e, 'withNum');
	});

	fullnameInput.keydown(function (e) {
		noSpecialChars(e, null);
	});

	var validateMails = function validateMails(e) {
		var theMail = $(e.target),
		    mailVal = theMail.val(),
		    idxDot = 0;

		var idxArroba = mailVal.indexOf('@');

		if (idxArroba !== -1) {
			idxDot = mailVal.slice(idxArroba).indexOf('.');
		} else {
			idxDot = -1;
		}

		// console.log(mailVal.indexOf('.'), mailVal.length - 1, 'mails');

		idxArroba == -1 || idxDot == -1 || mailVal.indexOf('.') == mailVal.length - 1 || mailVal.match(/@/g).length > 1 ? (theMail.addClass('invalid'), theMail.removeClass('valid'), theMail.data('correct', 'no')) : (theMail.removeClass('invalid'), theMail.data('correct', 'yes'), theMail.addClass('valid'));
	};

	var mailInput = $('input#u_email'),
	    mailInputR = $('input#u_email_c');

	mailInput.blur(function (e) {
		return validateMails(e);
	});
	mailInputR.blur(function (e) {
		return validateMails(e);
	});

	mailInput.keydown(function (e) {
		if ($(e.target).val().length >= 80 && e.key !== 'Backspace' && e.which !== 8 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') e.preventDefault();
	});
	mailInputR.keydown(function (e) {
		if ($(e.target).val().length >= 80 && e.key !== 'Backspace' && e.which !== 8 && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') e.preventDefault();
	});

	// check all inputs on last form are filled
	lastFormInputs.on('blur', function () {
		var $emptyFields = lastFormInputs.filter(function (i, e) {
			return $.trim($(e).val()) === "";
		});
		if ($emptyFields.length == 1 && $('#sOptionPersonType').prop('checked')) {
			lastFormFill = $emptyFields.is('#u_rs') ? true : false;
		} else if ($emptyFields.length > 1) {
			lastFormFill = false;
		} else if (!$emptyFields.length) {
			lastFormFill = true;
		}

		privacyPolicyAccepted && lastFormFill && lastFormNoErr ? (lgFormBtn.prop('disabled', false), lgFormBtn.addClass('validAll')) : (lgFormBtn.prop('disabled', true), lgFormBtn.removeClass('validAll'));
	});

	// check all inputs with custom validation are valid
	inputsToValidate.on('blur', function (e) {
		var $wrongFields = inputsToValidate.filter(function (i, ele) {
			return $(ele).data('correct') == 'no';
		});
		lastFormNoErr = !$wrongFields.length ? true : false;
		privacyPolicyAccepted && lastFormFill && lastFormNoErr ? (lgFormBtn.prop('disabled', false), lgFormBtn.addClass('validAll')) : (lgFormBtn.prop('disabled', true), lgFormBtn.removeClass('validAll'));
	});

	// check wether the privacy policy is accepted or not
	policyCheckbox.on('change', function () {

		var policyAccepted = policyCheckbox.is(':checked');
		privacyPolicyAccepted = policyAccepted == true ? true : false;
		lastFormFill && privacyPolicyAccepted && lastFormNoErr ? (lgFormBtn.prop('disabled', false), lgFormBtn.addClass('validAll')) : (lgFormBtn.prop('disabled', true), lgFormBtn.removeClass('validAll'));
	});

	var approvedCreditBtn = $('button#creditApprovedNextStepBtn');

	approvedCreditBtn.click(function () {
		var theFolio = sessionStorage.getItem('folioGrabbed');
		if (theFolio !== undefined && theFolio !== null) {

			(0, _folioShower.folioShower)(theFolio);
			(0, _secondFluxHttpSender.acceptingCreditAfter)();
		}
	});

	var updateObjectToSend = function updateObjectToSend(fl) {

		var goodObject = fl == 'credits' ? {
			desNomTitu: 'u_fullname',
			desNomPrefe: 'u_name',
			desRfc: 'u_rfc',
			cveRegFiscal: 'taxesRegimen',
			desRazSocial: 'u_rs',
			cveActividad: 'u_giro',
			numTelFijo: 'u_phone_2',
			numTelCel: 'u_phone',
			desEmail: 'u_email',
			numCodPos: 'u_zipcode',
			numEmpleados: 'u_n_employees',
			impVentaUltA: 'u_sells',
			impDeudaMen: 'u_debtPayment',
			cveTipoCred: 'creditType',
			cveUsoCred: 'creditUse',
			numPlazo: 'paymentPeriod',
			impSolicitado: 'u_credit',
			impOtorgado: 'approvedCredit',
			bndPrivacidad: 'privacyPolicy',
			bndContactar: 'contactLater'
		} : {
			desNomTitu: 'u_fullname',
			desNomPrefe: 'u_name',
			desRfc: 'u_rfc',
			cveRegFiscal: 'taxesRegimen',
			desRazSocial: 'u_rs',
			cveActividad: 'bussinesType',
			numTelFijo: 'u_phone_2',
			numTelCel: 'u_phone',
			desEmail: 'u_email',
			numCodPos: 'u_zipcode',
			numEmpleados: 'employeesNumber',
			impVentaUltA: 'u_sells',
			bndPrivacidad: 'privacyPolicy',
			bndContactar: 'contactLater',
			cveMenSel: 'membershipType'
		};

		var newObject = {};

		Object.keys(goodObject).forEach(function (prop, i) {
			newObject[prop] = wholeData[goodObject[prop]];
		});

		wholeData = newObject;

		wholeData.desRfc = wholeData.desRfc == undefined || wholeData.desRfc == null ? '' : wholeData.desRfc;

		wholeData.cveProcIni = fl == 'credits' ? 1 : 2;
	};

	var extranInfoProcess = function extranInfoProcess(flux) {
		var dt = new Date(),
		    amountTag = $('.amount');

		// wholeData.reqTime = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
		// wholeData.date = `${dt.getDate()}/${dt.getMonth()}/${dt.getFullYear()}`;

		var toParseAsNumber = {
			credits: ['u_credit', 'u_sells', 'u_debtPayment', 'creditType', 'creditUse', 'paymentPeriod', 'taxesRegimen', 'u_giro', 'u_n_employees', 'u_zipcode'],
			memberships: ['u_sells', 'taxesRegimen', 'employeesNumber', 'bussinesType', 'u_zipcode']
		};

		if (flux == 'credits') wholeData.approvedCredit = (0, _creditCalculator.realValue)(amountTag.data('amount'));

		wholeData.contactLater = $('#cb_hsbc').is(':checked') ? 1 : 0;
		wholeData.privacyPolicy = $('#cb_tc').is(':checked') ? 1 : 0;

		toParseAsNumber[flux].forEach(function (e, i) {
			wholeData[e] = wholeData[e] !== undefined ? (0, _creditCalculator.realValue)(wholeData[e]) : 0;
		});

		updateObjectToSend(flux);
	};

	var processForm = function processForm(whichFlux) {
		if (!lgFormBtn.prop('disabled')) {
			var data = myForm.serializeArray();

			var toUpperCase = ['u_fullname', 'u_rs', 'u_giro', 'u_rfc'];

			data.forEach(function (e) {
				if (toUpperCase.indexOf(e.name) !== -1) e.value = e.value.toUpperCase();
				wholeData[e.name] = e.value;
			});

			extranInfoProcess(whichFlux);
			(0, _folioShower.folioShower)(null);

			// wholeData.folio = sessionStorage.getItem('folioGrabbed');

			console.log(wholeData);

			var dataAsString = JSON.stringify(wholeData),
			    url = '';

			// $.ajax({
			// 	method 		: 'POST',
			// 	url 		: url,
			// 	dataType	: 'json',
			// 	contentType : 'application/json; charset=UTF-8',
			// 	data 		: wholeData
			// }).then(res => {
			// 	console.log(res);
			// 	if(!res.error){
			// 		var realFolio = res.mensaje;
			// 		sessionStorage.setItem('folioGrabbed', realFolio);
			// 		folioShower(realFolio);
			// 	}
			// });

			(0, _stepper.eventHandler)('formSubmit', null);
		}
	};

	var checkBoxMask = $('div.checkboxImg');

	checkBoxMask.click(function (e) {
		$(e.target).toggleClass('checked');
		var checkboxInp = $(e.target).prev('input[type=checkbox]');
		checkboxInp.is(':checked') ? checkboxInp.prop('checked', false) : checkboxInp.prop('checked', true);
		checkboxInp.trigger('change');
	});

	$(lgFormBtn).on('click', function (e) {
		e.preventDefault();
		var flux = $(e.target).data('flux');
		processForm(flux);
	});

	// privacy policy modal open
	privacyLink.click(function () {
		gradientHeader.hide();
		longFormWrapper.css('display', 'none');
		lgFormBtnWrapper.css('display', 'none');
		privacyTxtDiv.css('display', 'block');
	});

	// privacy policy modal close
	privacyTxtCloser.click(function () {
		gradientHeader.show();
		longFormWrapper.css('display', 'block');
		lgFormBtnWrapper.css('display', 'flex');
		privacyTxtDiv.css('display', 'none');
	});

	var printBtn = $('a.printBtn');

	printBtn.click(function (e) {
		e.preventDefault();
		window.print();
	});

	var shareLink = $('a.shareLink');
	var shareBtns = $('.shareOnNet');

	shareLink.click(function () {
		shareLink.hide();
		shareBtns.show();
	});

	shareBtns.click(function (e) {
		var socialMedia = $(e.target).data('social');
		(0, _share.handleSharing)(socialMedia);
	});

	var otherServiceBtn = $('button.otherServiceConnectorBtn');

	otherServiceBtn.click(function (e) {
		e.preventDefault();
		if ($(e.target).hasClass('toMemberships')) {
			window.location.hash = 'membershipsAfter';
		} else if ($(e.target).hasClass('toCredit')) {
			sessionStorage.setItem('u_sells', wholeData.impVentaUltA);
			sessionStorage.setItem('u_name', wholeData.desNomPrefe);
			sessionStorage.setItem('creditAlone', 'yes');
			window.location.href = 'creditAlone.html';
		}
	});

	//////////////////////////////////////// 
	///////////EXTRA MEMBERSHIPS////////////
	////////////////////////////////////////  


	var extraBftsBtn = $('button.moreBenefitsBtn');
	var extraBftsBtnImg = extraBftsBtn.find('img');

	var toggleList = function toggleList(button) {
		var list = button.next('ul.extraBenefits');

		if (button.hasClass('clicked')) {
			button.removeClass('clicked');
			list.removeClass('showing');
		} else {
			button.addClass('clicked');
			list.addClass('showing');
		}
	};

	extraBftsBtn.click(function (e) {
		e.preventDefault();
		var btn = $(e.target);
		toggleList(btn);
	});

	extraBftsBtnImg.click(function (e) {
		e.preventDefault();
		var btn = $(e.target).closest('button');
		toggleList(btn);
	});

	var acceptMembershipBtn = $('button.acceptMemBtn');

	acceptMembershipBtn.click(function (e) {
		var btn = $(e.target),
		    membershipType = Number(btn.data('mem'));

		var theFolio = sessionStorage.getItem('folioGrabbed');
		wholeData.membershipType = membershipType;

		if (theFolio !== undefined && theFolio !== null) {

			var dataToSend = { numFolio: parseInt(theFolio), cveMenSel: membershipType },
			    url = '';

			(0, _secondFluxHttpSender.acceptingMembershipAfter)(url, dataToSend);
		}
	});

	var questionIconMem = $('span.questionIconMem');

	questionIconMem.click(function (e) {
		var myHelper = $(e.target).next('span.helpText');
		myHelper.toggle();
	});

	//////////////////////////////////////// 
	///////////EXTRA MEMBERSHIPS////////////
	////////////////////////////////////////

	var progressBarSteps = $('.progressBar .barStep');
	var stepsNumber = progressBarSteps.length;
	var stepsWidth = 100 / stepsNumber;

	progressBarSteps.css('width', stepsWidth + '%');

	var shadowDiv = $('div.shadowDiv'),
	    closeSpan = $('span.closeSpan');

	shadowDiv.on('dblclick', function (e) {
		var myContainer = $(e.target).closest('div.mistakeDiv');
		myContainer.hide();
	});

	closeSpan.on('click', function (e) {
		var myContainer = $(e.target).closest('div.mistakeDiv');
		myContainer.hide();
	});
});

},{"./commify.js":3,"./costumizeGreeting.js":4,"./creditCalculator.js":5,"./customValidator.js":6,"./folioShower.js":7,"./forceNumberInput.js":8,"./hashObserver.js":9,"./placeholderNamesTimer.js":11,"./secondFluxHttpSender.js":12,"./share.js":13,"./splashAnimator.js":14,"./stepper.js":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
// there's no such a placeholder
// its a span overlayed with the input
// the input's label had been programatically activated to start its animation
// and the words are "injected" to the span
// pros: some browsers don't support placeholder attr, so we don't have to take care about it

var animateFakePlaceholder = exports.animateFakePlaceholder = function animateFakePlaceholder() {

	// collection of names to show to encourage to add a personal name
	var names = ['José', 'María', 'Juan', 'Martha', 'Roberto', 'Daniela', 'Carlos', 'Verónica', 'Ernesto', 'Patricia'];

	var theSpan = $('span.placeholderFake');

	// iteratorWord is the index to pass throught each array itm
	var iteratorWord = 0;
	// interval between each word
	var intervalWords = setInterval(function () {

		var actualName = names[iteratorWord],
		    innerText = '',
		    iteratorLetter = 0;

		// interval between each string letter
		var intervalLetters = setInterval(function () {

			var letter = actualName[iteratorLetter];
			// increase the text to be add as placeholder adding new letters
			innerText += letter;

			theSpan.text(innerText);

			iteratorLetter++;
			// when the index equals the string length, stop the interval
			if (iteratorLetter >= actualName.length) clearInterval(intervalLetters);
		}, 200);

		iteratorWord++;
		// when the index equals the array length, stop the interval
		if (iteratorWord >= names.length) clearInterval(intervalWords);

		// the value of the time the interval must wait each period 
		// change depending on the amount of letter of each different string
	}, 400 * names[iteratorWord].length);
};

// this works to "clear the placeholder and stop the animation"
// 
var clearFakePlaceholder = exports.clearFakePlaceholder = function clearFakePlaceholder() {
	var fakePlaceholder = $('span.placeholderFake'),
	    nameInput = $('#u_name');
	// console.log('hello');
	fakePlaceholder.css('display', 'none');
	nameInput.focus();
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.acceptingCreditAfter = exports.acceptingMembershipAfter = undefined;

var _creditCalculator = require('./creditCalculator.js');

var acceptingMembershipAfter = exports.acceptingMembershipAfter = function acceptingMembershipAfter(url, data) {
	console.log('I would send this acceptingMembershipAfter', data);

	// $.ajax({
	// 	method 		: 'POST',
	// 	url 		: url,
	// 	dataType	: 'json',
	// 	contentType : 'application/json; charset=UTF-8',
	// 	data 		: data
	// }).then(res => {
	// 	console.log(res);
	// 	if(!res.error){
	// 		sessionStorage.clear();
	// 	}
	// });
};

var acceptingCreditAfter = exports.acceptingCreditAfter = function acceptingCreditAfter() {

	var theFolio = sessionStorage.getItem('folioGrabbed');
	var amountTag = $('.amount');
	var simulatedCredit = (0, _creditCalculator.realValue)(amountTag.data('amount'));

	var allInfo = $('form').serializeArray();

	var goodObj = {};

	allInfo.forEach(function (obj) {
		goodObj[obj.name] = obj.value;
	});

	var plazo = goodObj.paymentPeriod !== undefined ? (0, _creditCalculator.realValue)(goodObj.paymentPeriod) : 0;

	var dataToSend = {
		numFolio: parseInt(theFolio),
		impOtorgado: simulatedCredit,
		impSolicitado: (0, _creditCalculator.realValue)(goodObj.u_credit),
		impDeudaMen: (0, _creditCalculator.realValue)(goodObj.u_debtPayment),
		cveTipoCred: (0, _creditCalculator.realValue)(goodObj.creditType),
		cveUsoCred: (0, _creditCalculator.realValue)(goodObj.creditUse),
		numPlazo: plazo
	};

	var url = '';

	console.log('I would send this acceptingCreditAfter', dataToSend);

	// $.ajax({
	// 	method 		: 'POST',
	// 	url 		: url,
	// 	dataType	: 'json',
	// 	contentType : 'application/json; charset=UTF-8',
	// 	data 		: dataToSend
	// }).then(res => {
	// 	if(!res.error){
	// 		console.log('we did it');
	// 		sessionStorage.clear();
	// 	}
	// });
};

},{"./creditCalculator.js":5}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var shareFB = function shareFB() {
	FB.init({
		appId: '136452930367815',
		cookie: true,
		xfbml: true,
		version: 'v2.11'
	});

	FB.ui({
		method: 'share',
		href: 'https://personal.hsbc.com.mx/fusion/',
		hashtag: '#HSBCFusion'
	}, function (response) {
		console.log(response);
	});
};

var shareLinkedin = function shareLinkedin() {
	console.log('shareLinkedin');
};

var shareTwitter = function shareTwitter() {
	window.open('https://twitter.com/intent/tweet?hashtags=HSBCFusion&amp;original_referer=' + encodeURIComponent(window.location.origin) + '&amp;ref_src=twsrc%5Etfw&amp;text=Yo%20administro%20mis%20finanzas%20personales%20y%20las%20de%20mi%20negocio%20en%20un%20mismo%20lugar%20con%20HSBC%20Fusion.%20T%C3%BA%20tambi%C3%A9n%20empieza%20a%20ahorrar%20tiempo%20y%20dinero%2C%20visita%20HSBC%20Fusion&amp;tw_p=tweetbutton&amp;url=https%3A%2F%2Fpersonal.hsbc.com.mx%2Ffusion%2F', '', '50%', '50%');
};

var handleSharing = exports.handleSharing = function handleSharing(socialNet) {
	if (socialNet == 'F') {
		shareFB();
	} else if (socialNet == 'L') {
		shareLinkedin();
	} else if (socialNet == 'T') {
		shareTwitter();
	}
};

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.animateSplash = undefined;

var _placeholderNamesTimer = require('./placeholderNamesTimer.js');

var animateSplash = exports.animateSplash = function animateSplash(splashImg, nameLabel) {
	setTimeout(function () {
		splashImg.fadeOut(400);
		nameLabel.addClass('active');
		(0, _placeholderNamesTimer.animateFakePlaceholder)();
	}, 1700);
};

},{"./placeholderNamesTimer.js":11}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.eventHandler = exports.passNextStep = undefined;

var _costumizeGreeting = require('./costumizeGreeting.js');

var _animateCreditFlux = require('./animateCreditFlux.js');

var _benefitsAnimator = require('./benefitsAnimator.js');

var _folioShower = require('./folioShower.js');

var _secondFluxHttpSender = require('./secondFluxHttpSender.js');

var _creditCalculator = require('./creditCalculator.js');

var $stepper = $('ul.stepper'),
    firstStep = $('li').first();

var animateIfSome = function animateIfSome($step, extra) {
	var barStep = $step.data('stepBar');

	if (barStep !== undefined && barStep !== false) {
		// change
		extra ? (0, _animateCreditFlux.animateCreditFlux)([3, 4]) : (0, _animateCreditFlux.animateCreditFlux)(barStep);;
		(0, _animateCreditFlux.changeBottomImage)(barStep);
		// check if the step actually has such a data attr and that is not empty
	}
};

var passNextStep = exports.passNextStep = function passNextStep(actualStep, stepsAhead) {
	// change
	var nextStep = stepsAhead < 2 ? actualStep.next('li') : actualStep.next('li').next('li');
	if (firstStep.hasClass('active')) (0, _costumizeGreeting.addNameOnGreeting)();

	var newHash = nextStep.data('stepName');
	// console.log(actualStep.data('stepName'), nextStep.data('stepName'));

	if (newHash !== undefined && newHash !== null) {
		window.location.hash = newHash;
	} else {
		var nextSteps = {
			greeting: 'shortIntro',
			shortIntro: 'benefits',
			benefits: 'presentation'
		};
		var recHash = sessionStorage.getItem('recordedHash');

		if (nextSteps[recHash] !== undefined && nextSteps[recHash] !== null) window.location.hash = nextSteps[recHash];
	}

	if (newHash == 'benefits') {
		setTimeout(function () {
			(0, _benefitsAnimator.animateBenefits)();
		}, 170);
	} else if (newHash == 'presentation') {
		setTimeout(function () {
			(0, _benefitsAnimator.clearBenefits)();
		}, 170);
	};
	stepsAhead > 1 ? animateIfSome(nextStep, true) : animateIfSome(nextStep, false);
};

var validateEmail = function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
};

var checkIfInputsAreValid = function checkIfInputsAreValid(aStep, infoToProcess) {
	if (aStep.hasClass('withInput')) {

		var theInput = aStep.find('input'),
		    inputType = theInput.attr('type');

		if (inputType == 'email') {
			if (!theInput.hasClass('valid')) {
				if (theInput.val().length > 0 && validateEmail(theInput.val())) {
					passNextStep(aStep, 1);
				} else {
					var errorSpan = theInput.next('span.requiredField');
					if (errorSpan.length < 1) {
						theInput.after('<span class="requiredField">Este campo es requerido</span>');
					}
				}
			}
		} else {
			if (theInput.hasClass('valid') || theInput.val().length > 0) {
				if (theInput.hasClass('trickyInput')) {
					var inputNumVal = (0, _creditCalculator.realValue)(theInput.val());

					if (inputNumVal < 1 && !theInput.is('#employeesNumber') && !theInput.is('#u_debtPayment')) {
						var errorSpan = theInput.next('span.requiredField');
						if (errorSpan.length < 1) {
							theInput.after('<span class="requiredField">El valor tiene que ser mayor a cero</span>');
						}
					} else if (inputNumVal > 0 || theInput.is('#employeesNumber') || theInput.is('#u_debtPayment')) {
						if (theInput.val().length > 0) {
							passNextStep(aStep, 1);
							if (theInput.is('#u_debtPayment')) (0, _creditCalculator.creditCalculator)(infoToProcess);
						} else {
							var errorSpan = theInput.next('span.requiredField');
							if (errorSpan.length < 1) {
								theInput.after('<span class="requiredField">Este campo es requerido</span>');
							}
						}
					}
				} else {
					passNextStep(aStep, 1);
				}
			} else {
				var errorSpan = theInput.next('span.requiredField');
				if (errorSpan.length < 1) {
					theInput.after('<span class="requiredField">Este campo es requerido</span>');
				}
			}
		}
	} else {
		passNextStep(aStep, 1);
	}
};

var eventHandler = exports.eventHandler = function eventHandler(event, extraInfo) {
	var activeStep = $stepper.find('li.active');

	// console.log(event, activeStep);

	if (event == 'clickOnBtn') {

		if (!activeStep.hasClass('longFormStep')) checkIfInputsAreValid(activeStep, extraInfo);
	} else if (event == 'clickOnRadio') {

		extraInfo == 'revolventeClick' ? passNextStep(activeStep, 2) : passNextStep(activeStep, 1);
	} else if (event == 'pressOnStep') {
		if (activeStep.hasClass('calculationDelayView')) {
			if (activeStep.data('ready') !== 'no') {
				passNextStep(activeStep, 1);
				activeStep.addClass('noVisible');
			}
		} else {
			passNextStep(activeStep, 1);
		}
	} else if (event == 'enter') {

		if (activeStep.is('#approvedCredit') && sessionStorage.getItem('creditAlone') !== null && sessionStorage.getItem('creditAlone') !== undefined) {
			(0, _folioShower.folioShower)(null);
			(0, _secondFluxHttpSender.acceptingCreditAfter)();
		} else if (activeStep.hasClass('calculationDelayView')) {
			if (activeStep.data('ready') !== 'no') {
				passNextStep(activeStep, 1);
				activeStep.addClass('noVisible');
			}
		}

		if (!activeStep.hasClass('radioInput') && !activeStep.hasClass('longFormStep') && !activeStep.hasClass('membershipsStep') && !activeStep.hasClass('calculationDelayView')) checkIfInputsAreValid(activeStep, extraInfo);
	} else if (event == 'automaticStep') {

		var animatedStepT = activeStep.data('animated');

		if (animatedStepT !== undefined && animatedStepT !== false) {
			var animationTime = Number(animatedStepT);
			(0, _animateCreditFlux.automatizeFlux)(animationTime, activeStep);
		}
	} else if (event == 'formSubmit') {

		passNextStep(activeStep, 1);
	}
};

},{"./animateCreditFlux.js":1,"./benefitsAnimator.js":2,"./costumizeGreeting.js":4,"./creditCalculator.js":5,"./folioShower.js":7,"./secondFluxHttpSender.js":12}]},{},[10]);
