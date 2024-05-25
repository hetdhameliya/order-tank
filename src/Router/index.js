/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/Login'
import Register from '../views/Register'
import { useGetCurrentUserQuery } from '../api/auth'
import { actions } from '../redux/store/store'
import AuthHandler from '../auth/AuthHandler'
import { MuiLoader } from '../components/common/loading'
import Company from '../views/Company'
import Menu from '../components/common/Menu'
import Category from '../views/Category'
import Product from '../views/Product'
import Buyers from '../views/Buyers'
import BuyersAdd from '../views/Buyers/BuyersAdd'
import BuyersInfo from '../views/Buyers/BuyerInfo'
import BuyersRequest from '../views/Buyers/BuyersReqHandler'
import Orders from '../views/Orders'
import OrdersInfo from '../views/Orders/OrdersInfo'
import Profile from '../views/Profile'
import ForgotPassword from '../views/ForgotPassword'
import ResetPassword from '../views/ForgotPassword/ResetPassword'
import ConfirmRegistration from '../views/ConfirmRegistration'
import Dashboard from '../views/Dashboard'
import User from '../views/User'
import { useSelector } from 'react-redux'
import Cookies from "js-cookie";
import { Datakey } from '../util/massages'

const Router = () => {
  const currentUser = useSelector((state) => state.auth.currentUser)
  const [stopUserQuery, setStopUserQuery] = useState(false)
  const [loader, setLoader] = useState(false)
  const currentUserQuery = useGetCurrentUserQuery(null, {
    skip: stopUserQuery
  })

  useEffect(() => {
    if (!stopUserQuery) {
      actions.auth.setCurrentUser(currentUserQuery.data?.result)
      actions.auth.setLoading(currentUserQuery.isLoading)
      // eslint-disable-next-line no-undef
      currentUserQuery.error?.data?.message?.trim() === 'Please Login' && Cookies.remove(Datakey.COOKIE_NAME);
    }
    setLoader(true)
  }, [currentUserQuery, stopUserQuery])

  const isRouteAccessible = (screenName) => {
    const permissions = currentUser?.roleAndPermission?.permissions
    if (permissions) {
      const permission = permissions.find((p) => p.screenName === screenName)
      return permission && !permission.isNone
    }
    return false
  }

  return (
    <>
      <Suspense fallback={<MuiLoader />}>
        <AuthHandler />
        {loader && (
          <Menu statusCode={currentUserQuery.error?.originalStatus}>
            <Routes>
              <Route path='/login' element={<Login setStopUserQuery={setStopUserQuery} />} />
              <Route path='/reset-password/:id' element={<ResetPassword />} />
              <Route path='/confirm-registration/:id' element={<ConfirmRegistration />} />
              <Route path='/forgetPassword' element={<ForgotPassword />} />
              <Route path='/register' element={<Register />} >
                <Route path='/register/:id' component={<Register />} />
              </Route>
              <Route path='/company' element={<Company setStopUserQuery={setStopUserQuery} refetch={!stopUserQuery && currentUserQuery?.refetch} />} />
              {currentUser && isRouteAccessible('dashboard') && (
                <Route path='/dashboard' element={<Dashboard />} />
              )}
              {currentUser && isRouteAccessible('category') && (
                <Route path='/category' element={<Category />} />
              )}
              {currentUser && isRouteAccessible('product') && (
                <Route path='/product' element={<Product />} />
              )}
              {currentUser && isRouteAccessible('user') && (
                <Route path='/user' element={<User />} />
              )}
              {currentUser && isRouteAccessible('buyer') && (
                <Route path='/buyers' element={<Buyers />} />
              )}
              {currentUser && isRouteAccessible('buyer') && (
                <Route path='/buyersAdd' element={<BuyersAdd />} />
              )}
              {currentUser && isRouteAccessible('buyer') && (
                <Route path='/buyersEdit' element={<BuyersAdd />} />
              )}
              {currentUser && isRouteAccessible('buyer') && (
                <Route path='/buyersInfo' element={<BuyersInfo />} />
              )}
              {currentUser && isRouteAccessible('buyer') && (
                <Route path='/buyersRequest' element={<BuyersRequest />} />
              )}
              {currentUser && isRouteAccessible('order') && (
                <Route path='/orders' element={<Orders />} />
              )}
              {currentUser && isRouteAccessible('order') && (
                <Route path='/ordersInfo' element={<OrdersInfo />} />
              )}
              {currentUser && <Route path='/profile' element={<Profile />} />}
              {currentUser?.roleAndPermission && (
                <Route path='*' element={<Navigate to='/profile' />} />
              )}
            </Routes>
          </Menu>
        )}
      </Suspense>
    </>
  )
}

export default Router
