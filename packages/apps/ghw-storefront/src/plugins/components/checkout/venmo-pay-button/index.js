import React, {useContext, useState, useEffect, useRef} from 'react';
import {StoreContext, PaymentsContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getWidgetInfo} from '../../../selectors';
import {useInitializeWidget} from '../../../fetchers/hooks';
import {Braintree} from '../helpers/braintree-loader';
import Styled from '@oracle-cx-commerce/react-components/styled';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import {PAYMENT_TYPE_GENERIC} from '@oracle-cx-commerce/commerce-utils/constants';
import css from './styles.css';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import {isAuthenticated, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';

const setupVenmoWidget = async props => {
  const {clientToken} = props;
  const braintree = await Braintree();
  const clientInstance = await braintree.client.create({authorization: clientToken});
  const venmoInstance = await braintree.venmo.create({
    client: clientInstance,
    allowDesktop: true,
    allowNewBrowserTab: false,
    paymentMethodUsage: 'multi_use'
  });
  return venmoInstance.isBrowserSupported() ? venmoInstance : null;
};

const VenmoPayButton = props => {
  const {clientToken, venmoNotSupportedMsg, id, savePaymentMethodLabel = 'Save this payment method?'} = props;
  const [showSpinner, setShowSpinner] = useState(true);
  const [isVenmoSupported, setIsVenmoSupported] = useState(true);
  const [venmoInstance, setVenmoInstance] = useState(null);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const isPaymentSuccess = useRef(false);
  const store = useContext(StoreContext);
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};
  useInitializeWidget(store);
  useEffect(() => {
    if (!clientToken) {
      return;
    }
    setupVenmoWidget({clientToken}).then(venmo => {
      if (!venmo) {
        setIsVenmoSupported(false);
      }
      setShowSpinner(false);
      setVenmoInstance(venmo);
    });
  }, [clientToken]);
  return (
    <Styled id="VenmoPayButton" css={css}>
      {!isVenmoSupported && <div>{venmoNotSupportedMsg}</div>}
      {showSpinner && isVenmoSupported && (
        <div>
          <SpinnerContent />
        </div>
      )}
      {!showSpinner && isVenmoSupported && (
        <>
          {isUserLoggedIn && (
            <div>
              <Checkbox
                id={`VenmoPayButton-save-payment-option-${id}`}
                name={`VenmoPayButton-save-payment-option-${id}`}
                value={savePaymentMethod}
                labelText={savePaymentMethodLabel}
                disabled={isPaymentSuccess.current}
                onChange={e => {
                  setSavePaymentMethod(e.currentTarget.checked);
                }}
              ></Checkbox>
            </div>
          )}
          <div>
            <svg
              id="venmo-button"
              onClick={() => {
                if (venmoInstance) {
                  venmoInstance
                    .tokenize()
                    .then(payload => {
                      console.log('##################### VENMO PAYMENT DETAILS ###########################');
                      console.log(payload.details);
                      setSelectedPaymentType(PAYMENT_TYPE_GENERIC);
                      addOrUpdatePaymentToContext({
                        customProperties: {nonce: payload.nonce, savePayment: savePaymentMethod},
                        type: PAYMENT_TYPE_GENERIC
                      });
                      setSelectedPaymentInfo({paymentType: 'venmo'});
                      isPaymentSuccess.current = true;
                    })
                    .catch(err => console.error(err));
                }
              }}
            >
              <title>svg/blue_venmo_button_280x48</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="blue_venmo_button_280x48">
                  <rect id="Rectangle" fill="#009cde" x="0" y="0" width="280" height="48" rx="4"></rect>
                  <g id="Group" transform="translate(98.000000, 16.000000)" fill="#FFFFFF">
                    <path
                      d="M14.1355722,0.0643062201 C14.6997229,0.996022242 14.9540614,1.95569119 14.9540614,3.16795034 C14.9540614,7.03443424 11.6533091,12.0572714 8.97435371,15.5842648 L2.85545503,15.5842648 L0.401435711,0.910859951 L5.75920168,0.402203543 L7.05667586,10.8432743 C8.26898429,8.86832019 9.76503373,5.76467606 9.76503373,3.64865382 C9.76503373,2.49041769 9.56660332,1.70150782 9.25650148,1.0519281 L14.1355722,0.0643062201 L14.1355722,0.0643062201 Z"
                      id="Shape"
                    ></path>
                    <path
                      d="M21.0794779,6.525633 C22.0654018,6.525633 24.5475201,6.07462046 24.5475201,4.66393896 C24.5475201,3.98655114 24.0685351,3.64865382 23.5040948,3.64865382 C22.5165776,3.64865382 21.2206966,4.83281521 21.0794779,6.525633 L21.0794779,6.525633 Z M20.9665029,9.31947756 C20.9665029,11.0419863 21.924328,11.7177809 23.1941378,11.7177809 C24.5769225,11.7177809 25.9009024,11.3798836 27.6217431,10.505377 L26.9735853,14.9065874 C25.7611321,15.4989577 23.8715531,15.8942092 22.0374478,15.8942092 C17.3850512,15.8942092 15.7199738,13.0728462 15.7199738,9.545708 C15.7199738,4.97417302 18.4284766,0.120067244 24.0124822,0.120067244 C27.08685,0.120067244 28.8059526,1.84243114 28.8059526,4.24073451 C28.8062423,8.10707358 23.8437439,9.29152463 20.9665029,9.31947756 L20.9665029,9.31947756 Z"
                      id="Shape"
                    ></path>
                    <path
                      d="M44.2677372,3.50758567 C44.2677372,4.07185827 44.1821369,4.89031424 44.0969712,5.42518557 L42.4892503,15.58412 L37.2722686,15.58412 L38.7387707,6.27159447 C38.7665799,6.01900427 38.8520354,5.51049269 38.8520354,5.22835639 C38.8520354,4.55096858 38.4288137,4.3819475 37.9199918,4.3819475 C37.2441697,4.3819475 36.5667543,4.69203673 36.1155786,4.918412 L34.4522393,15.5842648 L29.2058551,15.5842648 L31.6026627,0.374540282 L36.1433878,0.374540282 L36.2008892,1.58853744 C37.2721237,0.88319669 38.6827177,0.120356912 40.6841129,0.120356912 C43.3356936,0.120067244 44.2677372,1.47498771 44.2677372,3.50758567 L44.2677372,3.50758567 Z"
                      id="Shape"
                    ></path>
                    <path
                      d="M59.7554481,1.78507694 C61.2496147,0.713885943 62.6604983,0.120067244 64.6058406,0.120067244 C67.2846511,0.120067244 68.216405,1.47498771 68.216405,3.50758567 C68.216405,4.07185827 68.1310944,4.89031424 68.0459287,5.42518557 L66.4400908,15.58412 L61.2216606,15.58412 L62.7161168,6.07476529 C62.7436363,5.82058192 62.8014274,5.51049269 62.8014274,5.31380835 C62.8014274,4.55111341 62.3780609,4.3819475 61.8693838,4.3819475 C61.2213709,4.3819475 60.5736477,4.6640838 60.0927798,4.918412 L58.4297302,15.5842648 L53.2126036,15.5842648 L54.7070598,6.07491013 C54.7345794,5.82072676 54.7906323,5.51063753 54.7906323,5.31395319 C54.7906323,4.55125824 54.367121,4.38209233 53.860182,4.38209233 C53.1829115,4.38209233 52.5069445,4.69218156 52.0557688,4.91855683 L50.3911259,15.5844097 L45.1464798,15.5844097 L47.5429977,0.374685116 L52.0282492,0.374685116 L52.1691783,1.64444329 C53.2126036,0.883486357 54.6220389,0.12064658 56.511473,0.12064658 C58.1474376,0.120067244 59.2185273,0.825552826 59.7554481,1.78507694 L59.7554481,1.78507694 Z"
                      id="Shape"
                    ></path>
                    <path
                      d="M78.5990953,6.21583344 C78.5990953,4.97417302 78.288559,4.12761929 77.358688,4.12761929 C75.2997914,4.12761929 74.8770043,7.76743825 74.8770043,9.62942196 C74.8770043,11.0419863 75.2722719,11.9162033 76.2018532,11.9162033 C78.1479196,11.9162033 78.5990953,8.07767231 78.5990953,6.21583344 L78.5990953,6.21583344 Z M69.5751464,9.40463986 C69.5751464,4.60817794 72.1127383,0.120067244 77.9512273,0.120067244 C82.3505888,0.120067244 83.9587442,2.71679297 83.9587442,6.30099573 C83.9587442,11.0418415 81.4485271,15.9514186 75.4692539,15.9514186 C71.0415037,15.9514186 69.5751464,13.0446036 69.5751464,9.40463986 L69.5751464,9.40463986 Z"
                      id="Shape"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </>
      )}
    </Styled>
  );
};

export default connect(getWidgetInfo)(VenmoPayButton);
