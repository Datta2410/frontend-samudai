import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

interface Event {
    creator: string,
    start: string,
    end: string,
    status: string,
    htmlLink: string,
    summary: string,
}
const Dashboard = () => {
    const [accessToken, setAccessToken] = useState('')
    const [calendarEvents, setCalendarEvents] = useState<Event[]>([])
    const googleSignIn = () => {
        // @ts-ignore
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse?.access_token) {
                    setAccessToken(tokenResponse?.access_token)
                }
            },
        })
        client.requestAccessToken()
    }
    const signOut = () => {
        // @ts-ignore
        window.google.accounts.oauth2.revoke(accessToken, () => {
            setAccessToken('')
        })

    }
    const openEventonCalendar = (link: string) => {
        // @ts-ignore
        window.open(link, '_blank')
    }
    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", requestOptions)
            .then(response => response.json())
            .then(result => {
                const events = result?.items?.map((event: any) => {
                    if(new Date() < new Date(event?.start?.date || event?.start?.dateTime)) {
                        return {
                            creator: event?.creator?.email,
                            end: new Date(event?.end?.date || event?.end?.dateTime).toString().substring(0, 24),
                            start: new Date(event?.start?.date || event?.start?.dateTime).toString().substring(0, 24),
                            status: event?.status,
                            htmlLink: event?.htmlLink,
                            summary: event?.summary
                        }
                    }
                }).filter((event: any) => event !== undefined)
                setCalendarEvents(events)
            })
            .catch(error => console.log('error', error));
    }, [accessToken])
    return (
        <div className='flex justify-center items-center w-full'>
            {accessToken ? (
                <div className='flex flex-col items-center justify-center'>
                    <button
                        onClick={signOut}
                        className='rounded-lg shadow-lg border p-6'
                    >Sign Out</button>
                    <div className='flex flex-wrap items-center justify-center w-screen p-6'>
                        {calendarEvents?.length > 0 && calendarEvents?.map((event) => {
                            return (
                                <Card className='w-full h-48 sm:w-1/2 md:w-1/3 lg:w-1/4'>
                                    <div className='text-center'>{event?.summary}</div>
                                    <div>{event?.creator}</div>
                                    <div>Start Time: {event?.start}</div>
                                    <div>End Time: {event?.end}</div>
                                    <a className='no-underline hover:underline' target={'_blank'} href={event?.htmlLink}>Open on Google Calender</a>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className='flex items-center justify-center w-full h-screen'>
                    <button
                        onClick={googleSignIn}
                        className='rounded-lg shadow-lg border p-6'
                    >Sign In With Google</button>
                </div>
            )}
        </div>
    )
}

export default Dashboard