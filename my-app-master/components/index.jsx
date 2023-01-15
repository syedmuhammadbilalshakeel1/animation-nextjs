import React from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { INITIAL_EVENTS, createEventId } from "./event";
// import DemoApp from "./new";
// import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

export default function DemoApp(state) {
  state = {
    weekendsVisible: true,
    currentEvents: [],
  };
  return (
    <>
      <div className="demo-app">
        {Sidebar()}
        <div className="demo-app-main">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,list",
            }}
            initialView="dayGridMonth"
            // initialView='listWeek'
            // droppable={true}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            listDayFormat={true}
            weekends={state.weekendsVisible}
            initialEvents={INITIAL_EVENTS}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventsSet={handleEvents}
          />
        </div>
      </div>
    </>
  );
  
  function Sidebar() {
    return (
      <div className="demo-app-sidebar text-white">
        {/* <div className="demo-app-sidebar-section">
          
        </div> */}
        <div className="demo-app-sidebar-section">
          <label>
            <input
              type="checkbox"
              checked={state.weekendsVisible}
              onChange={handleWeekendsToggle}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className="demo-app-sidebar-section">
          <h2>All Events ({state.currentEvents.length})</h2>
          <ul>{state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  function handleWeekendsToggle() {
    try {
      setState({
        weekendsVisible: !this.state.weekendsVisible,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    // clear date selection into it
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events) {
    try {
      setState({
        currentEvents: events,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
