import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  User,
  Check,
  CheckCircle2,
  RotateCcw,
  Timer,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { cn } from "../../utils/cn";
import type { ChatAction } from "../../types/coach";
import { coachService } from "../../services/coachService";
import ReactMarkdown from "react-markdown";

/**
 * Identifies the kind of follow-up action an AI message can offer.
 * This is a UI-level contract only — AIChatCard has no idea what
 * "applying" or "regenerating" a workout actually involves. The parent
 * (CoachPage) wires each type to real logic via the callback props below.
 */

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

/**
 * Optional callback props for AI-suggested actions. If a handler isn't
 * provided, buttons of that type simply won't render — the chat stays
 * fully functional with zero actions wired up. AIChatCard never calls
 * coachService or any AI backend directly; it only forwards user intent
 * to whatever the parent supplies.
 */
interface AIChatCardProps {
  className?: string;

  userName?: string;

  generateLoading?: boolean;

  regenerateLoading?: boolean;

  onGenerateWorkout?: () => Promise<void>;

  onApplyWorkout?: () => void;

  onRegenerateWorkout?: () => void;

  onShortenWorkout?: () => void;
}

const SUGGESTED_PROMPTS = ["💪 Upper Body", "🦵 Lower Body", "🔥 Full Body"];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your HiMax AI Coach. Ask me anything about your workout, nutrition, recovery or transformation.",
  timestamp: new Date(),
};

const ACTION_ICONS: Record<ChatAction["type"], LucideIcon> = {
  "apply-workout": CheckCircle2,
  "regenerate-workout": RotateCcw,
  "shorten-workout": Timer,
};

function generateId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Returns a fresh copy of the welcome message with a new id/timestamp,
 * used whenever the conversation is reset via the delete confirmation. */
function createWelcomeMessage(): ChatMessage {
  return {
    ...WELCOME_MESSAGE,
    id: generateId(),
    timestamp: new Date(),
  };
}

