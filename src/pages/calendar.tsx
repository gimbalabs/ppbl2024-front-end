export default function CalendarPage() {
    return (
      <main className="items-center justify-center" style={{ minHeight: "calc(100vh - 5rem)" }}>
        <div className="shadow-xl md:mx-5 md:mt-5 z-10 p-5">
          <h1 className="pt-5 text-4xl">Live Coding Calendar</h1>
          <p className="py-3">Gimbalabs hosts a series of weekly meetings for people who are learning Cardano development. We also record most sessions and post to the Gimbalabs YouTube channel.</p>
          <div className="">
            <section className="realtive">
              <iframe
                src="https://teamup.com/ks359aocim5rmjch1o?title=Gimbalabs%20Calendar&showLogo=0&showSearch=0&showProfileAndInfo=0&showSidepanel=1&disableSidepanel=1&showTitle=0&showViewSelector=1&showMenu=0&showAgendaHeader=1&showAgendaDetails=0&showYearViewHeader=1"
                width="100%"
                height="600px"
              ></iframe>
            </section>
          </div>
        </div>
      </main>
    );
  }