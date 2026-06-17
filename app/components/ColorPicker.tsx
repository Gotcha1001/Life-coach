"use client";
import { motion } from "framer-motion";
import { mysticalColors } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selected: number | null;
  onSelect: (id: number) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-purple-300 font-body text-sm italic">
          Close your eyes. Breathe. Then choose the colour that calls to you...
        </p>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {mysticalColors.map((color, i) => (
          <motion.button
            key={color.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(color.id)}
            className={cn(
              "relative w-14 h-14 rounded-full cursor-pointer transition-all duration-300",
              selected === color.id &&
                "ring-2 ring-white ring-offset-2 ring-offset-transparent",
            )}
            style={{
              backgroundColor: color.hex,
              boxShadow:
                selected === color.id
                  ? `0 0 25px ${color.glow}, 0 0 50px ${color.glow}`
                  : `0 0 10px ${color.glow}40`,
            }}
            title={color.name}
          >
            {selected === color.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
      {selected !== null && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-serif text-fuchsia-300/70 italic"
        >
          ✦ The spirits have received your choice ✦
        </motion.p>
      )}
    </div>
  );
}
