'use client'

import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-hot-toast'
import Textarea from 'react-textarea-autosize'
import { useEnterSubmit } from '@/utils/hooks/use-enter-submit'
import { useActions, useUIState } from 'ai/rsc'

import { HomePageTitle } from '@/app/components/home-page-title'
import { UserMessage } from '@/components/llm-stocks/message'
import { ChatList } from '@/components/chat-list'
import { EmptyScreen } from '@/components/empty-screen'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [messages, setMessages] = useUIState()
  const { submitUserMessage } = useActions()
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { formRef, onKeyDown } = useEnterSubmit()

  // Handle the submission of a new message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputValue.trim()
    setInputValue('')
    if (!value) return

    try {
      // Submit and get response message
      const responseMessage = await submitUserMessage(value)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          display: <UserMessage>{value}</UserMessage>,
        },
        responseMessage,
      ])
    } catch (error) {
      toast.error('Something went wrong, please try again later.')
    }
  }

  return (
    <>
      <HomePageTitle />
      <div className="container mx-auto my-8 p-4">
        {messages.length ? (
          <ChatList messages={messages} />
        ) : (
          <EmptyScreen />
        )}
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Type your message here..."
            className="w-full p-2 border rounded-md"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" className="mt-2">
            Send
          </Button>
        </form>
      </div>
    </>
  )
}
