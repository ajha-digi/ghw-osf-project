/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
 import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
 import {
   getCardType,
   formatCardNumber,
   isCardNumberNumericAndMatchesLength,
   isMaskedCardNumberMatchesLength,
   validateCardNumber,
   validateCVV,
   validateExpiryMonth,
   validateExpiryYear,
   validateRequiredField
 } from '@oracle-cx-commerce/react-components/utils/payment';
 import Styled from '@oracle-cx-commerce/react-components/styled';
 import WarningIcon from '@oracle-cx-commerce/react-components/icons/warning';
 import CardCVVIcon from '@oracle-cx-commerce/react-components/icons/card-cvv';
 import {t, noop} from '@oracle-cx-commerce/utils/generic';
 import {connect} from '@oracle-cx-commerce/react-components/provider';
 import {PAYMENT_TYPE_CARD} from '@oracle-cx-commerce/commerce-utils/constants';
 import {getCardDetailsData} from './selectors';
 import css from './checkout-card-details.css';
 import CardTypes from './card-types';
 
 /**
  * Widget for card details.
  * Provides option for entering card details
  */
 const CheckoutCardDetails = props => {
   const {
     appliedPaymentGroupCardDetails = {},
     cardTypes,
     id,
     selectedPaymentType,
     isPaymentDisabled = false,
     labelCardCVV,
     labelCardNumber,
     labelExpiryDate,
     labelExpiryMonth,
     labelExpiryYear,
     labelNameOnCard,
     onInput = noop,
     textFieldInvalid,
     textRequiredField,
     useAnotherCard = true
   } = props;
 
   const [selectedCardType, setSelectedCardType] = useState({});
   const [cardDetails, setCardDetails] = useState({
     cardNumber: '',
     expiryMonth: '',
     expiryYear: '',
     nameOnCard: ''
   });
 
   const cvvElementRef = useRef();
   const expiryMonthElementRef = useRef();
   const expiryYearElementRef = useRef();
   const cardContainerElementRef = useRef();
 
   // The card number from the applied payment group for the credit card
   const appliedCardNumber = appliedPaymentGroupCardDetails.cardNumber
     ? appliedPaymentGroupCardDetails.cardNumber.replace(/x/g, '*')
     : undefined;
 
   const validators = useMemo(
     () => ({
       cardNumber: cardNumber => {
         let validationMessage = '';
         const rawCardNumber = cardNumber.replace(/\s+/g, '');
         // do not validate if the card number is set to the value from the applied payment group
         if (appliedCardNumber !== rawCardNumber) {
           validationMessage = validateCardNumber(
             rawCardNumber,
             selectedCardType.length || getCardType(rawCardNumber, cardTypes).length,
             {
               messageCardNumberInvalid: t(textFieldInvalid, {fieldName: labelCardNumber}),
               messageCardNumberRequired: textRequiredField
             }
           );
         }
 
         return validationMessage;
       },
       cardCVV: cardCVV =>
         validateCVV(cardCVV, selectedCardType.cvvLength, {
           messageCardCVVInvalid: t(textFieldInvalid, {fieldName: labelCardCVV}),
           messageCardCVVRequired: textRequiredField
         }),
       expiryMonth: expiryMonth =>
         validateExpiryMonth(expiryMonth, cardDetails.expiryYear, {
           messageExpiryDateInvalid: t(textFieldInvalid, {fieldName: labelExpiryDate}),
           messageExpiryDateRequired: textRequiredField
         }),
       expiryYear: expiryYear =>
         validateExpiryYear(expiryYear, {
           messageExpiryDateInvalid: t(textFieldInvalid, {fieldName: labelExpiryDate}),
           messageExpiryDateRequired: textRequiredField
         }),
       nameOnCard: nameOnCard => validateRequiredField(nameOnCard, textRequiredField)
     }),
     [
       appliedCardNumber,
       cardDetails.expiryYear,
       cardTypes,
       labelCardCVV,
       labelCardNumber,
       labelExpiryDate,
       selectedCardType.cvvLength,
       selectedCardType.length,
       textFieldInvalid,
       textRequiredField
     ]
   );
 
   /**
    * Returns the error message sibling element
    * @param {Object} The element
    * @param {function} The function to validate element
    */
   const getErrorMessageElement = element => {
     const fieldName = element.name;
     const errorMessageContainer =
       fieldName === 'expiryMonth' || fieldName === 'expiryYear' || fieldName === 'cardCVV'
         ? element.parentElement.nextElementSibling.querySelector('.CheckoutCardDetails__ErrorMessage')
         : element.nextElementSibling.querySelector('.CheckoutCardDetails__ErrorMessage');
 
     return errorMessageContainer;
   };
 
   /**
    * Validate the element to set any custom errors
    * @param {Object} The element to validate
    * @param {function} The function to validate element
    */
   const setElementValidity = useCallback((element, validator) => {
     element.setCustomValidity('');
     element.classList.remove('CheckoutCardDetails__Invalid');
 
     if (validator) {
       element.setCustomValidity(validator(element.value));
     }
 
     if (element.validationMessage) {
       element.classList.add('CheckoutCardDetails__Invalid');
     }
 
     const errorMessageContainer = getErrorMessageElement(element);
     if (errorMessageContainer) {
       errorMessageContainer.textContent = element.validationMessage;
     }
   }, []);
 
   // If card payment is disabled reset card details
   useEffect(() => {
     if (isPaymentDisabled) {
       // clear all invalid messages since the fields will be disabled
       const cardContainerElement = cardContainerElementRef.current;
       if (cardContainerElement) {
         const invalidElements = cardContainerElement.querySelectorAll('.CheckoutCardDetails__Invalid');
         invalidElements.forEach(element => {
           element.classList.remove('CheckoutCardDetails__Invalid');
           element.setCustomValidity('');
           const errorMessageContainer = getErrorMessageElement(element);
           if (errorMessageContainer) {
             errorMessageContainer.textContent = '';
           }
         });
       }
       // reset card details to empty if any of the values is not empty
       if (Object.values(cardDetails).some(cardDetail => cardDetail !== '')) {
         setCardDetails({
           cardNumber: '',
           cardCVV: '',
           expiryMonth: '',
           expiryYear: '',
           nameOnCard: ''
         });
       }
     }
   }, [isPaymentDisabled, cardDetails]);
 
   // validate CVV when card type changes
   useEffect(() => {
     const cvvElement = cvvElementRef.current;
     if (cvvElement && cvvElement.value) {
       setElementValidity(cvvElement, validators[cvvElement.name]);
     }
   }, [selectedCardType, setElementValidity, validators]);
 
   // reset cvv when a different payment type or saved card is selected
   useEffect(() => {
     if (cardDetails.cardCVV !== '' && (!useAnotherCard || selectedPaymentType !== PAYMENT_TYPE_CARD)) {
       setCardDetails(cardDetails => {
         return {...cardDetails, cardCVV: ''};
       });
     }
   }, [useAnotherCard, selectedPaymentType, cardDetails.cardCVV]);
 
   // Call onInput callback to update the state in the parent component
   useEffect(() => {
     if (useAnotherCard) {
       const currentYear = new Date().getUTCFullYear().toString();
       onInput({
         ...cardDetails,
         expiryYear: cardDetails.expiryYear ? `${currentYear.substr(0, 2)}${cardDetails.expiryYear}` : '',
         cardType: selectedCardType.repositoryId ? selectedCardType.repositoryId : '',
         type: PAYMENT_TYPE_CARD
       });
     }
   }, [cardDetails, onInput, selectedCardType.repositoryId, useAnotherCard]);
 
   // Validate expiry month when expiry year changes
   useEffect(() => {
     const expiryMonthElement = expiryMonthElementRef.current;
     const expiryYearElement = expiryYearElementRef.current;
     // if year is valid and expiry month is not empty validate month
     if (
       expiryYearElement &&
       !validators[expiryYearElement.name](cardDetails.expiryYear) &&
       expiryMonthElement &&
       expiryMonthElement.value
     ) {
       setElementValidity(expiryMonthElement, validators[expiryMonthElement.name]);
     }
   }, [cardDetails.expiryYear, setElementValidity, validators]);
 
   // Set the appliedCreditCardPaymentGroup card details to the state
   useEffect(() => {
     if (appliedCardNumber && cardTypes) {
       setSelectedCardType(cardTypes[appliedPaymentGroupCardDetails.cardType]);
       setCardDetails({
         cardNumber: appliedCardNumber,
         nameOnCard: appliedPaymentGroupCardDetails.nameOnCard,
         expiryMonth: appliedPaymentGroupCardDetails.expiryMonth,
         expiryYear: appliedPaymentGroupCardDetails.expiryYear.substr(-2)
       });
     }
   }, [
     appliedCardNumber,
     appliedPaymentGroupCardDetails.cardType,
     appliedPaymentGroupCardDetails.nameOnCard,
     appliedPaymentGroupCardDetails.expiryMonth,
     appliedPaymentGroupCardDetails.expiryYear,
     cardTypes
   ]);
 
   /**
    * Updates state
    * @param {fieldName} String The fieldName to update
    * @param {fieldValue} String The fieldValue
    */
   const updateState = (fieldName, fieldValue) => {
     setCardDetails(cardDetails => {
       const cardDetail = {
         ...cardDetails,
         [fieldName]: fieldValue
       };
 
       return cardDetail;
     });
   };
 
   /**
    * Called when input changes to set the state.
    * @param {Object} event The event object
    */
   const onInputChange = event => {
     const element = event.target;
     const fieldValue = element.value;
     const fieldName = element.name;
     const regex = /^[0-9]+$/;
     // set custom validity to determine if the element is valid
     // required to update payment context
     element.setCustomValidity(validators[fieldName](fieldValue));
 
     if (fieldName === 'nameOnCard' || fieldValue === '' || regex.test(fieldValue)) {
       updateState(fieldName, fieldValue);
     }
   };
 
   /**
    * Updates state as card number changes.
    * @param {Object} event The event object
    */
   const onCardNumberChange = event => {
     const element = event.target;
     const fieldName = element.name;
     const rawCardNumber = element.value;
 
     // remembers cursor position and set it after repaint so that cursor position for card number is not lost after formatting
     const oldPosition = event.target.selectionStart;
     window.requestAnimationFrame(() => {
       const newPos = Math.max(0, element.value.length - rawCardNumber.length + oldPosition);
       element.selectionStart = newPos;
       element.selectionEnd = newPos;
     });
 
     const cardNumber = element.value.replace(/\s+/g, '');
     element.setCustomValidity(validators[fieldName](cardNumber));
     // if the card number is the same as the applied credit card payment group,
     // use the card type from the applied payment group, since the card type cant be determined from the masked card number.
     const cardType =
       appliedCardNumber === cardNumber
         ? cardTypes[appliedPaymentGroupCardDetails.cardType]
         : getCardType(cardNumber, cardTypes);
     if (
       cardNumber === '' ||
       (!cardNumber.includes('*')
         ? isCardNumberNumericAndMatchesLength(cardNumber, cardType.length, true)
         : isMaskedCardNumberMatchesLength(cardNumber, cardType.length))
     ) {
       updateState(element.name, cardNumber);
     }
 
     if (cardType.repositoryId !== selectedCardType.repositoryId) {
       setSelectedCardType(cardType);
     }
   };
 
   /** Validates expiry month or year element on blur
    *  @param {Object} element The element to validate
    */
   const validateExpiryMonthYear = element => {
     if (
       element &&
       element.current &&
       (element.current.value || element.current.classList.contains('CheckoutCardDetails__Invalid'))
     ) {
       setElementValidity(element.current, validators[element.current.name]);
     }
   };
 
   /**
    * Validates input on element blur
    * @param {Object} event The event object
    */
   const validateInput = event => {
     const element = event.target;
     const validator = validators[element.name];
     if (validator) {
       setElementValidity(element, validator);
     }
 
     if (!element.validationMessage) {
       if (element.name === 'expiryMonth') {
         validateExpiryMonthYear(expiryYearElementRef);
       } else if (element.name === 'expiryYear') {
         validateExpiryMonthYear(expiryMonthElementRef);
       }
     }
   };
 
   return (
     <Styled id="CheckoutCardDetails" css={css}>
       <div className="CheckoutCardDetails cc-cnr" ref={cardContainerElementRef}>
       <div className="CheckoutCardDetails__Row form-field full-width">
           <input
             type="text"
             id={`nameOnCard-${id}`}
             name="nameOnCard"
             onChange={onInputChange}
             onBlur={validateInput}
             value={cardDetails.nameOnCard}
             disabled={!useAnotherCard || isPaymentDisabled}
             autoCapitalize="words"
             required
             autoComplete="cc-name"
             className="CheckoutCardDetails__Input form-field__input"
             placeholder="&nbsp;"
           />
           <label htmlFor={`nameOnCard-${id}`} className='form-field__label'>{labelNameOnCard}</label>
           <span class="focus-bg"></span>
           <div className="CheckoutCardDetails__ErrorContainer">
             <span className="CheckoutCardDetails__ErrorMessage"></span>
             <span className="CheckoutCardDetails__ErrorIconContainer">
               <WarningIcon />
             </span>
           </div>
         </div>
         <div className="CheckoutCardDetails__Row CheckoutCardDetails__CardNumberAndTypeContainer cc-row">
           <div className="CheckoutCardDetails__CardNumberContainer form-field">
             
             <input
               type="text"
               id={`cardNumber-${id}`}
               name="cardNumber"
               onChange={onCardNumberChange}
               onBlur={validateInput}
               value={formatCardNumber(cardDetails.cardNumber, selectedCardType.repositoryId)}
               disabled={!useAnotherCard || isPaymentDisabled || !cardTypes}
               required
               autoComplete="cc-number"
               placeholder="&nbsp;"
               inputMode="numeric"
               onKeyDown={event => {
                 // prevent key(*) entry, key used to denote masked card number cant be entered
                 if (event.key === '*') {
                   event.preventDefault();
                 }
               }}
               className="CheckoutCardDetails__Input CheckoutCardDetails__cardNumber form-field__input"
             />
             <label htmlFor={`cardNumber-${id}`} className='form-field__label'>{labelCardNumber}</label>
             <span class="focus-bg"></span>
             <div className="CheckoutCardDetails__ErrorContainer">
               <span className="CheckoutCardDetails__ErrorMessage"></span>
               <span className="CheckoutCardDetails__ErrorIconContainer">
                 <WarningIcon />
               </span>
             </div>
           </div>
         
           <div className="CheckoutCardDetails__ExpiryDateContainer form-field">
             
             <div className="CheckoutCardDetails__ExpiryDateInputRegion form-field">
               <input
                 className="CheckoutCardDetails__ExpiryDateInput CheckoutCardDetails__Input form-field__input"
                 type="text"
                 id={`expiryMonth-${id}`}
                 name="expiryMonth"
                 onChange={onInputChange}
                 onBlur={validateInput}
                 value={cardDetails.expiryMonth}
                 maxLength={2}
                 ref={expiryMonthElementRef}
                 aria-label={labelExpiryMonth}
                 disabled={!useAnotherCard || isPaymentDisabled}
                 required
                 autoComplete="cc-exp-month"
                 inputMode="numeric"
                 placeholder="&nbsp;"
               />
               <span className="CheckoutCardDetails__ExpiryDateSeparator">/</span>
               <input
                 className="form-field__input CheckoutCardDetails__ExpiryDateInput CheckoutCardDetails__Input"
                 type="text"
                 id={`expiryYear-${id}`}
                 name="expiryYear"
                 onChange={onInputChange}
                 onBlur={validateInput}
                 value={cardDetails.expiryYear}
                 maxLength={2}
                 ref={expiryYearElementRef}
                 aria-label={labelExpiryYear}
                 disabled={!useAnotherCard || isPaymentDisabled}
                 required
                 autoComplete="cc-exp-year"
                 inputMode="numeric"
                 placeholder="&nbsp;"
               />
               <label htmlFor={`expiryMonth-${id}`} className='form-field__label'>{labelExpiryDate}</label>
               <span class="focus-bg"></span>
             </div>
             
             
             <div className="CheckoutCardDetails__ErrorContainer form-field">
               <span className="CheckoutCardDetails__ErrorMessage"></span>
               <span className="CheckoutCardDetails__ErrorIconContainer">
                 <WarningIcon />
               </span>
             </div>
           </div>
         </div>
         
       </div>
     </Styled>
   );
 };
 
 export default connect(getCardDetailsData)(CheckoutCardDetails);
