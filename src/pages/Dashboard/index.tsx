import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setWalletAddress } from '../../redux/globalSlice'
import { RootState } from '../../redux/store'

const Dashboard = () => {
    const dispatch = useDispatch()
    const signIn = () => {
        // @ts-ignore
        const { ethereum } = window
        if (ethereum) {
            // @ts-ignore 
            window.ethereum.request({ method: 'eth_requestAccounts' })
                // @ts-ignore
                .then(response => dispatch(setWalletAddress(response[0])))
                // @ts-ignore
                .catch(error => console.log(error))
        } else {
            alert("install metamask extension!!")
        }
    }
    const walletAddress = useSelector((state: RootState) => state.global.walletAddress)
    return (
        <div>
            {!!walletAddress ? (<div>Dashboard {walletAddress}</div>) : (<button onClick={signIn}>Sign in with Ethereum</button>)}
        </div>
    )
}

export default Dashboard