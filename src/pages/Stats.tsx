import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { setWalletAddress } from '../redux/globalSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

const Stats = () => {
    const walletAddress = useAppSelector((state) => state.global.walletAddress)
    const dispatch = useAppDispatch()
    const [txns, setTxns] = useState([])
    const [latestBlock, setLatestBlock] = useState(0)
    const fetchBlockAndTxns = (): void => {
        const date = Math.floor(Date.now() / 1000)
        const blockUrl = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${date}&closest=before&apikey=${process.env.REACT_APP_ETHSCAN_API_KEY}`
        fetch(blockUrl).then(res => res.json()).then(res => {
            setLatestBlock(res?.result)
            const getTxnsUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=${res?.result - 1000}&endblock=${res?.result}&page=1&offset=20&sort=desc&apikey=${process.env.REACT_APP_ETHSCAN_API_KEY}`
            fetch(getTxnsUrl)
                .then(txRes => txRes.json())
                .then(txRes => {
                    const txnsTemp = txRes?.result?.map((tx: any) => {
                        return {
                            hash: tx?.hash,
                            from: tx?.from,
                            to: tx?.to,
                            timeStamp: tx?.timeStamp,
                            blockNumber: tx?.blockNumber
                        }
                    })
                    setTxns(txnsTemp)
                }).catch(error => {
                    console.log(error)
                })
        }).catch(error => {
            console.log(error)
        })
    }
    const signIn = () => {
        // @ts-ignore
        const { ethereum } = window
        if (ethereum) {
            console.log(ethereum.networkVersion)
            // @ts-ignore
            window.ethereum.request({ method: 'eth_requestAccounts' })
                // @ts-ignore
                .then(response => {
                    dispatch(setWalletAddress(response[0]))
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    const body = JSON.stringify({
                        "walletAddress": walletAddress,
                        "chainId": 10,
                        "member": {
                            "did": ""
                        }
                    });

                    const requestOptions = {
                        method: 'POST',
                        body: body,
                        headers: myHeaders
                    };

                    fetch("https://dev-gcn.samudai.xyz/api/member/signup", requestOptions)
                        .then(signUpResponse => signUpResponse.text())
                        .then(result => console.log(result))
                        .catch(error => console.log('error', error));
                })
                // @ts-ignore
                .catch(error => console.log(error))
        } else {
            alert("install metamask extension!!")
        }
    }

    useEffect(() => {
        fetchBlockAndTxns()
        const interval = setInterval(fetchBlockAndTxns, 50000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [walletAddress]);
    return (
        <div className='flex flex-col justify-center items-center w-full h-full p-2 m-2'>

            {walletAddress ? (
                <>
                    <Card className='w-full'>
                        <div>Wallet Address: {walletAddress}</div>
                    </Card>
                    <div className='flex flex-row justify-between w-full min-h-screen'>
                        {txns.length > 0 ? (
                            <Card className='p-6 w-4/6 h-fit md:5/6 lg:w-2/6'>
                                {txns.map((txn: any, index: number) => {
                                    return (
                                        <Card key={index} className='w-full items-start'>
                                            <div>Hash: <a target='_blank' rel='noreferrer' href={`https://etherscan.io/tx/${txn?.hash}`}>{txn?.hash?.substr(0, 30)}.....</a></div>
                                            {/* <div>From: {txn?.from?.substr(0, 30)}.....</div>
                                    <div>To: {txn?.to?.substr(0, 30)}...</div>
                                    <div>Timestamp: {txn?.timeStamp}</div>
                                    <div>BlockNumber: {txn?.blockNumber}</div>  */}
                                        </Card>
                                    )
                                })}
                            </Card>
                        ) : (
                            <Card className='p-6 w-4/6 h-fit md:5/6 lg:w-2/6'>No Transactions Found</Card>
                        )}
                        <Card className='h-10 fixed bottom-1 right-1'>
                            Latest block: {latestBlock}
                        </Card>
                    </div>
                </>
            ) : (
                <div className='w-screen h-screen flex items-center justify-center p-6 m-6'>
                    <button onClick={signIn} className='rounded-md p-6 w-5/6 md:w-4/6 lg:w-3/6 border shadow-lg'>Sign in with Ethereum</button>
                </div>
            )}
        </div>
    )
}

export default Stats