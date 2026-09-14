import { useCallback, useEffect, useRef, useState } from 'react'
import Peer, { type DataConnection } from 'peerjs'
import type { OnlineMessage, ConnectionStatus } from '../lib/online'

interface UseOnlineMultiplayerOptions {
  onMessage: (msg: OnlineMessage) => void
  onConnected: () => void
  onDisconnected: () => void
}

export function useOnlineMultiplayer({
  onMessage,
  onConnected,
  onDisconnected,
}: UseOnlineMultiplayerOptions) {
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [roomCode, setRoomCode] = useState<string>('')
  const [isHost, setIsHost] = useState(false)
  const peerRef = useRef<Peer | null>(null)
  const connRef = useRef<DataConnection | null>(null)

  const onMessageRef = useRef(onMessage)
  const onConnectedRef = useRef(onConnected)
  const onDisconnectedRef = useRef(onDisconnected)

  useEffect(() => {
    onMessageRef.current = onMessage
    onConnectedRef.current = onConnected
    onDisconnectedRef.current = onDisconnected
  })

  const cleanup = useCallback(() => {
    if (connRef.current) {
      connRef.current.close()
      connRef.current = null
    }
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
  }, [])

  const host = useCallback(
    (code: string) => {
      cleanup()
      setStatus('hosting')
      setRoomCode(code)
      setIsHost(true)

      const peerId = 'gomoku-' + code.toUpperCase()
      const peer = new Peer(peerId)

      peer.on('open', () => {
        setStatus('hosting')
      })

      peer.on('connection', (conn) => {
        connRef.current = conn
        conn.on('open', () => {
          setStatus('connected')
          onConnectedRef.current()
        })
        conn.on('data', (data) => {
          if (typeof data === 'string') {
            try {
              const msg = JSON.parse(data) as OnlineMessage
              if (msg && typeof msg.type === 'string') {
                onMessageRef.current(msg)
              }
            } catch {
              // ignore malformed messages
            }
          }
        })
        conn.on('close', () => {
          setStatus('disconnected')
          onDisconnectedRef.current()
        })
        conn.on('error', () => {
          setStatus('error')
        })
      })

      peer.on('error', () => {
        setStatus('error')
      })

      peerRef.current = peer
    },
    [cleanup],
  )

  const join = useCallback(
    (code: string) => {
      cleanup()
      setStatus('joining')
      setRoomCode(code)
      setIsHost(false)

      const peer = new Peer()
      const targetId = 'gomoku-' + code.toUpperCase()

      peer.on('open', () => {
        const conn = peer.connect(targetId, { reliable: true })
        connRef.current = conn

        conn.on('open', () => {
          setStatus('connected')
          onConnectedRef.current()
        })

        conn.on('data', (data) => {
          if (typeof data === 'string') {
            try {
              const msg = JSON.parse(data) as OnlineMessage
              if (msg && typeof msg.type === 'string') {
                onMessageRef.current(msg)
              }
            } catch {
              // ignore malformed messages
            }
          }
        })

        conn.on('close', () => {
          setStatus('disconnected')
          onDisconnectedRef.current()
        })

        conn.on('error', () => {
          setStatus('error')
        })
      })

      peer.on('error', () => {
        setStatus('error')
      })

      peerRef.current = peer
    },
    [cleanup],
  )

  const send = useCallback((msg: OnlineMessage) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send(JSON.stringify(msg))
    }
  }, [])

  const disconnect = useCallback(() => {
    cleanup()
    setStatus('idle')
    setRoomCode('')
    setIsHost(false)
  }, [cleanup])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    status,
    roomCode,
    isHost,
    host,
    join,
    send,
    disconnect,
  }
}