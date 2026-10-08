import { useEffect, useMemo, useState } from "react";

import { supabase } from "./supabaseClient";

import "./App.css";

/* =========================================================
   CHECKLIST ATTIVO
   ========================================================= */

const CHECKLIST_ATTIVO = [
  {
    category: "Cronometraggio / Active",
    items: [
      "Strutture mare Grande + cassetta",
      "Strutture mare Piccola + cassetta",
      "Arco americana + cassetta",
      "LED + cassetta",
      "UBIDIUM",
      "BLU",
      "NERI",
      "BLUEBERRY",
      "Tappeti - Mt 3",
      "Tappeti - Mt 4",
      "Tappeti - Mt 5",
      "Tappeti - Mt 6",
      "Tappeti - Mt 7",
      "Tappeti - Mt 8",
      "Tappeti - Mt 10",
      "Cassetta Loop (cavi, connettori, martello, chiodi, nastro americano)",
      "Aste + basi x antenne",
      "Router",
      "Router struttura",
      "Stampante",
      "Carta",
      "Toner",
      "Radio",
      "CAM ON",
      "Cavalletto",
      "Birilli",
    ],
  },
  {
    category: "Allestimento",
    items: [
      "Gazebo",
      "Tavolino",
      "Sedie",
      "Fascia arrivo",
      "Copricavi",
      "Podio a 5",
      "Podio a 3",
    ],
  },
  {
    category: "Cavi / Alimentazione / Attrezzatura",
    items: [
      "Cavi elettrici + prese + ciabatte",
      "Cavi di rete",
      "Batterie",
      "Power Bank",
      "Mini UPS",
      "Caricabatterie",
      "Salsicciotti",
      "Orologio bifacciale",
      "Orologio monofacciale",
      "Orologio per auto",
      "Adattatore orologio per struttura",
      "Borsa attrezzi",
      "Elettrosega",
    ],
  },
  {
    category: "Chip / Segreteria",
    items: [
      "Pettorali assegnati",
      "Chip assegnati",
      "Buste società",
      "Pettorali scorta",
      "Chip scorta",
      "Bidone chip",
      "Cassetta segreteria",
      "Etichette",
      "Cavigliere scorta",
      "Portapettorali scorta",
      "Boe scorta",
      "Chip multiuso scorta",
      "Cassa",
    ],
  },
  {
    category: "Fotofinish",
    items: [
      "Fotofinish",
      " + Computer",
      " + Cavalletto / Palo struttura",
      "PC segreteria",
    ],
  },
  {
    category: "Altro",
    items: [
      "Arco gonfiabile + motore",
    ],
  },
];

/* =========================================================
   CHECKLIST PASSIVO
   ========================================================= */

const CHECKLIST_PASSIVO = [
  {
    category: "Cronometraggio / Active",
    items: [
      "Arco americana + cassetta",
      "LED + cassetta",
      "LETTORI",
      "Quickline 3mt",
      "Quickline 4mt",
      "Quickline 6mt",
      "Quickline passacavi",
      "Pedana falsa",
      "Antenne quadre",
      "Aste alte + basi",
      "Aste basse + basi",
      "Tappeti - Mt 4",
      "Tappeti - Mt 5",
      "Tappeti - Mt 6",
      "Tappeti - Mt 7",
      "Tappeti - Mt 8",
      "Tappeti - Mt 10",
      "Cassetta Loop (cavi, connettori, martello, chiodi, nastro americano)",
      "Aste + basi x antenne",
      "Router + routerini",
      "Stampante",
      "Carta",
      "Toner",
      "Radio",
      "CAM ON",
      "Cavalletto",
      "Birilli",
    ],
  },

  {
    category: "Allestimento",
    items: [
      "Gazebo",
      "Tavolino",
      "Sedie",
      "Fascia arrivo",
      "Copricavi",
      "Podio a 5",
      "Podio a 3",
    ],
  },

  {
    category: "Cavi / Alimentazione / Attrezzatura",
    items: [
      "Cavi elettrici + prese + ciabatte",
      "Cavi di rete",
      "Batterie",
      "Power Bank",
      "Mini UPS",
      "Caricabatterie",
      "Salsicciotti",
      "Orologio bifacciale + supporto",
      "Orologio monofacciale + supporto",
      "Orologio per auto",
      "Adattatore orologio per struttura",
      "Borsa attrezzi",
      "Elettrosega",
    ],
  },

  {
    category: "Chip / Segreteria",
    items: [
      "Pettorali assegnati",
      "Chip assegnati",
      "Buste società",
      "Pettorali scorta",
      "Chip scorta",
      "Bidone chip",
      "Cassetta segreteria",
      "Etichette",
      "Cavigliere scorta",
      "Portapettorali scorta",
      "Boe scorta",
      "Chip multiuso scorta",
      "Cassa",
    ],
  },

  {
    category: "Fotofinish",
    items: [
      "Fotofinish",
      " + Computer",
      " + Cavalletto / Palo struttura",
      "PC segreteria",
    ],
  },
  {
    category: "Altro",
    items: [
      "Arco gonfiabile + motore",
    ],
  },
];


