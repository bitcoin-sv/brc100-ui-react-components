import React from 'react'
import { WalletContextProvider } from './WalletContext'
import { UserContextProvider } from './UserContext'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { BreakpointProvider } from './utils/useBreakpoints'
import { ExchangeRateContextProvider } from './components/AmountDisplay/ExchangeRateContextProvider'
import Greeter from './pages/Greeter'
import Dashboard from './pages/Dashboard'
import LostPhone from './pages/Recovery/LostPhone'
import LostPassword from './pages/Recovery/LostPassword'
import Recovery from './pages/Recovery'
import BasketAccessHandler from './components/BasketAccessHandler'
import CertificateAccessHandler from './components/CertificateAccessHandler'
import ProtocolPermissionHandler from './components/ProtocolPermissionHandler'
import PasswordHandler from './components/PasswordHandler'
import RecoveryKeyHandler from './components/RecoveryKeyHandler'
import SpendingAuthorizationHandler from './components/SpendingAuthorizationHandler'
import AuthRedirector from './navigation/AuthRedirector'
import ThemedToastContainer from './components/ThemedToastContainer'
import { WalletInterface } from '@bsv/sdk'
import { AppThemeProvider } from './components/Theme'

// Define queries for responsive design
const queries = {
  xs: '(max-width: 500px)',
  sm: '(max-width: 720px)',
  md: '(max-width: 1024px)',
  or: '(orientation: portrait)'
}

export interface TauriFunctions {
  isFocused: () => Promise<boolean>;
  onFocusRequested: () => Promise<void>;
  onFocusRelinquished: () => Promise<void>;
}

interface UserInterfaceProps {
  onWalletReady: (wallet: WalletInterface) => Promise<(() => void) | undefined>;
  tauriFunctions?: TauriFunctions;
}

const UserInterface: React.FC<UserInterfaceProps> = ({ onWalletReady, tauriFunctions }) => {
  return (
    <AppThemeProvider>
      <UserContextProvider tauriFunctions={tauriFunctions}>
        <WalletContextProvider onWalletReady={onWalletReady}>
          <ExchangeRateContextProvider>
            <Router>
              <AuthRedirector />
              <BreakpointProvider queries={queries}>
                <PasswordHandler />
                <RecoveryKeyHandler />
                <BasketAccessHandler />
                <CertificateAccessHandler />
                <ProtocolPermissionHandler />
                <SpendingAuthorizationHandler />
                <ThemedToastContainer />
                <Switch>
                  <Route exact path='/' component={Greeter} />
                  <Route path='/dashboard' component={Dashboard} />
                  <Route exact path='/recovery/lost-phone' component={LostPhone} />
                  <Route exact path='/recovery/lost-password' component={LostPassword} />
                  <Route exact path='/recovery' component={Recovery} />
                </Switch>
              </BreakpointProvider>
            </Router>
          </ExchangeRateContextProvider>
        </WalletContextProvider>
      </UserContextProvider>
    </AppThemeProvider>
  )
}

export default UserInterface