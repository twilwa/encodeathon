'use client'

import { useEffect, useState, useRef } from 'react'

import { useActions, useUIState } from 'ai/rsc'
import { toast } from 'react-hot-toast'
import Textarea from 'react-textarea-autosize'

import { HomePageTitle } from '@/app/components/home-page-title'
import { ChatList } from '@/components/chat-list'
import { UserMessage } from '@/components/chat/message'
import { EmptyScreen } from '@/components/empty-screen'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEnterSubmit } from '@/utils/hooks/use-enter-submit'

export default function HomePage() {
  const [serviceChoice, setServiceChoice] = useState('')
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
    if (!value || !serviceChoice) return // Ensure a service is selected

    try {
      // Pass the service choice along with the message
      const responseMessage = await submitUserMessage(value, serviceChoice)
      setMessages((currentMessages: { id: number; display: JSX.Element }[]) => [
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
          <EmptyScreen
            submitMessage={function (message: string): void {
              throw new Error('Function not implemented.')
            }}
          />
        )}
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4">
          <Select onValueChange={setServiceChoice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Acurast">Acurast</SelectItem>
              <SelectItem value="GetBlock">GetBlock</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Type your message here..."
            className="w-full rounded-md border p-2"
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
