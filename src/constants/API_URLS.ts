const API_URLS = {
  V1: {
    LOGIN: "/auth/sign-in",
    LOGOUT: "/auth/logout",
    USER_LIST: "/v1/user-management/admin-user/list",
    PRODUCT_LIST: "/product/list",
    SAVE_USER_DATA: "/v1/user-management/add/insert-user",
    SAVE_PRODUCT_DATA: "/product/add",
    UPDATE_PRODUCT_DATA: "/product/",
    FIND_USER_BY_ID: "/v1/user-management/find-by-id/",
    FIND_PRODUCT_BY_ID: "/product/",
    DELETE_USER_DATA: "/v1/user-management/delete-adminuser",
    DELETE_PRODUCT_DATA: "/product",
  },
};

export default API_URLS;
