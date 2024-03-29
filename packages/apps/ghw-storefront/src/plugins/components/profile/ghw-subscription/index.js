/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useEffect, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getPageData} from '@oracle-cx-commerce/react-widgets/profile/profile-update-password/selectors';
import css from './styles.css';

const GHWSubscription = props => {
  const {currentProfile} = props;
  const store = useContext(StoreContext);
  const [orderData, setOrderData] = useState();
  // const [offset, setOffset] = useState(0);
  const getOrders = async () => {
    if (currentProfile) {
      const res = await store.endpoint('getSubscriptions', {
        store,
        qParam: `profileId=${currentProfile.id}&limit=50`
      });
      if (res.ok && res.delta.data.RESPONSE.G_1) {
        console.log("arpit",res.ok );
        console.log("arpit",res.delta.data.RESPONSE.G_1);
        setOrderData(res.delta.data.RESPONSE.G_1);
      }
    }
  };
  console.log('res1111111111', orderData);
  useEffect(() => {
    if (currentProfile && store) {
      getOrders();
    }
  }, [currentProfile, store]);

  // const getProductName = products => {
  //   if (products.length > 0) {
  //     const lengthProducts = products.length - 1;
  //     const nameProduct = products[0].ProductName;
  //     if (lengthProducts > 0) {
  //       return `${nameProduct}+${lengthProducts}`;
  //     }

  //     return `${nameProduct}`;
  //   }
  // };

  return (
    <Styled id="GHWSubscription" css={css}>
      <div className="v-tab_container">
        <div id="vtab5" className="v-tab_content" style={{display: 'block'}}>
          <div className="vertical" style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                <th>Subscription No</th>
                  {/* <th>Order ID</th> */}
                  <th>Products</th>
                  <th>Order Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Ship to</th>
                </tr>
              </thead>
              <tbody>
                {orderData &&
                  orderData.map(item => (
                    // <tr key={item.SUBSCRIPTION_ID}>
                    <tr>
                      <td>
                        <a href={`/Subscription/${item.SUBSCRIPTION_ID}`}>{item.SUBSCRIPTION_ID}</a>
                      </td>
                      {/* //unique records */}
                      {/* <td>{item.SUBSCRIPTION_ID}</td> */}
                      <td>{item.PRODUCTS}</td>

                      <td>
                        {item.FREQUENCY}
                      </td>
                      <td>{item.SUBSCRIPTIONDATE}</td>
                      <td>{item.STATUS}</td>
                      <td>{item.SHIPPINGADDRESS}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* <BasicPagination
            currentOffset={currentOffset}
            limit={10}
            totalRecords={totalRecords}
            pagesToShowBesideCurrentPage={pagesToShowBesideCurrentPage}
            pageId={pageId}
            offsetParam={offsetParam}
            pageParam={pageParam}
            onPageChange={onPageChange}
            labelPreviousPage={labelPreviousPage}
            labelNextPage={labelNextPage}
            labelFirstPage={labelFirstPage}
            labelLastPage={labelLastPage}
          /> */}
        </div>
      </div>
    </Styled>
  );
};

export default connect(getPageData)(GHWSubscription);
