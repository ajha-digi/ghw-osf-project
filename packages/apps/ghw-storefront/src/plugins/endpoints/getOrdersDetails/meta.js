export default {
  name: 'getOrdersDetails',
  description: 'Description for getOrdersDetails',
  author: 'VirendraPatil',
  // Add comment: 'Documentation link for underlying rest endpoint'
  serviceurl: '',
  // The path to Json schema representing the request Json structure and the example of payload.
  input:
    '@oracle-cx-commerce/core-commerce-reference-store-storefront-prov/src/plugins/endpoints/getOrdersDetails/schema/input.json',
  // The json schema represents the redux states changes that will occur due to this reducer.
  // The json schema is expected to contain the state definition and an example.
  output:
    '@oracle-cx-commerce/core-commerce-reference-store-storefront-prov/src/plugins/endpoints/getOrdersDetails/schema/output.json',
  packageId: ''
};
