import { AnimatePresence, motion } from "framer-motion";

interface CelebrationOverlayProps {
  show: boolean;
  icon?: string;
  title: string;
  subtitle?: string;
  xp?: number;
  countdown?: number;
}

export default function CelebrationOverlay({
  show,
  icon = "🏆",
  title,
  subtitle,
  xp,
  countdown,
}: CelebrationOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="text-center text-white px-6"
          >
            {/* Icon */}

            <motion.div
              key={icon}
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
              }}
              className="text-7xl mb-5"
            >
              {icon}
            </motion.div>

            {/* Title */}

            <motion.h2
              key={title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.35,
              }}
              className="text-4xl font-black tracking-wide"
            >
              {title}
            </motion.h2>

            {/* Subtitle */}

            {subtitle && (
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  delay: 0.15,
                }}
                className="mt-4 text-lg text-gray-300"
              >
                {subtitle}
              </motion.p>
            )}

            {/* XP Reward */}

            {xp !== undefined && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -35,
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.4,
                }}
                className="mt-7 text-4xl font-black text-emerald-400"
              >
                +{xp} XP
              </motion.div>
            )}

            {/* Countdown */}

            {countdown !== undefined && (
              <motion.div
                key={countdown}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="mt-10 text-7xl font-black"
              >
                {countdown}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}