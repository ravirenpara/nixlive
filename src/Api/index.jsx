import React from "react"
// const baseUrl = "http://43.204.243.212:3000/api"
// const baseUrl = "http://192.168.1.4:3001/api"
const baseUrl = "http://192.168.65.239:7000/api"

export const getAdminLogin = `${baseUrl}/admin/adminLogin`
export const getCategory = `${baseUrl}/category`
export const getProduct = `${baseUrl}/product`
export const getBrands = `${baseUrl}/brands`
export const getUserOrderList = `${baseUrl}/order/`
export const GetRecentOrderList = `${baseUrl}/order/`
export const GetCustomerList = `${baseUrl}/user`
export const GetEmployeeList = `${baseUrl}/employee/`
export const GetRoleList = `${baseUrl}/role/`
export const GetPromotionList = `${baseUrl}/promotion`
export const getPermission = `${baseUrl}/Permission/`
export const getCustomerOrder = `${baseUrl}/order/UserOrders/`
export const getDataCollection = `${baseUrl}/wishlist`
export const getChangePassword = `${baseUrl}/admin/change-password/`
export const getDashboardStats = `${baseUrl}/dashboard`