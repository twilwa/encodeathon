import { ExternalLink } from '@/components/external-link'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen({ submitMessage }: { submitMessage: (message: string) => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-4 rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">this is a mirage</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          discover the truth. produce your talisman. ask, and you shall receive.
        </p>
      </div>
    </div>
  )
}
