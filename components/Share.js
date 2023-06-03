import React from 'react';
import { Fragment, useRef, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';

export default function Share({ promptTemplate }) {
  const router = useRouter();
  const inputRef = useRef(null)
  const [isLoadingShare, setIsLoadingShare] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')

  const handleShare = async (e) => {
    e.preventDefault();
    setIsLoadingShare(true);
    await share(promptTemplate);
    setIsModalOpen(true);
    setIsLoadingShare(false);
  };

  const share = async (promptTemplate) => {
    await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ promptTemplate })
      })
      .then((response) => response.json())
      .then((data) => {
        const newUrl = `/?id=${data.id}`;
        router.push(newUrl, newUrl, { shallow: true });
        setShareLink(`${window.location.origin}${newUrl}`);
      })
      .catch((error) => {
        console.error('Failed to share:', error);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  });

  return (
    <div>
      {!isLoadingShare && (
        <button className="button button--secondary ml-4 h-15" onClick={handleShare}>
          Share prompt
        </button>
      )}

      {isLoadingShare && (
        <button type="button" className="button button--secondary ml-4 inline-flex items-center opacity-50" disabled>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="inline-block align-middle">Loading…</span>
        </button>
      )}

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={inputRef} onClose={() => setIsModalOpen(false)}>
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
                          value={shareLink}
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
    </div>
  )
}