/* =========================================================
   CREA CHECKLIST
   ========================================================= */

function createChecklist(system = "attivo") {
  const source =
    system === "passivo"
      ? CHECKLIST_PASSIVO
      : CHECKLIST_ATTIVO;

  return source.map((group, groupIndex) => ({
    category: group.category,

    items: group.items.map((name, itemIndex) => ({
      id: `${groupIndex}-${itemIndex}-${Date.now()}-${Math.random()}`,
      name,
      quantity: 0,
      status: "da_preparare",
    })),
  }));
}


/* =========================================================
   MIGRAZIONE VECCHIE GARE
   ========================================================= */

function migrateRace(race) {
  return {
    ...race,

    // Le gare già esistenti vengono considerate Attivo
    system: race.system || "attivo",

    checklist: (race.checklist || []).map((group) => ({
      ...group,

      items: (group.items || []).map((item) => {
        let status = item.status;

        if (!status) {
          status = item.prepared
            ? "preparato"
            : "da_preparare";
        }

        return {
          ...item,
          quantity: Number(item.quantity) || 0,
          status,
        };
      }),
    })),
  };
}


/* =========================================================
   APP
   ========================================================= */

function App() {
  const [races, setRaces] = useState([]);

  const [selectedRaceId, setSelectedRaceId] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    discipline: "",
    system: "attivo",
  });


  /* =======================================================
     SALVATAGGIO AUTOMATICO
     ======================================================= */

  useEffect(() => {

    let mounted = true;

    async function loadRaces() {

      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("race_date", {
          ascending: true,
        });

      if (error) {

        console.error(
          "Errore caricamento gare:",
          error
        );

        return;

      }

      if (!mounted) return;

      const loadedRaces = (data || []).map((row) => {
        const migrated = migrateRace({
          ...row,
          date: row.race_date,
        });

        // Se la gara non ha ancora una checklist,
        // la crea in base al sistema scelto.
        if (
          (!migrated.checklist ||
            migrated.checklist.length === 0) &&
          migrated.system === "attivo"
        ) {
          migrated.checklist = createChecklist("attivo");
        }

        return migrated;
      });

      setRaces(loadedRaces);
      for (const race of loadedRaces) {
        const original = (data || []).find(
          (row) => row.id === race.id
        );

        if (
          original &&
          (!original.checklist ||
            original.checklist.length === 0) &&
          race.checklist.length > 0
        ) {
          await supabase
            .from("races")
            .update({
              checklist: race.checklist,
            })
            .eq("id", race.id);
        }
      }

    }

    loadRaces();


    const channel = supabase
      .channel("races-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "races",
        },
        (payload) => {

          if (payload.eventType === "INSERT") {

            const row = payload.new;

            const race = migrateRace({
              ...row,
              date: row.race_date,
            });

            setRaces((current) => {

              const exists = current.some(
                (item) => item.id === race.id
              );

              if (exists) {
                return current;
              }

              return [race, ...current];

            });

          }


          if (payload.eventType === "UPDATE") {
            const row = payload.new;

            setRaces((current) =>
              current.map((item) => {
                if (item.id !== row.id) {
                  return item;
                }

                const mergedRace = migrateRace({
                  ...item,
                  ...row,
                  date: row.race_date,

                  // Mantiene la checklist già presente
                  // se Supabase non la restituisce correttamente
                  checklist:
                    Array.isArray(row.checklist) &&
                    row.checklist.length > 0
                      ? row.checklist
                      : item.checklist,
                });

                return mergedRace;
              })
            );
          }


          if (payload.eventType === "DELETE") {

            const deletedId =
              payload.old.id;

            setRaces((current) =>
              current.filter(
                (item) =>
                  item.id !== deletedId
              )
            );

          }

        }
      )
      .subscribe();


    return () => {

      mounted = false;

      supabase.removeChannel(channel);

    };

  }, []);


  /* =======================================================
     GARA SELEZIONATA
     ======================================================= */

  const selectedRace = useMemo(() => {
    return races.find(
      (race) => race.id === selectedRaceId
    );
  }, [races, selectedRaceId]);


  /* =======================================================
     SISTEMA
     ======================================================= */

  function getSystemLabel(system) {
    return system === "passivo"
      ? "Passivo"
      : "Attivo";
  }


  /* =======================================================
     NUOVA GARA
     ======================================================= */

  function openNewRace() {
    setForm({
      name: "",
      location: "",
      date: "",
      discipline: "",
      system: "attivo",
    });

    setShowModal(true);
  }


  /* =======================================================
     CREAZIONE GARA
     ======================================================= */

  async function createRace(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Inserisci il nome della gara.");
      return;
    }

    if (!form.location.trim()) {
      alert("Inserisci la località.");
      return;
    }

    if (!form.date) {
      alert("Inserisci la data della gara.");
      return;
    }

    const checklist = createChecklist(form.system);

    const newRace = {
      name: form.name.trim(),
      location: form.location.trim(),
      race_date: form.date,
      discipline: form.discipline.trim(),
      system: form.system,
      checklist,
      notes: "",
    };

    const { data, error } = await supabase
      .from("races")
      .insert(newRace)
      .select()
      .single();

    if (error) {
      console.error("Errore creazione gara:", error);

      alert(
        "Errore durante la creazione della gara.\n\n" +
        error.message
      );

      return;
    }

    const race = migrateRace({
      ...data,
      date: data.race_date,
    });

    setRaces((current) => [
      race,
      ...current,
    ]);

    setShowModal(false);

    setSelectedRaceId(race.id);
  }


  /* =======================================================
     PROGRESSO
     ======================================================= */

  function getProgress(race) {
    let total = 0;
    let prepared = 0;
    let loaded = 0;

    race.checklist.forEach((group) => {
      group.items.forEach((item) => {
        total += 1;

        if (
          item.status === "preparato" ||
          item.status === "caricato"
        ) {
          prepared += 1;
        }

        if (item.status === "caricato") {
          loaded += 1;
        }
      });
    });

    return {
      total,
      prepared,
      loaded,

      preparedPercent:
        total > 0
          ? Math.round((prepared / total) * 100)
          : 0,

      loadedPercent:
        total > 0
          ? Math.round((loaded / total) * 100)
          : 0,
    };
  }


  /* =======================================================
     CAMBIO STATO
     ======================================================= */

  async function toggleItem(
    raceId,
    groupIndex,
    itemIndex
  ) {
    const race = races.find(
      (item) => item.id === raceId
    );

    if (!race) return;

    const checklist = race.checklist.map(
      (group, gIndex) => {
        if (gIndex !== groupIndex) {
          return group;
        }

        return {
          ...group,

          items: group.items.map(
            (item, iIndex) => {
              if (iIndex !== itemIndex) {
                return item;
              }

              let nextStatus;

              if (
                item.status ===
                "da_preparare"
              ) {
                nextStatus = "preparato";
              } else if (
                item.status ===
                "preparato"
              ) {
                nextStatus = "caricato";
              } else {
                nextStatus = "da_preparare";
              }

              return {
                ...item,
                status: nextStatus,
              };
            }
          ),
        };
      }
    );

    const { error } = await supabase
      .from("races")
      .update({
        checklist,
      })
      .eq("id", raceId);

    if (error) {
      console.error(
        "Errore aggiornamento stato:",
        error
      );

      alert(
        "Errore nel salvataggio dello stato.\n\n" +
        error.message
      );

      return;
    }

    setRaces((current) =>
      current.map((race) =>
        race.id === raceId
          ? {
              ...race,
              checklist,
            }
          : race
      )
    );
  }


  /* =======================================================
     CAMBIO QUANTITÀ
     ======================================================= */

  async function changeQuantity(
    raceId,
    groupIndex,
    itemIndex,
    amount
  ) {
    const race = races.find(
      (item) => item.id === raceId
    );

    if (!race) return;

    const checklist = race.checklist.map(
      (group, gIndex) => {
        if (gIndex !== groupIndex) {
          return group;
        }

        return {
          ...group,

          items: group.items.map(
            (item, iIndex) => {
              if (iIndex !== itemIndex) {
                return item;
              }

              return {
                ...item,
                quantity: Math.max(
                  0,
                  (Number(item.quantity) || 0) +
                    amount
                ),
              };
            }
          ),
        };
      }
    );

    const { error } = await supabase
      .from("races")
      .update({
        checklist,
      })
      .eq("id", raceId);

    if (error) {
      console.error(
        "Errore aggiornamento quantità:",
        error
      );

      alert(
        "Errore nel salvataggio della quantità.\n\n" +
        error.message
      );

      return;
    }

    setRaces((current) =>
      current.map((race) =>
        race.id === raceId
          ? {
              ...race,
              checklist,
            }
          : race
      )
    );
  }


  /* =======================================================
     NOTE
     ======================================================= */

  async function updateNotes(raceId, value) {
    const { error } = await supabase
      .from("races")
      .update({ notes: value })
      .eq("id", raceId);

    if (error) {
      console.error("Errore aggiornamento note:", error);
      alert(
        "Errore nel salvataggio delle note.\n\n" +
        error.message
      );
      return;
    }

    setRaces((current) =>
      current.map((race) =>
        race.id === raceId
          ? { ...race, notes: value }
          : race
      )
    );
  }


  /* =======================================================
     ELIMINA GARA
     ======================================================= */

  async function deleteRace() {
    if (!selectedRace) return;

    const confirmed = window.confirm(
      `Vuoi eliminare definitivamente la gara "${selectedRace.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("races")
      .delete()
      .eq("id", selectedRace.id);

    if (error) {
      console.error("Errore eliminazione gara:", error);
      alert(
        "Errore durante l'eliminazione della gara.\n\n" +
        error.message
      );
      return;
    }

    setRaces((current) =>
      current.filter(
        (race) => race.id !== selectedRace.id
      )
    );

    setSelectedRaceId(null);
  }


  /* =======================================================
     TORNA ALLA LISTA
     ======================================================= */

  function goBack() {
    setSelectedRaceId(null);
  }


  /* =======================================================
     DETTAGLIO GARA
     ======================================================= */

  if (selectedRace) {
    const progress =
      getProgress(selectedRace);

    return (
      <div className="app">

        <header className="app-header">

          <button
            className="back-button"
            onClick={goBack}
          >
            ← Gare
          </button>

          <div className="header-title">

            <h1>
              {selectedRace.name}
            </h1>

            <div className="header-subtitle">
              {selectedRace.location}
              {" · "}
              {selectedRace.date}
              {" · "}
              {selectedRace.discipline ||
                "Disciplina non specificata"}
            </div>

            <div
              className={`system-badge ${
                selectedRace.system ===
                "passivo"
                  ? "system-passivo"
                  : "system-attivo"
              }`}
            >
              {selectedRace.system ===
              "passivo"
                ? "🔵 Passivo"
                : "🟢 Attivo"}
            </div>

          </div>

          <button
            className="delete-race-button"
            onClick={deleteRace}
          >
            🗑 Elimina gara
          </button>

        </header>


        <main className="content">

          {/* =============================================
              PROGRESSO
              ============================================= */}

          <section className="summary-card">

            <div className="summary-line">

              <strong>
                Preparazione
              </strong>

              <span>
                {progress.preparedPercent}%
              </span>

            </div>

            <div className="progress-bar">
              <div
                className="progress-fill prepared"
                style={{
                  width: `${progress.preparedPercent}%`,
                }}
              />
            </div>


            <div className="summary-line">

              <strong>
                Caricato
              </strong>

              <span>
                {progress.loadedPercent}%
              </span>

            </div>

            <div className="progress-bar">
              <div
                className="progress-fill loaded"
                style={{
                  width: `${progress.loadedPercent}%`,
                }}
              />
            </div>

          </section>


          {/* =============================================
              CHECKLIST VUOTA
              ============================================= */}

          {selectedRace.checklist.length ===
          0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📋
              </div>

              <h2>
                Checklist non ancora disponibile
              </h2>

              <p>
                La checklist del sistema{" "}
                <strong>
                  {getSystemLabel(
                    selectedRace.system
                  )}
                </strong>{" "}
                verrà aggiunta successivamente.
              </p>

            </div>

          ) : (

            /* ===========================================
               CHECKLIST
               =========================================== */

            <div className="checklist">

              {selectedRace.checklist.map(
                (group, groupIndex) => (

                  <section
                    className="checklist-group"
                    key={group.category}
                  >

                    <h2>
                      {group.category}
                    </h2>

                    <div className="items">

                      {group.items.map(
                        (item, itemIndex) => (

                          <div
                            className={`checklist-item ${item.status}`}
                            key={item.id}
                          >

                            {/* =========================
                                TICK A SINISTRA
                                ========================= */}

                            <button
                              type="button"
                              className={`check-button status-${item.status}`}
                              onClick={() =>
                                toggleItem(
                                  selectedRace.id,
                                  groupIndex,
                                  itemIndex
                                )
                              }
                            >
                              ✓
                            </button>


                            {/* =========================
                                ITEM AL CENTRO
                                ========================= */}

                            <div className="item-name">
                              {item.name}
                            </div>


                            {/* =========================
                                QUANTITÀ A DESTRA
                                ========================= */}

                            <div className="quantity-control">

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(
                                    selectedRace.id,
                                    groupIndex,
                                    itemIndex,
                                    -1
                                  )
                                }
                              >
                                −
                              </button>

                              <strong>
                                {item.quantity}
                              </strong>

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuantity(
                                    selectedRace.id,
                                    groupIndex,
                                    itemIndex,
                                    1
                                  )
                                }
                              >
                                +
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </section>

                )
              )}

            </div>

          )}


          {/* =============================================
              NOTE
              ============================================= */}

          <section className="notes-card">

            <h2>
              Note gara
            </h2>

            <textarea
              value={selectedRace.notes || ""}
              onChange={(event) =>
                updateNotes(
                  selectedRace.id,
                  event.target.value
                )
              }
              placeholder="Inserisci eventuali note..."
            />

          </section>

        </main>

      </div>
    );
  }


  /* =======================================================
     LISTA GARE
     ======================================================= */

  return (
    <div className="app">

      <header className="app-header">

        <div className="header-title">

          <h1>
            Le mie gare
          </h1>

          <div className="header-subtitle">
            Gestione materiale e preparazione
          </div>

        </div>

        <button
          className="primary-button"
          onClick={openNewRace}
        >
          + Nuova gara
        </button>

      </header>


      <main className="content">

        {races.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🏁
            </div>

            <h2>
              Nessuna gara
            </h2>

            <p>
              Crea la prima gara per iniziare
              a preparare il materiale.
            </p>

            <button
              className="primary-button"
              onClick={openNewRace}
            >
              + Crea gara
            </button>

          </div>

        ) : (

          <div className="races-list">

            {races.map((race) => {

              const progress =
                getProgress(race);

              return (
                <button
                  className="race-card"
                  key={race.id}
                  onClick={() =>
                    setSelectedRaceId(
                      race.id
                    )
                  }
                >

                  <div className="race-card-top">

                    <div>

                      <h2>
                        {race.name}
                      </h2>

                      <div className="race-location">
                        📍 {race.location}
                      </div>

                      <div className="race-date">
                        📅 {race.date}
                      </div>

                    </div>


                    <div
                      className={`system-badge ${
                        race.system ===
                        "passivo"
                          ? "system-passivo"
                          : "system-attivo"
                      }`}
                    >
                      {race.system ===
                      "passivo"
                        ? "🔵 Passivo"
                        : "🟢 Attivo"}
                    </div>

                  </div>


                  <div className="race-progress">

                    <div className="race-progress-label">

                      <span>
                        Preparazione
                      </span>

                      <strong>
                        {progress.preparedPercent}%
                      </strong>

                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress-fill prepared"
                        style={{
                          width: `${progress.preparedPercent}%`,
                        }}
                      />

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        )}

      </main>


      {/* ===================================================
          MODALE NUOVA GARA
          =================================================== */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Nuova gara
              </h2>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={createRace}
            >

              <label>

                Nome gara

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name:
                        event.target.value,
                    })
                  }
                  placeholder="Es. Trofeo Città di Bari"
                  autoFocus
                />

              </label>


              <label>

                Località

                <input
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      location:
                        event.target.value,
                    })
                  }
                  placeholder="Es. Bari"
                />

              </label>


              <label>

                Data

                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      date:
                        event.target.value,
                    })
                  }
                />

              </label>


              <label>

                Disciplina

                <input
                  type="text"
                  value={form.discipline}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      discipline:
                        event.target.value,
                    })
                  }
                  placeholder="Es. Ciclismo"
                />

              </label>


              <label>

                Sistema

                <select
                  value={form.system}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      system:
                        event.target.value,
                    })
                  }
                >
                  <option value="attivo">
                    Attivo
                  </option>

                  <option value="passivo">
                    Passivo
                  </option>
                </select>

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Annulla
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Crea gara
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;