export default function AIChatCard({
  className,

  userName,

  generateLoading,

  regenerateLoading,

  onGenerateWorkout,

  onApplyWorkout,

  onRegenerateWorkout,

  onShortenWorkout,
}: AIChatCardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      ...WELCOME_MESSAGE,
      content: `Hi ${userName ?? "there"}! 👋

I'm your HiMax AI Coach.

Tell me what workout you'd like to do today, or choose one of the options below.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [triggeredActionKeys, setTriggeredActionKeys] = useState<Set<string>>(
    new Set(),
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearedToast, setShowClearedToast] = useState(false);
  const [workoutChosen, setWorkoutChosen] = useState(false);
  const [isPreparingWorkout, setIsPreparingWorkout] = useState(false);
  const [preparingStep, setPreparingStep] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  // Clean up any pending timers if the card unmounts mid-flight.
  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) window.clearTimeout(replyTimeoutRef.current);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const hasUserMessage = messages.some((m) => m.role === "user");

  // Maps an action type to whatever the parent wired up. AIChatCard never
  // performs the underlying effect itself — it only invokes this.
  const actionHandlers: Partial<Record<ChatAction["type"], () => void>> = {
    "apply-workout": onApplyWorkout,
    "regenerate-workout": onRegenerateWorkout,
    "shorten-workout": onShortenWorkout,
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (
      trimmed.includes("Upper Body") ||
      trimmed.includes("Lower Body") ||
      trimmed.includes("Full Body") ||
      trimmed.includes("Home Workout") ||
      trimmed.includes("Gym Workout")
    ) {
      setWorkoutChosen(true);

      setPreparingStep(0);

      setIsPreparingWorkout(true);
    }
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);

    try {
      // const reply = await coachService.askCoach(trimmed);

      const reply = await coachService.askCoach(trimmed, {
        userProfile: {
          goal: "Muscle Gain",
          age: 21,
        },

        progress: {
          weight: 67,
          bodyFat: 18,
          streak: 3,
        },

        nutritionHistory: [
          {
            protein: 60,
            calories: 1700,
          },
        ],
      });

      const workoutReplies: Record<string, string> = {
        "💪 Upper Body":
          "Excellent choice! 💪 I'm preparing your Upper Body workout.",

        "🦵 Lower Body": "Great! 🦵 I'm preparing your Lower Body workout.",

        "🔥 Full Body": "Awesome! 🔥 I'm preparing your Full Body workout.",
      };

      const preparingMessages = [
        "Analyzing your fitness profile...",
        "Checking recovery score...",
        "Optimizing workout intensity...",
        "Selecting today's exercises...",
        "Finalizing your personalized plan...",
      ];

      for (let i = 0; i < preparingMessages.length; i++) {
        setPreparingStep(i);

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Generate workout here
      if (
        trimmed.includes("Upper Body") ||
        trimmed.includes("Lower Body") ||
        trimmed.includes("Full Body")
      ) {
        await onGenerateWorkout?.();
      }

      setIsPreparingWorkout(false);

      const replyMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: workoutReplies[trimmed] ?? reply.content,
        timestamp: new Date(),
        actions: reply.actions,
      };
      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content:
            "Sorry, I couldn't reach the AI Coach right now. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (message: ChatMessage, action: ChatAction) => {
    const handler = actionHandlers[action.type];
    if (!handler) return;
    setTriggeredActionKeys((prev) =>
      new Set(prev).add(`${message.id}:${action.type}`),
    );
    handler();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  // Opens the confirmation modal — nothing is deleted until the user
  // explicitly confirms inside it.
  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleCancelDelete = () => setShowDeleteModal(false);

  // Resets the conversation back to a fresh welcome message. This only
  // touches AIChatCard's own local state — it never calls onApplyWorkout /
  // onRegenerateWorkout / etc, so CoachPage and the rest of the app are
  // completely unaffected. No reload, no refresh.
  const handleConfirmDelete = () => {
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
      replyTimeoutRef.current = null;
    }
    setIsTyping(false);
    setMessages([createWelcomeMessage()]);
    setTriggeredActionKeys(new Set());
    setInput("");
    setShowDeleteModal(false);

    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setShowClearedToast(true);
    toastTimeoutRef.current = window.setTimeout(() => {
      setShowClearedToast(false);
      toastTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <Card
      padding="none"
      className={cn(
        "relative overflow-hidden backdrop-blur-xl bg-surface/90",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-heading font-bold text-text truncate">
              🤖 HiMax AI Coach
            </h3>
            <p className="text-xs text-text-muted truncate">
              Your AI Transformation Coach
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI Ready
          </span>
          <button
            type="button"
            onClick={handleDeleteClick}
            aria-label="Delete conversation"
            title="Delete conversation"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors duration-150"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* "Conversation cleared" toast */}
      <AnimatePresence>
        {showClearedToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[68px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-text px-4 py-2 text-xs font-medium text-bg shadow-lg"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Conversation cleared successfully.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        className={cn(
          "overflow-y-auto px-5 py-4 space-y-4 transition-all duration-500",
          workoutChosen ? "h-[420px] lg:h-[600px]" : "h-[170px]",
        )}
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            actionHandlers={actionHandlers}
            triggeredActionKeys={triggeredActionKeys}
            onActionClick={handleActionClick}
          />
        ))}

        {isPreparingWorkout && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-surface border border-border px-5 py-4 max-w-md">
              <h3 className="text-lg font-bold text-emerald-400">
                🤖 HiMax AI
              </h3>

              <p className="mt-3 text-text">
                {
                  [
                    "Analyzing your fitness profile...",
                    "Checking recovery score...",
                    "Optimizing workout intensity...",
                    "Selecting today's exercises...",
                    "Finalizing your personalized plan...",
                  ][preparingStep]
                }
              </p>

              <div className="mt-5 space-y-2">
                {[
                  "Analyzing your fitness profile...",
                  "Checking recovery score...",
                  "Optimizing workout intensity...",
                  "Selecting today's exercises...",
                  "Finalizing your personalized plan...",
                ].map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                      index <= preparingStep
                        ? "text-emerald-400"
                        : "text-text-muted"
                    }`}
                  >
                    {index < preparingStep
                      ? "✅"
                      : index === preparingStep
                        ? "⚡"
                        : "○"}

                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isTyping && <TypingBubble />}

        <div ref={scrollRef} />
      </div>

      {/* Suggested prompts */}
      {!hasUserMessage && (
        <div className="px-5 pb-3 flex gap-2 overflow-x-auto">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="shrink-0 whitespace-nowrap text-xs font-medium text-text-muted bg-bg border border-border rounded-full px-3 py-1.5 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors duration-150"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 px-5 py-4 border-t border-border">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI Coach..."
          aria-label="Message the AI coach"
          className={cn(
            "flex-1 resize-none bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text",
            "placeholder:text-text-muted max-h-[120px]",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
            "transition-all duration-150",
          )}
        />
        <Button
          size="md"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
  actionHandlers: Partial<Record<ChatAction["type"], () => void>>;
  triggeredActionKeys: Set<string>;
  onActionClick: (message: ChatMessage, action: ChatAction) => void;
}

function ChatBubble({
  message,
  actionHandlers,
  triggeredActionKeys,
  onActionClick,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const time = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Only render actions the parent actually wired a handler for.
  const visibleActions = (message.actions ?? []).filter(
    (action) => actionHandlers[action.type],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("flex items-end gap-2", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "w-7 h-7 shrink-0 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-white" : "bg-primary/10 text-primary",
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words",
          isUser
            ? "bg-primary text-white rounded-br-sm"
            : "bg-bg border border-border text-text rounded-bl-sm",
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mb-3">{children}</h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-base font-semibold mt-3 mb-2">
                  {children}
                </h3>
              ),

              p: ({ children }) => <p className="mb-3 leading-7">{children}</p>,

              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 mb-3">{children}</ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 mb-3">{children}</ol>
              ),

              li: ({ children }) => <li className="leading-7">{children}</li>,

              strong: ({ children }) => (
                <strong className="font-bold text-primary">{children}</strong>
              ),

              hr: () => <hr className="my-4 border-border" />,

              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-text-muted">
                  {children}
                </blockquote>
              ),

              code: ({ children }) => (
                <code className="bg-black/20 px-1.5 py-0.5 rounded text-green-400">
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {/* </div> */}

        {!isUser && visibleActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {visibleActions.map((action) => {
              const key = `${message.id}:${action.type}`;
              const isTriggered = triggeredActionKeys.has(key);
              const Icon = ACTION_ICONS[action.type];
              return (
                <Button
                  key={action.type}
                  size="sm"
                  variant={isTriggered ? "ghost" : "secondary"}
                  disabled={isTriggered}
                  onClick={() => onActionClick(message, action)}
                >
                  {isTriggered ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  {isTriggered ? "Done" : action.label}
                </Button>
              );
            })}
          </div>
        )}

        <span className="text-[11px] text-text-muted mt-1 px-1">{time}</span>
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-1 bg-bg border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" />
      </div>
    </div>
  );
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Dark, centered confirmation dialog rendered via a portal so it always
 * covers the full viewport, regardless of the card's own overflow/backdrop
 * styles. Closes on ESC or on a click outside the panel.
 */
function DeleteConfirmationModal({
  open,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="delete-conversation-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            key="delete-conversation-panel"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-conversation-title"
            aria-describedby="delete-conversation-description"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
          >
            <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3
              id="delete-conversation-title"
              className="text-base font-heading font-bold text-zinc-50"
            >
              Delete Conversation?
            </h3>
            <p
              id="delete-conversation-description"
              className="mt-2 text-sm leading-relaxed text-zinc-400"
            >
              This will permanently remove the current conversation. This action
              cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 transition-colors duration-150"
              >
                Cancel
              </button>
              <motion.button
                type="button"
                onClick={onConfirm}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors duration-150"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
