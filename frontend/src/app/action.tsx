import { JSX, PromiseLikeOfReactNode, ReactNode } from 'react'

import { AcurastClient } from '@acurast/dapp'
import { createAI, getMutableAIState, render } from 'ai/rsc'
import axios from 'axios'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Spinner component for loading states
function Spinner() {
  return <div>Loading...</div>
}

// Status card for GetBlock service
function RequestStatusCard({ status }: { status: string }) {
  return (
    <div>
      <h2>Request Status</h2>
      <p>Status: {status}</p>
    </div>
  )
}

// Job card for Acurast service
function AcurastJobCard({ jobInfo }: { jobInfo: any }) {
  return (
    <div>
      <h2>Acurast Job Information</h2>
      <p>Job ID: {jobInfo.id}</p>
      <p>Status: {jobInfo.status}</p>
    </div>
  )
}

// Perform GetBlock API request
async function performGetBlockRequest(nodeName: string) {
  try {
    const response = await axios.post(
      `https://go.getblock.io/${process.env.GETBLOCK_ACCESS_TOKEN}`,
      {
        jsonrpc: '2.0',
        method: 'getmininginfo',
        params: [],
        id: 'getblock.io',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return {
      status: 'Success',
      data: response.data.result,
    }
  } catch (error) {
    console.error('Error performing GetBlock request:', error)
    return {
      status: 'Failed',
      data: null,
    }
  }
}

// Create an Acurast job
async function createAcurastJob(message: string) {
  const acurastClient = new AcurastClient('wss://websocket-proxy-1.prod.gke.acurast.com/')
  await acurastClient.start({
    secretKey: 'wee',
    publicKey: '5D5ZVcHiRRLy8UX3g9LGPJeZsKPbgb7ToYLshtaHKuXcNfKF',
  })

  acurastClient.onMessage(async (message) => {
    console.log('Received Message', message)
  })

  await acurastClient.send('processor_public_key', message)

  await acurastClient.close()

  return {
    id: 'job_id_placeholder',
    status: 'Job Created',
  }
}

async function submitUserMessage(userInput: string, serviceChoice: 'Acurast' | 'GetBlock') {
  'use server'
  const aiState = getMutableAIState<typeof AI>()

  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content: userInput,
    },
  ])

  let responseContent:
    | string
    | number
    | boolean
    | JSX.Element
    | Iterable<ReactNode>
    | PromiseLikeOfReactNode
    | AsyncGenerator<ReactNode | Promise<ReactNode>, ReactNode | Promise<ReactNode>, void>
    | null
    | undefined

  if (serviceChoice === 'Acurast') {
    const jobInfo = await createAcurastJob(userInput)
    responseContent = <AcurastJobCard jobInfo={jobInfo} />
  } else if (serviceChoice === 'GetBlock') {
    const requestResult = await performGetBlockRequest(userInput)
    responseContent = <RequestStatusCard status={requestResult.status} />
  }

  const completion = await openai.completions.create({
    model: 'gpt-4-0125',
    prompt: userInput,
    temperature: 0.7,
    max_tokens: 150,
  })

  const ui = render({
    text: ({ done }) => {
      if (done) {
        return responseContent
      }
      return <Spinner />
    },
    model: 'gpt-4-0125',
    provider: openai,
    messages: [],
  })

  return {
    id: Date.now(),
    display: ui,
  }
}

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function'
  content: string
  id?: string
  name?: string
}[] = []

const initialUIState: {
  id: number
  display: React.ReactNode
}[] = []

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
})
