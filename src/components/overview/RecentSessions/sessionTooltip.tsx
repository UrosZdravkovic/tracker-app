import type { Session } from "@/store/sessions-context"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip"
import { type ReactNode } from "react"

interface SessionTooltipProps {
  content: Session;
  children: ReactNode
}

export default function SessionTooltip({ content, children }: SessionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p className="mb-0.5"><span className="font-medium text-white">Status:</span> <span className="text-white">{content.status}</span></p>
        <p className="mb-0.5"><span className="font-medium text-white">Time:</span> <span className="text-white">{content.time}min</span></p>
        <p className="mb-0.5"><span className="font-medium text-white">Category:</span> <span className="text-white">{content.category}</span></p>
      </TooltipContent>
    </Tooltip>
  )
}