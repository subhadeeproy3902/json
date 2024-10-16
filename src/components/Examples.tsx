"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "./ui/button";

type ImageProps = {
  id: number;
  url: string;
}

const variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Examples() {
  const items = [
    {
      id: 1,
      url: "/1.png"
    },
    {
      id: 2,
      url: "/1.png",
    },
    {
      id: 3,
      url: "/1.png",
    },
    {
      id: 4,
      url: "/1.png",
    },
    {
      id: 5,
      url: "/1.png",
    },
    {
      id: 6,
      url: "/1.png",
    }
  ]

  const [selected, setSelected] = useState<ImageProps | null>(null);

  return (
    <>
      <div className="container mx-auto p-4 max-w-7xl mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <>
            {items.map((item, index) => (
              <ImageItem
                key={index}
                item={item}
                index={index}
                setSelected={setSelected}
              />
            ))}
          </>
        </div>
      </div>
      <Modal selected={selected} setSelected={setSelected} />
    </>
  );
}

interface ImageItemProps {
  item: ImageProps;
  index: number;
  setSelected: any;
}

function ImageItem({ item, index, setSelected }: ImageItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.figure
      initial="hidden"
      animate={isInView && "visible"}
      ref={ref}
      className="inline-block group w-full relative dark:bg-black bg-white  before:absolute before:top-0 before:content-[''] before:h-full before:w-full hover:before:bg-gradient-to-t dark:before:from-gray-900  before:from-gray-900/50 before:from-5% before:to-transparent before:to-90% cursor-pointer rounded-md"
      onClick={() => setSelected(item)}
      variants={variants}
      transition={{
        duration: 1,
        delay: index * 0.1,
        ease: "easeInOut",
      }}
      viewport={{ amount: 0 }}
    >
      <motion.img
        layoutId={`card-${item.id}`}
        whileHover={{ scale: 1.025 }}
        src={item.url}
        className="w-full bg-base-100 shadow-xl image-full cursor-pointer rounded-md"
      />
      <div className="flex flex-wrap justify-end mt-2 absolute bottom-0 left-0 p-2 group-hover:opacity-100 opacity-0 font-semibold ">
        {/* Link button */}
        <div className="flex gap-2">
          <Button className="items-center px-2 py-2 w-10 h-10 bg-green-500 text-white rounded-full font-semibold">
            <ArrowUpRight size={20} />
          </Button>
        </div>
      </div>
    </motion.figure>
  );
}

interface ModalProps {
  selected: ImageProps | null;
  setSelected: any;
}
function Modal({ selected, setSelected }: ModalProps) {
  const itemVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.2, // Adjust the stagger delay as needed
      },
    },
    exit: {
      opacity: 0,
      y: 20,
    },
  };
  useEffect(() => {
    if (selected) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer overflow-y-scroll"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            layoutId={`card-${selected.id}`}
            className="w-full max-w-[1000px] relative overflow-x-hidden mx-auto my-8 cursor-default"
          >
            <button
              className="absolute top-2 right-2 p-2"
              onClick={() => setSelected(null)}
            >
              <X size={24} className="text-white font-bold" />
            </button>
            <motion.div className=" p-2 h-[90vh] rounded-md">
              <img
                width={400}
                height={400}
                alt="img"
                src={selected.url}
                className="w-full h-full object-contain rounded-md bg-transparent"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}