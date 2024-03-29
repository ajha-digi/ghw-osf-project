import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from '@oracle-cx-commerce/react-widgets/checkout/checkout-single-shipping-details/config';

const widgetResourceKeys = [
  'actionCancel',
  'labelShippingOptions',
  'headingShippingOptions',
  'textEnterAShippingAddress',
  'textNoShippingMethods',
  'headingHomeDelivery',
  'headingShippingTo',
  'labelEditAddress',
  'labelOpenAddressBook',
  'textOpenAddressBookAndChooseAddress',
  'labelAddANewAddress',
  'actionMoveToWishList',
  'messagePartialBackOrder',
  'messageInsufficientStock',
  'messageInsufficientStockAtStore',
  'messageItemNoLongerAvailable',
  'messageQuantityManditory',
  'labelProductQuantity',
  'actionRemoveItem',
  'shippingSurchargeText',
  'textTotal',
  'textItemDetails',
  'textItemPrice',
  'textQuantity',
  'textGiftItem',
  'textSelectGiftMessage',
  'actionSelect',
  'textFreeProduct',
  'textFreeGift',
  'textFree',
  'textChange',
  'textSelectGift',
  'alertAddToCartAdding',
  'textInStock',
  'textOutOfStock',
  'textPreOrderable',
  'textBackOrderable',
  'textSelectOptionOnline',
  'actionAddToCartPreOrder',
  'alertTotalItemQuantityExceeded',
  'textGWPInvalidation',
  'alertOutOfStock',
  'alertCartHeading',
  'alertNoLongerForSale',
  'messageAtTheRate',
  'messagePriceChange',
  'alertPriceIncreased',
  'alertPriceDecreased',
  'messagePartialPreOrder',
  'messageStatusPreOrder',
  'messageStatusBackOrder',
  'closeLinkAltText',
  'textAllFieldsRequired',
  'textInvalidField',
  'textRequiredField',
  'labelNickName',
  'labelCompanyName',
  'labelFirstName',
  'labelLastName',
  'labelCountry',
  'labelZipCode',
  'labelState',
  'labelStreetAddress',
  'labelTownCity',
  'labelPhoneNumberOptional',
  'labelSaveAsANewProfileAddress',
  'labelSaveAsANewAccountAddress',
  'labelCancel',
  'buttonSaveAndContinue',
  'textAccountAddressBook',
  'textAccountAddress',
  'textProfileAddress',
  'textDefaultAddresses',
  'textProfileAddresses',
  'textInheritedAddresses',
  'textAddressesForThisAccount',
  'labelDefaultShippingAddress',
  'labelDefaultBillingAddress',
  'labelNoDefaultShippingAddressAvailable',
  'labelNoDefaultBillingAddressAvailable',
  'labelNoDefaultAddressesAvailable',
  'labelNoProfileAddressesAvailable',
  'labelNoAccountAddressesAvailable',
  'labelNoInheritedAddressesAvailable',
  'textLoading',
  'textLoadMoreAccountAddress',
  'textLoadMoreProfileAddress',
  'textLoadMoreInheritedAddress',
  'textUseThisAddress',
  'headingAddressBook',
  'labelAddressBook',
  'labelDefaultAddress',
  'headingAddShippingAddress',
  'headingEditShippingAddress',
  'alertShippingGroupUpdated',
  'alertAddressCreatedSuccessfully',
  'alertAddressChangedSuccessfully',
  'headingDeliveryAddress',
  'actionShowDetails',
  'actionHideDetails',
  'textPrice',
  'textSiteIcon',
  'alertNoLongerForSaleQuote',
  'alertOrderHeading',
  'alertOutOfStockQuote',
  'textHideAddOns',
  'textShowAddOns'
];
export default {
  name: 'GHWCheckoutSingleShippingDetails',
  decription: 'Description of widget GHWCheckoutSingleShippingDetails',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  availableToAllPages: false,
  config: mergeDefaultConfig(config),
  pageTypes: ['checkout-shipping'],
  resources: buildResources(resourceBundle, widgetResourceKeys),
  requiresContext: ['checkout_shipping_context', 'cart_context']
};
