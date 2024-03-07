"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Socket, io } from "socket.io-client"

interface ISocketProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
}

const SocketContext = createContext<ISocketContext | null>(null)

export const SocketProvider: React.FC<ISocketProviderProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket>()
    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log("Send Message", msg)

        if(socket) {
            socket.emit('event:message', {
                message: msg
            })
        }
    }, [socket])

    useEffect(() => {
        const _socket = io('http://localhost:8000')
        setSocket(_socket)

        return () => {
            _socket.disconnect();
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const state = useContext(SocketContext)
    if(!state) throw new Error(`state is undefined`)

    return state
}