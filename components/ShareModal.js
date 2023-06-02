import React from 'react';
import { Fragment, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function ShareModal({ isModalOpen, setIsModalOpen }) {
  const cancelButtonRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  });

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setIsModalOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white p-5 pb-4">
                  <div className="mt-3 pb-4 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl pb-2 font-semibold">
                      Copy link
                    </Dialog.Title>
                    <div className="mt-2">
                      <input
                        ref={inputRef}
                        type="text"
                        name="share-prompt"
                        id="share-prompt"
                        className="rounded-md w-full rounded-md"
                        value="https://prompter.fofr.ai/?1234"
                        readOnly={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="button mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm sm:mt-0 sm:w-auto"
                    onClick={() => setIsModalOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
