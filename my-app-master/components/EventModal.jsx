import React, { useContext, useState, Fragment, useRef } from "react"
import GlobalContext from "../../context/GlobalContext"
import { Dialog, Transition } from "@headlessui/react"
import { useSelector } from "react-redux"
import axios from "axios"
import { useContextAPI } from "../../contextAPI"
import { socialMedia } from "../../lib/socialDropdown"

const labelsClasses = ["Facebook", "Twitter", "TikTok", "Instagram"]
export default function EventModal() {
  const cancelButtonRef = useRef(null)
  const userPages = useSelector((state) => state.userPages.pages)
  const { userFbPageData } = useContextAPI()

  const faceBookPages = useSelector((state) => state.faceBookPages.data)
  const [Color, setColor] = useState()
  const {
    setShowEventModal,
    daySelected,
    timeSelected,
    setTimeSelected,
    dispatchCalEvent,
    selectedEvent,
    showEventModal,
  } = useContext(GlobalContext)

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "")
  const [description, setDescription] = useState(selectedEvent ? selectedEvent.description : "")
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent ? labelsClasses.find((lbl) => lbl === selectedEvent.label) : labelsClasses[0]
  )

  async function handleSubmit(e) {
    e.preventDefault()
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      time: timeSelected,
    }

    const minutes = timeSelected.split(":")[1]
    const hours = timeSelected.split(":")[0]
    const days = new Date(daySelected.valueOf()).getDate()
    const months = new Date(daySelected.valueOf()).getMonth() + 1
    const dayOfWeek = new Date(daySelected.valueOf()).getDay()

    const serverData = {
      time: `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`,
      pageId: faceBookPages[0].id,
      pageAccessToken: faceBookPages[0].access_token,
      message: description,
      timezone: "Asia/Shanghai",
    }

    console.log("serverData", serverData)

    try {
      const response = await axios.post(
        "https://buffer-371814.ue.r.appspot.com/facebook/",
        serverData
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    }

    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent })
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent })
    }

    setShowEventModal(false)
  }
  return (
    <Transition.Root show={showEventModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setShowEventModal}
      >
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-1/2 h-[70vh]">
                <div className="bg-white px-5 py-4 ">
                  <button onClick={() => console.log(new Date().getTimezoneOffset())}>
                    sjdhdjs
                  </button>
                  <form className=" w-full">
                    <div>
                      {selectedEvent && (
                        <span
                          onClick={() => {
                            dispatchCalEvent({
                              type: "delete",
                              payload: selectedEvent,
                            })
                            setShowEventModal(false)
                          }}
                          className="material-icons-outlined text-gray-400 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </span>
                      )}
                      <button onClick={() => setShowEventModal(false)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3">
                      <ul className="flex ">
                        {userPages?.map((page, index) => {
                          return (
                            <li key={index}>
                              <input
                                type="checkbox"
                                id={`userPages-option${page.id}`}
                                value=""
                                className="hidden peer"
                                required=""
                              />
                              <label
                                for={`userPages-option${page.id}`}
                                className="flex justify-between items-center p-0.5 h-12 w-12 text-gray-500 bg-white rounded-full border-2 border-gray-200 cursor-pointer peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 "
                              >
                                <img
                                  className="w-full h-full rounded-full"
                                  src={page?.banner?.image}
                                  alt="pageImage"
                                />
                              </label>
                            </li>
                          )
                        })}
                        {userFbPageData?.map((page, ind) => {
                          return (
                            <li key={ind}>
                              <input
                                type="checkbox"
                                id={`react-option${page.id}`}
                                value=""
                                className="hidden peer"
                                required=""
                              />
                              <label
                                for={`react-option${page.id}`}
                                className="flex justify-between items-center p-0.5 h-12 w-12 text-gray-500 bg-white rounded-full border-2 border-gray-200 cursor-pointer peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 "
                              >
                                <img
                                  className="w-full h-full rounded-full"
                                  src={page?.banner?.image}
                                  alt="pageImage"
                                />
                              </label>
                            </li>
                          )
                        })}
                      </ul>

                      <div className="grid grid-cols-1/5 items-end gap-y-7">
                        <div className="flex border p-2 my-4 rounded-md">
                          <div className="relative border-dotted w-56 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                            <div className="absolute">
                              <div className="flex flex-col items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  className="w-8 h-8 fill-cyan-700"
                                >
                                  <g>
                                    <path
                                      fill-rule="evenodd"
                                      d="M1 2.5A1.5 1.5 0 012.5 1h11A1.5 1.5 0 0115 2.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5v-11zm10.037 4.677a.667.667 0 00-1.157.01l-1.766 3.138a.667.667 0 01-1.084.11l-1.6-1.843a.667.667 0 00-1.062.074L2.29 11.87a.667.667 0 00.559 1.029h10.368a.667.667 0 00.575-1.003l-2.755-4.72zM5.2 5.9a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8z"
                                      clip-rule="evenodd"
                                    ></path>
                                  </g>
                                </svg>

                                <span className="block text-gray-400 font-normal">
                                  Attach you files
                                </span>
                              </div>
                            </div>

                            <input type="file" className="h-full w-full opacity-0" name="" />
                          </div>
                          <textarea
                            type="text"
                            name="description"
                            placeholder="your post"
                            value={description}
                            required
                            rows="6"
                            className="ml-2 p-2 border rounded-md text-black pb-2 w-full border-gray-200 "
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between border-t p-3 mt-3">
                      <span>
                        <p>{daySelected.format("dddd, MMMM DD")}</p>
                        <input
                          type="time"
                          defaultValue={
                            selectedEvent
                              ? selectedEvent.time
                              : new Date().getHours() + ":" + new Date().getMinutes()
                          }
                          onChange={(e) => setTimeSelected(e.target.value)}
                        />
                      </span>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 px-6 py-1 rounded text-white"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
